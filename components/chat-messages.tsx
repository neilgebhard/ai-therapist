'use client'

import { Message, Therapist } from '@prisma/client'
import ChatMessage from './chat-message'

interface Props {
  isLoading: boolean
  messages: Message[]
  therapist: Therapist & {
    messages: Message[]
  }
}

const ChatMessages = ({ isLoading, messages, therapist }: Props) => {
  return (
    <div className='flex-1 overflow-y-auto'>
      {/* {messages.map((message) => ( */}
      <ChatMessage
        //   key={message.id}
        //   role={message.role}
        role='user'
        content={
          'Hello, I am your personal therapist. How may I help you today?'
        }
        isLoading={isLoading}
      />
      {/* ))} */}
    </div>
  )
}

export default ChatMessages
