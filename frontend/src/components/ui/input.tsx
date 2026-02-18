'use client'

type Props = {
  label: string
  type?: string
  required?: boolean
  minLength?: number
  [key: string]: any
}

export default function Input({ label, type = 'text', ...props }: Props) {
  return (
    <label className="block mb-2">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <input type={type} className="border rounded px-3 py-2 w-full" {...props} />
    </label>
  )
}
