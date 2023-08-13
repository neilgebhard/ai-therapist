'use client'

import { ChangeEvent, FormEvent, useEffect, useRef } from 'react'
import { ChatRequestOptions } from 'ai'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'
import { ChatMessageProps } from './chat-message'

interface Props {
  isLoading: boolean
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void
  messages: ChatMessageProps[]
}

const ChatForm = ({
  isLoading,
  handleInputChange,
  onSubmit,
  input,
  messages,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef.current) throw Error('inputRef is not assigned')
    inputRef.current.focus()
  }, [messages])

  return (
    <form
      className='flex w-full items-center space-x-2 mb-3'
      onSubmit={onSubmit}
    >
      <Input
        className='p-6 bg-primary/10 border-primary/10 text-md'
        type='text'
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
        placeholder='Send a message'
        ref={inputRef}
      />
      <Button type='submit' variant='ghost' disabled={isLoading}>
        <SendHorizonal />
      </Button>
    </form>
  )
}

export default ChatForm
