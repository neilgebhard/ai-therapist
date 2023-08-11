import AiAvatar from './ai-avatar'
import UserAvatar from './user-avatar'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { RiseLoader } from 'react-spinners'
import CopyButton from './copy-button'

export interface Props {
  role: 'system' | 'user'
  isLoading: boolean
  content: string
}

const ChatMessage = ({ role, content, isLoading }: Props) => {
  const { theme } = useTheme()

  return (
    <div className='flex gap-4'>
      {role === 'system' && <AiAvatar />}
      {role === 'user' && <UserAvatar />}
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
    </div>
  )
}

export default ChatMessage
