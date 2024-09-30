/* eslint-disable @typescript-eslint/no-unused-vars */
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export async function POST(request: Request) {
  /**
   * Implement your own security here.
   *
   * It's your responsibility to ensure that the caller of this endpoint
   * is a valid user by validating the cookies or authentication headers
   * and that it has access to the requested room.
   */

  // Get the current user from your database
  const clerkUser = await currentUser()
  if(!clerkUser) redirect('/sign-in')
  const {id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
  const user = {
    id: clerkUser.id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id), 
    }
  }

  // Start an auth session inside your endpoint
  // const session = liveblocks.prepareSession(
  //   user.info.email,
  //   { userInfo: user.info } // Optional
  // );

  // // Implement your own security, and give the user access to the room
  // const { room } = await request.json();
  // if (room && __shouldUserHaveAccess__(user, room)) {
  //   session.allow(room, session.FULL_ACCESS);
  // }

  // // Retrieve a token from the Liveblocks servers and pass it to the
  // // requesting client
  // const { body, status } = await session.authorize();
  // return new Response(body, { status });

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}