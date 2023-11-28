import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { buttonVariants } from '@/app/ui/button'
import { cn } from '@/app/lib/utils'

import ThemeToggler from './ThemeToggler'
import UserMenu from './UserMenu'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95
      backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div
        className="container flex h-14 items-center justify-between px-4
        sm:px-8"
      >
        <div />

        <div className="flex items-center">
          <ThemeToggler />
          <a
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'mr-4 !h-9 px-2.5'
            )}
            href={process.env.NEXTGITHUB_REPO_URL}
            target="_blank"
          >
            <GitHubLogoIcon height={16} width={16} />
          </a>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
