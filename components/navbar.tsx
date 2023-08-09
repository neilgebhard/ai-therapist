import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Roboto_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { BatteryCharging } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import Container from './container'

const roboto = Roboto_Mono({ subsets: ['latin'], weight: '700' })

const Navbar = () => {
  return (
    <nav className='py-2 border-b'>
      <Container>
        <div className='flex justify-between items-center gap-2'>
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
        </div>
      </Container>
    </nav>
  )
}

export default Navbar
