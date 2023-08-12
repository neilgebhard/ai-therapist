'use client'

import { Message, Therapist } from '@prisma/client'
import ChatMessage, { ChatMessageProps } from './chat-message'

interface Props {
  isLoading: boolean
  messages: ChatMessageProps[]
  therapist: Therapist & {
    messages: Message[]
  }
}

const ChatMessages = ({ isLoading, messages, therapist }: Props) => {
  return (
    <div className='flex-1 overflow-y-auto space-y-4'>
      <ChatMessage
        role='system'
        content={
          'Hello, I am your personal therapist. How may I help you today?'
        }
        isLoading={false}
      />
      <ChatMessage
        role='user'
        content={
          'Hello, I am your personal therapist. How may I help you today?'
        }
        isLoading={false}
      />
      {messages.map((message, i) => (
        <ChatMessage
          key={i}
          role={message.role}
          content={message.content}
          isLoading
        />
      ))}
      {isLoading && <ChatMessage role='system' isLoading={isLoading} />}
    </div>
  )
}

export default ChatMessages
