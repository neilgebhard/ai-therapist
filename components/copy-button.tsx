import { Copy } from 'lucide-react'
import { Button } from './ui/button'

interface Props {
  content: string
}

const CopyButton = ({ content }: Props) => {
  const handleClick = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
  }

  return (
    <Button variant='ghost' size='icon' onClick={handleClick}>
      <Copy className='text-primary/30 h-4 w-4 hover:text-primary cursor-pointer' />
    </Button>
  )
}

export default CopyButton
