import AiAvatar from './ai-avatar'
import UserAvatar from './user-avatar'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { RiseLoader } from 'react-spinners'
import CopyButton from './copy-button'

export interface ChatMessageProps {
  role: 'system' | 'user'
  content: string
  isLoading?: boolean
}

const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const { theme } = useTheme()

  return (
    <div className={cn('flex gap-4', role === 'user' && 'justify-end')}>
      {role === 'system' && <AiAvatar />}
      <div
        className={cn(
          'p-4 rounded-xl text-sm',
          role === 'system' ? 'bg-primary/20' : 'bg-primary/5'
        )}
      >
        {isLoading ? (
          <RiseLoader size={7} color={theme === 'light' ? 'black' : 'white'} />
        ) : (
          content
        )}
      </div>
      {role === 'system' && <CopyButton content={content} />}
      {role === 'user' && <UserAvatar />}
    </div>
  )
}

export default ChatMessage
