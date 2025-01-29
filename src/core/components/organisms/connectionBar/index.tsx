import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ConnectionCard } from '../../molecules'
import { useRef } from 'react'
import { IConnection } from '../../../interfaces/components'

interface ConnectionBarProps {
  connections: IConnection[]
  showScrollButtons: boolean
  maxZIndex: number
  onToggleMinimize: (id: string) => void
  onOpenConnectionModal: () => void
}

export function ConnectionBar({
  connections,
  showScrollButtons,
  maxZIndex,
  onToggleMinimize,
  onOpenConnectionModal,
}: Readonly<ConnectionBarProps>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollContainer = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset
    }
  }

  return (
    <div
      className="absolute right-0 bottom-0 flex min-h-12 w-full items-center overflow-x-hidden bg-white/10 bg-clip-padding p-2 text-white backdrop-blur backdrop-filter"
      style={{
        zIndex: maxZIndex + 3,
      }}
    >
      <div className="flex w-full items-center gap-2 px-4">
        <button
          className="min-w-52 rounded-md border-none bg-white/10 p-2 text-white outline-hidden transition-all duration-200 hover:bg-white/20"
          onClick={onOpenConnectionModal}
        >
          Open Connection SSH
        </button>

        {showScrollButtons && (
          <button
            className="rounded-md border-none bg-white/10 p-2 text-white outline-hidden transition-all duration-200 hover:bg-white/20"
            onClick={() => scrollContainer(-400)}
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            width: '100%',
            gap: '0.5rem',
            overflowX: showScrollButtons ? 'scroll' : 'hidden',
          }}
        >
          {connections.map((conn) => (
            <ConnectionCard
              key={conn.id}
              user={conn.user}
              host={conn.host}
              port={conn.port}
              isMinimized={conn.isMinimized}
              onClick={() => onToggleMinimize(conn.id)}
            />
          ))}
        </div>

        {showScrollButtons && (
          <button
            className="rounded-md border-none bg-white/10 p-2 text-white outline-hidden transition-all duration-200 hover:bg-white/20"
            onClick={() => scrollContainer(400)}
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  )
}
