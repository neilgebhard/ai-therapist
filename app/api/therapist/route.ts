import dotenv from 'dotenv'
import { StreamingTextResponse, LangChainStream } from 'ai'
import { currentUser } from '@clerk/nextjs'
import { Replicate } from 'langchain/llms/replicate'
import { CallbackManager } from 'langchain/callbacks'
import { NextResponse } from 'next/server'

import { MemoryManager } from '@/lib/memory'
import { rateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/db'

dotenv.config({ path: `.env` })

const INSTRUCTIONS = `You are a warm, compassionate personal therapist with excellent listening, observation skills, and good ethics. You have a PhD in psychology. You have a passion for helping patients with their mental health and problems.`

const SEED = `
Therapist: How are you doing today?
Human: I'm doing okay. How are you?
Therapist: I'm doing well. What's on your mind?
Human: I'm just feeling a little stressed out. I have a lot of work to do and I'm not sure how I'm going to get it all done.
Therapist: I'm sorry to hear that. What kind of work do you have to do?
Human: I have to write a paper for my English class, study for a test in my history class, and finish a project for my computer science class.
Therapist: That sounds like a lot of work. Do you have any friends or family members who can help you?
Human: I do, but they're all busy with their own work.
`

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
    const records = await memoryManager.readLatestHistory(user.id)

    // if (records.length === 0) {
    //   await memoryManager.seedChatHistory(SEED, '\n\n', user.id)
    // }

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
    const { handlers } = LangChainStream()

    // Call Replicate for inference
    const model = new Replicate({
      model:
        'a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5',
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    })

    // Turn verbose on for debugging
    model.verbose = true

    const resp = String(
      await model
        .call(
          `
        ONLY generate plain sentences without prefix of who is speaking.

        ${INSTRUCTIONS}

        Below are relevant details about you and the conversation you are in.

        ${relevantHistory}

        ${recentChatHistory}\n`
        )
        .catch(console.error)
    )

    const cleaned = resp.replaceAll(',', '')
    const chunks = cleaned.split('\n')
    const response = chunks[0]
    console.log(chunks, response)

    await memoryManager.writeToHistory('' + response.trim(), user.id)
    var Readable = require('stream').Readable

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
