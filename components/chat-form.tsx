'use client'

import { ChangeEvent, FormEvent } from 'react'
import { ChatRequestOptions } from 'ai'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'

interface Props {
  isLoading: boolean
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void
}

const ChatForm = ({ isLoading, handleInputChange, onSubmit, input }: Props) => {
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
      />
      <Button type='submit' variant='ghost' disabled={isLoading}>
        <SendHorizonal />
      </Button>
    </form>
  )
}

export default ChatForm
