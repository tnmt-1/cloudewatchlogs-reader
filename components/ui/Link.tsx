'use client'
import { LinkProps, default as NextLink } from 'next/link'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  href: string
}

export default function Link(props: Props) {
  const { children, href, ...otherProps } = props
  return (
    <NextLink className="text-blue-600" href={href} {...otherProps}>
      {children}
    </NextLink>
  )
}
