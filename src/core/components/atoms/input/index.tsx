import { InputHTMLAttributes } from 'react'
import { Variants } from '../../../types/components'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  text?: string
  className?: string
  variant?: Variants
}

function Input({
  text,
  className,
  variant = 'default',
  ...props
}: Readonly<InputProps>) {
  const inputVariantClassName = {
    default: '',
    translucent: 'border-none bg-white/10 text-white focus:bg-white/20',
  }

  return (
    <div className="flex flex-col gap-1">
      {text && (
        <label htmlFor={props.id} className="font-medium">
          {text}
        </label>
      )}
      <input
        id={props.id}
        type={props.type}
        name={props.name}
        className={`${inputVariantClassName[variant]} ${className} rounded-xl p-2 outline-hidden transition-all duration-200`}
        {...props}
      />
    </div>
  )
}

export { Input }
