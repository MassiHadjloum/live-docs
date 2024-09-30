'use client'

import Image from "next/image"
import { Button } from "./ui/button"
import { createDocument } from "@/lib/actions/room.actoin"
import { useRouter } from "next/navigation"

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter()
  const addDocumentHnadler = async () => {
    try {
      const room = await createDocument(userId, email)
      if (room) {
        router.push(`/documents/${room.id}`)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Button className="gradient-blue flex gap-1 shadow-md"
      type="submit" onClick={addDocumentHnadler}>
      <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  )
}

export default AddDocumentBtn
