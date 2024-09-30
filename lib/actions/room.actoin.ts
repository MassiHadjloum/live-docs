'use server'
import {nanoid} from 'nanoid'
import { liveblocks } from '../liveblocks'
import { revalidatePath } from 'next/cache'
import { parseStringify } from '../utils'

export const createDocument = async (userId: string, email: string) => {
  const roomId = nanoid()
  try {
    const metaData = {
      creatorId: userId,
      email,
      title: 'Untitled'
    }

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write']
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata: metaData,
      usersAccesses,
      defaultAccesses: ['room:write']
    })
    console.log("--- room", room)

    revalidatePath('/')
    return parseStringify(room)

  } catch (err) {
    console.log("Error happend when creating room ", err)
  }
}

export const getDocument = async (roomId: string, userId: string) => {
  try {
    const room = await liveblocks.getRoom(roomId)
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId)
    // if(!hasAccess) {
    //   throw new Error('You do not have access to this document')
    // }
    return parseStringify(room)
  } catch (error) {
    console.log("Error happend while getting a room: ",error)
  }
}