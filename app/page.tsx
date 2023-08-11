import Container from '@/components/container'
import { prisma } from '@/lib/db'
import { auth, redirectToSignIn } from '@clerk/nextjs'
import Client from './client'

const Home = async () => {
  const { userId } = auth()

  if (!userId) return redirectToSignIn()

  let therapist

  therapist = await prisma.therapist.findUnique({
    where: {
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          userId,
        },
      },
    },
  })

  if (!therapist) {
    therapist = await prisma.therapist.create({
      data: {
        userId: userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            userId,
          },
        },
      },
    })
  }

  return (
    <Container>
      <Client therapist={therapist} />
    </Container>
  )
}

export default Home
