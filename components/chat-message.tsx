export interface Props {
  role: 'system' | 'user'
  isLoading: boolean
  content: string
}

const ChatMessage = ({ role, content, isLoading }: Props) => {
  return <div>{content}</div>
}

export default ChatMessage
