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

const INSTRUCTIONS = `You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.`

const SEED = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    const user = await currentUser()

    if (!user || !user.firstName || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const identifier = request.url + '-' + user.id
    const { success } = await rateLimit(identifier)

    if (!success) {
      return new NextResponse('Rate limit exceeded', { status: 429 })
    }

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

    const therapist_file_name = therapist.id + '.txt'

    const memoryManager = await MemoryManager.getInstance()

    const records = await memoryManager.readLatestHistory(user.id)
    if (records.length === 0) {
      await memoryManager.seedChatHistory(SEED, '\n\n', user.id)
    }
    await memoryManager.writeToHistory('User: ' + prompt + '\n', user.id)

    // Query Pinecone

    const recentChatHistory = await memoryManager.readLatestHistory(user.id)

    // Right now the preamble is included in the similarity search, but that
    // shouldn't be an issue

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
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${'Elon'}: prefix. 

        ${INSTRUCTIONS}

        Below are relevant details about ${"Elon's"}'s past and the conversation you are in.

        ${relevantHistory}

        ${recentChatHistory}\n${'Elon'}:`
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
