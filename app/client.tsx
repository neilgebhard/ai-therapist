'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompletion } from 'ai/react'
import { Message, Therapist } from '@prisma/client'
import ChatForm from '@/components/chat-form'

interface Props {
  therapist: Therapist & {
    messages: Message[]
  }
}

const Client = ({ therapist }: Props) => {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>(therapist.messages)

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/therapist/${therapist.id}`,
      onFinish(_, completion) {
        const systemMessage = {
          role: 'system',
          content: completion,
        }
        setMessages((messages) => [...messages, systemMessage])
        setInput('')
        router.refresh()
      },
    })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage = {
      role: 'user',
      content: input,
    }
    setMessages((messages) => [...messages, userMessage])

    handleSubmit(e)
  }

  return (
    <div className='flex flex-col gap-2 pt-[74px] h-full'>
      <pre className='flex-1 bg-teal-800 rounded'>
        {JSON.stringify(therapist, null, 2)}
      </pre>
      <ChatForm
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
        input={input}
      />
    </div>
  )
}

export default Client
