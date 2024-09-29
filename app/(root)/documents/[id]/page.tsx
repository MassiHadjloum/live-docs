import { Editor } from "@/components/editor/Editor"
import Header from "@/components/Header"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

const Document = () => {
  return (
    <div>
      <Header>
        <div className="flex items-center justify-center gap-2 w-fit">
          <p className="document-title">This is a fake title</p>
        </div>
        <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
      </Header>
      <Editor />
    </div>
  )
}

export default Document
