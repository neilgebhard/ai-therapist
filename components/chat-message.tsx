import { Avatar, AvatarFallback } from './ui/avatar'
import AiAvatar from './ai-avatar'
import UserAvatar from './user-avatar'
import { cn } from '@/lib/utils'

export interface Props {
  role: 'system' | 'user'
  isLoading: boolean
  content: string
}

const ChatMessage = ({ role, content, isLoading }: Props) => {
  return (
    <div className='flex gap-4'>
      {role === 'system' && <AiAvatar />}
      {role === 'user' && <UserAvatar />}
      {isLoading && <div>loading...</div>}
      {!isLoading && (
        <div
          className={cn(
            'p-4 rounded-xl text-sm',
            role === 'system' ? 'bg-primary/20' : 'bg-primary/10'
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default ChatMessage
