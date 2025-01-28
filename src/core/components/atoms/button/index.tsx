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
    primary: 'bg-blue-700 bg-opacity-10 p-2 text-white hover:bg-opacity-20',
    secondary: 'bg-white p-2 text-blue-700 hover:bg-gray-100',
    danger: 'bg-red-500 bg-opacity-10 p-2 text-white hover:bg-opacity-20',
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={`w-full rounded-xl border-none outline-none transition-all duration-200 ${buttonVariantClassName[variant]} ${className}`}
      {...props}
    >
      {props.children}
    </button>
  )
}

export { Button }
