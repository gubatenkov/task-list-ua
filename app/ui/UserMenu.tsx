'use client'

import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from '@/app/ui/dropdown-menu'
import { AvatarFallback, AvatarImage, Avatar } from '@/app/ui/avatar'
import { signOutUser } from '@/app/lib/actions'
import { useToast } from '@/app/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/ui/button'

export default function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogOut = async () => {
    const response = await signOutUser()
    if (response.success) {
      toast({
        description: response.message,
        title: 'Success!',
      })
      router.push('/login')
    } else if (response.error) {
      console.log(response.error.data)
      toast({
        description: response.error.message,
        title: 'Error!',
      })
    } else {
      toast({
        description: 'Unexpected operation result.',
        title: 'Oops!',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image || '/avatar.png'} alt="" />
            <AvatarFallback>EM</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name ?? 'Elon Musk'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email ?? 'elon.musk@spacex.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              toast({
                description:
                  'Twitter team has been successfully fired. Bye-bye losers 👋',
                title: 'Success!',
              })
            }
          >
            Fire all team
            <DropdownMenuShortcut>⌘Del</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              toast({
                description: 'Falcon 9 has been successfully launched 🚀',
                title: 'Success!',
              })
            }
          >
            Launch a rocket
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              toast({
                description: 'You received 1000 Doge on your wallet 💸',
                title: 'Success!',
              })
            }
          >
            Buy Dogecoin
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={handleLogOut}>
          <DropdownMenuItem>
            <button
              className="flex w-full items-center justify-between"
              type="submit"
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
