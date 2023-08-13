'use client'

import { Message, Therapist } from '@prisma/client'
import ChatMessage, { ChatMessageProps } from './chat-message'
import { useEffect, useRef } from 'react'

interface Props {
  isLoading: boolean
  messages: ChatMessageProps[]
  therapist: Therapist & {
    messages: Message[]
  }
}

const ChatMessages = ({ isLoading, messages, therapist }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

  return (
    <div className='flex-1 overflow-y-auto space-y-4'>
      <ChatMessage
        role='system'
        content={
          'Hello, I am your personal therapist. How are you doing today?'
        }
        isLoading={false}
      />
      {messages.map((message, i) => (
        <ChatMessage key={i} role={message.role} content={message.content} />
      ))}
      {isLoading && <ChatMessage role='system' content='' isLoading />}
      <div ref={scrollRef} />
    </div>
  )
}

export default ChatMessages
