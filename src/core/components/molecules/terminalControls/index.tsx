import React from 'react'
import { Button } from '../../atoms'
import { Maximize, Minimize, Minus, X } from 'lucide-react'

interface TerminalControlsProps {
  title: string
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
  onMouseDownDrag: (event: React.MouseEvent) => void
  onDoubleClickTitleBar: () => void
  isFullWidth: boolean
}

function TerminalControls({
  title,
  onMinimize,
  onMaximize,
  onClose,
  onMouseDownDrag,
  onDoubleClickTitleBar,
  isFullWidth,
}: Readonly<TerminalControlsProps>) {
  return (
    <div
      className={`flex min-h-8 cursor-move items-center justify-between ${
        isFullWidth ? 'rounded-none' : 'rounded-tl-xl rounded-tr-xl'
      } bg-[#333] px-3 py-1 text-white`}
      onMouseDown={onMouseDownDrag}
      onDoubleClick={onDoubleClickTitleBar}
    >
      <span>{title}</span>
      <div className="mt-0.5 flex w-24 items-center justify-between">
        <Button
          type="button"
          className="flex w-min items-center justify-center rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
          onClick={onMinimize}
        >
          <Minus size={12} />
        </Button>
        <Button
          type="button"
          className="flex w-min items-center justify-center rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
          onClick={onMaximize}
        >
          {!isFullWidth ? <Maximize size={12} /> : <Minimize size={12} />}
        </Button>
        <Button
          type="button"
          className="flex w-min items-center justify-center rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X size={12} />
        </Button>
      </div>
    </div>
  )
}

export { TerminalControls }
