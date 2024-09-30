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
      defaultAccesses: []
    })

    revalidatePath('/')
    return parseStringify(room)

  } catch (err) {
    console.log("Error happend when creating room ", err)
  }
}