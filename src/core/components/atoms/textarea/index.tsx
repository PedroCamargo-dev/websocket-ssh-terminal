import { TextareaHTMLAttributes } from 'react'
import { Variants } from '../../../types/components'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text?: string
  className?: string
  variant?: Variants
}

function Textarea({
  text,
  className,
  variant = 'default',
  ...props
}: Readonly<TextareaProps>) {
  const textareaVariantClassName = {
    default: '',
    translucent: 'border-none bg-white/10 text-white focus:bg-white/20',
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.id} className="font-medium">
        Private Key
      </label>
      <textarea
        id={props.id}
        name={props.name}
        className={`${textareaVariantClassName[variant]} ${className} rounded-xl p-2 outline-hidden transition-all duration-200`}
        {...props}
      ></textarea>
    </div>
  )
}

export { Textarea }
