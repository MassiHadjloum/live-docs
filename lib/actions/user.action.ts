'use server'

import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils"
import { liveblocks } from "../liveblocks"

export const getClerkUsers = async(userIds: string[]) => {
  try {
    const {data} = await clerkClient.users.getUserList({
      emailAddress: userIds
    })
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }))

    const sortedUsers = userIds.map((email) => users.find((user) => user.email === email))
    return parseStringify(sortedUsers)
  } catch (err) {
    console.log("Error fetching users: ", err)
  } 
} 

export const getDocumentUsers = async (roomId: string, currentUser:string, text:string) => {
  try {
    const room = await liveblocks.getRoom(roomId)
    const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser)
    if(text.length) {
      const lower = text.toLowerCase()
      const filtredUsers = users.filter((email: string) => email.toLowerCase().includes(lower))

      return parseStringify(filtredUsers)
    }
    return parseStringify(users)
  } catch (err) { 
    console.log("Error fetching document users: ", err)
  }
}