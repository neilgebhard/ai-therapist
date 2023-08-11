'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompletion } from 'ai/react'
import { Message, Therapist } from '@prisma/client'
import ChatForm from '@/components/chat-form'
import ChatMessages from '@/components/chat-messages'
import { MessageProps } from '@/components/chat-message'

interface Props {
  therapist: Therapist & {
    messages: Message[]
  }
}

const Client = ({ therapist }: Props) => {
  const router = useRouter()
  const [messages, setMessages] = useState<MessageProps[]>(therapist.messages)

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/therapist/${therapist.id}`,
      onFinish(_, completion) {
        const systemMessage: MessageProps = {
          role: 'system',
          content: completion,
        }
        setMessages((messages) => [...messages, systemMessage])
        setInput('')
        router.refresh()
      },
    })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: MessageProps = {
      role: 'user',
      content: input,
    }
    setMessages((messages) => [...messages, userMessage])

    handleSubmit(e)
  }

  return (
    <div className='flex flex-col gap-2 pt-[75px] h-full'>
      <ChatMessages
        isLoading={isLoading}
        messages={messages}
        therapist={therapist}
      />
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
