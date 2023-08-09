import Categories from '@/components/categories'
import Container from '@/components/container'
import { prisma } from '@/lib/db'

const Home = async () => {
  const categories = await prisma.category.findMany()
  return (
    <Container>
      <div className='mt-4'>
        <Categories data={categories} />
      </div>
    </Container>
  )
}

export default Home
