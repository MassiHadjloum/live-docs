import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actoin"
import { getClerkUsers } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


const Document = async ({ params: { id } }: SearchParamProps) => {
  const clercUser = await currentUser()
  if (!clercUser) redirect("/sign-in")

  const room = await getDocument(id, clercUser.emailAddresses[0].emailAddress)
  if (!room) redirect('/')

  const userIds = Object.keys(room.usersAccesses)
  const users = await getClerkUsers(userIds);
  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write')
      ? "editor" : "viewer"
  }))

  const currentUserType = room.usersAccesses[clercUser.emailAddresses[0].emailAddress]?.includes('room:write')
    ? "editor" : "viewer";
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType} />
    </main>
  )
}

export default Document
