'use client'
import Loader from "@/components/Loader"
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.action"
import { useUser } from "@clerk/nextjs"
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense"

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser } = useUser()
  return (
    <LiveblocksProvider authEndpoint={'/api/liveblocks-auth'}
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers(userIds)
        console.log("--- ", users)
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers(
          roomId,
          clerkUser?.emailAddresses[0].emailAddress!,
          text
        )
        return roomUsers
      }}
    >
      {/* <RoomProvider id="my-room"> */}
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
      {/* </RoomProvider> */}
    </LiveblocksProvider>
  )
}

export default Provider
