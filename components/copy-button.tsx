import { Copy } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

interface Props {
  content: string
}

const CopyButton = ({ content }: Props) => {
  const { toast } = useToast()

  const handleClick = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
    toast({
      description: 'Message copied to clipboard!',
      duration: 3000,
    })
  }

  return (
    <Button variant='ghost' size='icon' onClick={handleClick}>
      <Copy className='text-primary/30 h-4 w-4 hover:text-primary cursor-pointer' />
    </Button>
  )
}

export default CopyButton
