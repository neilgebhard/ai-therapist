import Container from '@/components/container'
import { auth, redirectToSignIn } from '@clerk/nextjs'

const Home = async () => {
  const { userId } = auth()
  if (!userId) redirectToSignIn()

  return <Container>Home</Container>
}

export default Home
