import { Avatar, AvatarFallback } from './ui/avatar'

const AiAvatar = () => {
  return (
    <Avatar>
      <AvatarFallback className='bg-gradient-to-r from-teal-500 to-blue-500 font-semibold text-white'>
        AI
      </AvatarFallback>
    </Avatar>
  )
}

export default AiAvatar
