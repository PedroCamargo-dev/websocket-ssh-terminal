import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  className?: string
}

function Button({
  variant = 'default',
  className,
  ...props
}: Readonly<ButtonProps>) {
  const buttonVariantClassName = {
    default: '',
    primary: 'bg-blue-700/10 p-2 text-white hover:bg-blue-700/20',
    secondary: 'bg-slate-500/10 text-white hover:bg-slate-500/20',
    danger: 'bg-red-500/10 p-2 text-white hover:bg-red-500/20',
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={`w-full rounded-xl border-none outline-hidden transition-all duration-200 ${buttonVariantClassName[variant]} ${className}`}
      {...props}
    >
      {props.children}
    </button>
  )
}

export { Button }
