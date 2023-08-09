'use client'

import { Category } from '@prisma/client'
import { Button } from './ui/button'

import { useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

interface Props {
  data: Category[]
}

const Categories = ({ data }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = searchParams.get('categoryId')

  const handleClick = (id: number | null) => {
    const query = { categoryId: id }

    if (categoryId == id) {
      query.categoryId = null
    }

    const url = qs.stringifyUrl(
      { url: window.location.href, query },
      { skipNull: true }
    )

    router.push(url)
  }

  return (
    <div className='flex gap-2 items-center w-full'>
      <Button
        variant={!categoryId ? 'default' : 'secondary'}
        onClick={() => handleClick(null)}
      >
        All
      </Button>
      {data.map((item) => (
        <Button
          key={item.id}
          variant={Number(categoryId) == item.id ? 'default' : 'secondary'}
          onClick={() => handleClick(item.id)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  )
}

export default Categories
