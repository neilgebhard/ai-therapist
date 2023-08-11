import { Message, Therapist } from '@prisma/client'

interface Props {
  therapist: Therapist & {
    messages: Message[]
  }
}

const Client = ({ therapist }: Props) => {
  return (
    <div className='flex flex-col gap-2 pt-[75px] h-full'>
      <pre>{JSON.stringify(therapist, null, 2)}</pre>
      <pre className='flex-1'>{JSON.stringify(therapist, null, 2)}</pre>
      <pre>{JSON.stringify(therapist, null, 2)}</pre>
    </div>
  )
}

export default Client
