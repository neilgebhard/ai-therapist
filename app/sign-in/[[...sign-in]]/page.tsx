import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='min-h-screen grid place-items-center'>
      <SignIn />
    </div>
  )
}
