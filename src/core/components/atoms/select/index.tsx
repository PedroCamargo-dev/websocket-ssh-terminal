import { CSSProperties, SelectHTMLAttributes } from 'react'
import { Variants } from '../../../types/components'

type Option = {
  value: string | number | readonly string[] | undefined
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
  text?: string
  className?: string
  variant?: Variants
  styleOptions?: CSSProperties
}

function Select({
  options,
  text,
  className,
  variant = 'default',
  styleOptions,
  ...props
}: Readonly<SelectProps>) {
  const selectVariantClassName = {
    default: '',
    translucent:
      'border-none bg-white bg-opacity-10 text-white focus:bg-opacity-20',
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.id} className="font-medium">
        {text}
      </label>
      <select
        id={props.id}
        name={props.name}
        className={`${selectVariantClassName[variant]} ${className} rounded-xl p-2 outline-none transition-all duration-200`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value} style={styleOptions}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export { Select }
