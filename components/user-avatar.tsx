import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const UserAvatar = () => {
  const { user } = useUser()

  return (
    <Avatar>
      <AvatarImage src={user?.imageUrl} alt='User Avatar' />
      <AvatarFallback className='bg-primary/5'>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
