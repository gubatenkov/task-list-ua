import Link from 'next/link'
import { clsx } from 'clsx'

interface Breadcrumb {
  active?: boolean
  label: string
  href: string
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="block">
      <ol
        className={clsx('font-inter flex text-base font-normal xs:text-base')}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            className={'text-muted-foreground'}
            aria-current={breadcrumb.active}
            key={breadcrumb.href}
          >
            {breadcrumb.active ? (
              <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
