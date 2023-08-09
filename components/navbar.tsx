import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Roboto_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { BatteryCharging } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

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
        <Button size='sm' variant='secondary'>
          <BatteryCharging className='w-5 h-5 mr-2' />
          Get Ad-Free
        </Button>
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  )
}

export default Navbar
