// node file to seed the database with dummy data
// run with `node scripts/seed.ts`

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.category.createMany({
      data: [
        { name: 'Electronics' },
        { name: 'Books' },
        { name: 'Clothing' },
        { name: 'Home' },
      ],
    })
  } catch (e) {
    console.error('Error seeding categories', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
