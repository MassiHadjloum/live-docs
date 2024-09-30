'use client'
import Loader from "@/components/Loader"
import { getClerkUsers } from "@/lib/actions/user.action"
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense"

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LiveblocksProvider authEndpoint={'/api/liveblocks-auth'}
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers(userIds)
        console.log("--- ", users)
        return users;
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
