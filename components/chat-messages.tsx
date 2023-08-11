'use client'

import { Message, Therapist } from '@prisma/client'
import ChatMessage, { MessageProps } from './chat-message'

interface Props {
  isLoading: boolean
  messages: MessageProps[]
  therapist: Therapist & {
    messages: Message[]
  }
}

const ChatMessages = ({ isLoading, messages, therapist }: Props) => {
  return (
    <div className='flex-1 overflow-y-auto space-y-4'>
      {/* {messages.map((message) => {
        return (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={messages.content}
            isLoading={isLoading}
          />
        )
      })} */}
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
    </div>
  )
}

export default ChatMessages
