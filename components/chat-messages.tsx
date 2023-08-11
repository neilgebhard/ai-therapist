'use client'

import { Message, Therapist } from '@prisma/client'

interface Props {
  isLoading: boolean
  messages: Message[]
  therapist: Therapist & {
    messages: Message[]
  }
}

const ChatMessages = ({ isLoading, messages, therapist }: Props) => {
  return <div className='flex-1 overflow-y-auto'>Chat Messages</div>
}

export default ChatMessages
