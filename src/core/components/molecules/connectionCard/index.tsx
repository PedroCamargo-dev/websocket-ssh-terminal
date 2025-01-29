import { IConnection } from '../../../interfaces/components'

interface ConnectionCardProps extends Omit<IConnection, 'id'> {
  onClick: () => void
}

function ConnectionCard({
  user,
  host,
  port,
  isMinimized,
  onClick,
}: Readonly<ConnectionCardProps>) {
  return (
    <div
      className={`flex items-center rounded-md px-3.5 py-2 transition-all duration-200 hover:cursor-pointer ${
        isMinimized
          ? 'bg-white/10 hover:bg-white/30'
          : 'bg-white/20 hover:bg-white/10'
      }`}
      onClick={onClick}
      aria-hidden="true"
    >
      <span>
        {user}@{host}:{port}
      </span>
    </div>
  )
}

export { ConnectionCard }
