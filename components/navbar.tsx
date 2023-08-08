import { UserButton } from '@clerk/nextjs'
import { Tektur } from 'next/font/google'
import { cn } from '@/lib/utils'

const tektur = Tektur({ subsets: ['latin'], weight: '900' })

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center gap-2 p-4 border-b'>
      <h1 className={cn('font-bold text-2xl', tektur.className)}>
        AI Therapist
      </h1>
      <UserButton />
    </nav>
  )
}

export default Navbar
