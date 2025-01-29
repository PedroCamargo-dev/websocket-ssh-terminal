import React from 'react'
import { Terminal } from '@xterm/xterm'
import { TerminalControls } from '../../molecules'
import { IConnection, ITerminalInstance } from '../../../interfaces/components'
import '@xterm/xterm/css/xterm.css'
import { useTerminalWindow } from '../../../hooks'

interface TerminalWindowProps extends ITerminalInstance, IConnection {
  onMouseDownDrag: (e: React.MouseEvent, id: string) => void
  onDoubleClickTitleBar: (id: string) => void
  onMinimize: (id: string) => void
  onMaximize: (id: string) => void
  onClose: (id: string) => void
  handleMouseDownResize: (e: React.MouseEvent, id: string) => void
  handleMouseDownResizeX: (e: React.MouseEvent, id: string) => void
  handleMouseDownResizeY: (e: React.MouseEvent, id: string) => void
  onClickWindow: (id: string) => void
  sendResizeMessage: (terminal: Terminal, socket: WebSocket) => void
}

function TerminalWindow({
  id,
  terminal,
  fitAddon,
  socket,
  dimensions,
  position,
  zIndex,
  isMinimized,
  user,
  host,
  port,
  onMouseDownDrag,
  onDoubleClickTitleBar,
  onMinimize,
  onMaximize,
  onClose,
  handleMouseDownResize,
  handleMouseDownResizeX,
  handleMouseDownResizeY,
  onClickWindow,
  sendResizeMessage,
}: Readonly<TerminalWindowProps>) {
  const { terminalRef, isFullWidth } = useTerminalWindow({
    terminal,
    fitAddon,
    socket,
    dimensions,
    host,
    port,
    sendResizeMessage,
  })

  return (
    <div
      key={id}
      onClick={() => onClickWindow(id)}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: 'black',
        border: '1px solid #555',
        borderRadius: window.innerWidth === dimensions.width ? 0 : '0.75rem',
        transform: isMinimized
          ? 'translateY(100vh) scale(0.5)'
          : 'translateY(0) scale(1)',
        transition: 'transform 0.3s ease',
        zIndex: zIndex,
      }}
      aria-hidden="true"
    >
      <TerminalControls
        title={`${user}@${host}:${port}`}
        onMinimize={() => onMinimize(id)}
        onMaximize={() => onMaximize(id)}
        onClose={() => onClose(id)}
        onMouseDownDrag={(e) => onMouseDownDrag(e, id)}
        onDoubleClickTitleBar={() => onDoubleClickTitleBar(id)}
        isFullWidth={isFullWidth}
      />

      <div
        ref={terminalRef}
        style={{
          flex: 1,
          height: 'calc(100% - 44px)',
          overflow: 'hidden',
          display: isMinimized ? 'none' : 'block',
        }}
      />
      <div
        className="absolute right-0 bottom-0 z-10 h-2.5 w-2.5 cursor-se-resize bg-transparent"
        onMouseDown={(e) => handleMouseDownResize(e, id)}
      ></div>
      <div
        className="absolute top-0 right-0 h-full w-2.5 cursor-e-resize bg-transparent"
        onMouseDown={(e) => handleMouseDownResizeX(e, id)}
      ></div>
      <div
        className="absolute top-0 left-0 h-full w-2.5 cursor-e-resize bg-transparent"
        onMouseDown={(e) => handleMouseDownResizeX(e, id)}
      ></div>
      <div
        className="absolute bottom-0 left-0 h-2.5 w-full cursor-s-resize bg-transparent"
        onMouseDown={(e) => handleMouseDownResizeY(e, id)}
      ></div>
      <div
        className="absolute top-0 right-0 h-2.5 w-full cursor-s-resize bg-transparent"
        onMouseDown={(e) => handleMouseDownResizeY(e, id)}
      ></div>
    </div>
  )
}

export { TerminalWindow }
