'use client'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  [key: string]: any
}

export default function Button({ children, href, variant = 'primary', size = 'md', ...props }: Props) {
  const base = 'rounded-xl font-semibold focus:outline-none transition-all duration-200 shadow-md'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-300',
    secondary: 'bg-gray-100 text-indigo-700 hover:bg-gray-200 border border-gray-300 focus:ring-2 focus:ring-indigo-200',
    outline: 'border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-300',
  }
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  }
  const className = `${base} ${variants[variant]} ${sizes[size]} ${props.className || ''}`

  if (href) {
    return <Link href={href} className={className}>{children}</Link>
  }
  return <button className={className} {...props}>{children}</button>
}
