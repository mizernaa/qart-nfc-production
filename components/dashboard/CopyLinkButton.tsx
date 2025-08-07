"use client"

import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface CopyLinkButtonProps {
  url: string
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    toast.success('Link kopyalandı!')
  }

  return (
    <Button onClick={handleCopy}>
      Kopyala
    </Button>
  )
}