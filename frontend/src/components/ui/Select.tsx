'use client'

type Option = { value: string; label: string }
type Props = {
  label: string
  options: Option[]
  required?: boolean
  [key: string]: any
}

export default function Select({ label, options, ...props }: Props) {
  return (
    <label className="block mb-2">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <select className="border rounded px-3 py-2 w-full" {...props}>
        <option value="">Selecione...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  )
}
