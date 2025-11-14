import dotenv from 'dotenv'
import { StreamingTextResponse } from 'ai'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { MemoryManager } from '@/lib/memory'
import { rateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/db'
import Replicate from 'replicate'

dotenv.config({ path: `.env` })

const INSTRUCTIONS = `You are a personal therapist`

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    const user = await currentUser()

    if (!user || !user.firstName || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // rate limit
    const identifier = request.url + '-' + user.id
    const { success } = await rateLimit(identifier)

    if (!success) {
      return new NextResponse('Rate limit exceeded', { status: 429 })
    }

    // insert prompt to db
    const therapist = await prisma.therapist.update({
      where: {
        userId: user.id,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: 'user',
            userId: user.id,
          },
        },
      },
    })

    if (!therapist) {
      return new NextResponse('Therapist not found', { status: 404 })
    }

    // query pinecone
    const therapist_file_name = therapist.id + '.txt'
    const memoryManager = await MemoryManager.getInstance()

    await memoryManager.writeToHistory('User: ' + prompt + '\n', user.id)
    const recentChatHistory = await memoryManager.readLatestHistory(user.id)

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      therapist_file_name
    )

    let relevantHistory = ''
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n')
    }

    // await memoryManager.writeToHistory('' + response.trim(), user.id)
    var Readable = require('stream').Readable

    const context = `
        ONLY generate plain sentences without prefix of who is speaking.

        ${INSTRUCTIONS}

        Below are relevant details about you and the conversation you are in.

        ${relevantHistory}

        ${recentChatHistory}\nYou:`

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    const input = {
      prompt: context,
      messages: [],
      verbosity: 'low',
      image_input: [],
      reasoning_effort: 'minimal',
    }

    const output = await replicate.run('openai/gpt-5-nano', {
      input,
    })

    const response = (output as string[]).join('')

    let s = new Readable()
    s.push(response)
    s.push(null)
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory('' + response.trim(), user.id)

      await prisma.therapist.update({
        where: {
          userId: user.id,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: 'system',
              userId: user.id,
            },
          },
        },
      })
    }

    return new StreamingTextResponse(s)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
