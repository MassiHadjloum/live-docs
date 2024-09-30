'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import { Editor } from "./editor/Editor"
import Header from "./Header"
import ActiveCollaborators from "./ActiveCollaborators"
import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import Image from "next/image"
import { updatDocument } from "@/lib/actions/room.actoin"
import Loader from "./Loader"

const CollaborativeRoom = ({ roomId, roomMetadata, currentUserType, users }: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)

  const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setLoading(true);
      try {
        if(documentTitle !== roomMetadata.title) {
          const updatedDocument = await updatDocument(roomId, documentTitle);
          if(updatedDocument){
            setLoading(false)
          }
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false)
        updatDocument(roomId, documentTitle)
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [roomId, documentTitle])

  useEffect(() => {
    if(editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing])

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div ref={containerRef} className="flex items-center justify-center gap-2 w-fit">
              {editing && !loading ? (
                <Input type="text" value={documentTitle} ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle} </p>
                </>
              )}
              {currentUserType === 'editor' && !editing && (
                <Image src="/assets/icons/edit.svg" alt="edit"
                  width={24} height={24} onClick={() => setEditing(true)}
                  className="cursor-pointer" />
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom
