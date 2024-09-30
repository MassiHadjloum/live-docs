import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actoin"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


const Document = async ({ params: { id } }: SearchParamProps) => {
  const clercUser = await currentUser()
  if (!clercUser) redirect("/sign-in")

  const room = await getDocument(id, clercUser.emailAddresses[0].emailAddress)
  if (!room) redirect('/')
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom roomId={id} roomMetadata={room.metadata} users={[]} currentUserType={"creator"} />
    </main>
  )
}

export default Document
