import { UserButton } from '@clerk/nextjs'
import { Roboto_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from './ui/button'
import { BatteryCharging } from 'lucide-react'

const roboto = Roboto_Mono({ subsets: ['latin'], weight: '700' })

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center gap-2 py-2 px-4 border-b'>
      <Link href='/'>
        <h1 className={cn('font-bold text-2xl', roboto.className)}>
          AI Therapist
        </h1>
      </Link>
      <div className='flex items-center gap-2'>
        <Button size='sm'>
          <BatteryCharging className='w-4 h-4 mr-2' />
          Get Ad-Free
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}

export default Navbar
