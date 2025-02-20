import { Terminal } from '@xterm/xterm'
import React from 'react'
import {
  ConnectionBar,
  HelpShortcutModal,
  OpenConnectionModal,
  TerminalWindow,
} from '../../organisms'
import {
  IConnection,
  IMessage,
  ITerminalInstance,
} from '../../../interfaces/components'

interface TerminalTemplateProps {
  terminals: ITerminalInstance[]
  connections: IConnection[]
  maxZIndex: number
  showModal: boolean
  message?: IMessage
  showScrollButtons: boolean
  showFirstAccessModal: boolean
  handleTerminalClick: (id: string) => void
  handleMouseDownDrag: (e: React.MouseEvent, id: string) => void
  handleDoubleClickTitleBar: (id: string) => void
  handleResizeWindow: (id: string) => void
  toggleMinimizeConnection: (id: string) => void
  handleCloseTerminal: (id: string) => void
  handleMouseDownResize: (e: React.MouseEvent, id: string) => void
  handleMouseDownResizeX: (e: React.MouseEvent, id: string) => void
  handleMouseDownResizeY: (e: React.MouseEvent, id: string) => void
  sendResizeMessage: (terminal: Terminal, socket: WebSocket) => void
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onSubmitConnection: (e: React.FormEvent<HTMLFormElement>) => void
  handleFileToText: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFirstAccessModal: () => void
}

function TerminalTemplate({
  terminals,
  connections,
  maxZIndex,
  showModal,
  message,
  showScrollButtons,
  showFirstAccessModal,
  handleTerminalClick,
  handleMouseDownDrag,
  handleDoubleClickTitleBar,
  handleResizeWindow,
  toggleMinimizeConnection,
  handleCloseTerminal,
  handleMouseDownResize,
  handleMouseDownResizeX,
  handleMouseDownResizeY,
  sendResizeMessage,
  setShowModal,
  onSubmitConnection,
  handleFileToText,
  handleFirstAccessModal,
}: Readonly<TerminalTemplateProps>) {
  return (
    <>
      {terminals.map(
        ({ id, terminal, fitAddon, socket, dimensions, position, zIndex }) => {
          const connection = connections.find((conn) => conn.id === id)
          const isMinimized = connection?.isMinimized || false
          const user = connection?.user ?? ''
          const host = connection?.host ?? ''
          const port = connection?.port ?? 22

          return (
            <TerminalWindow
              key={id}
              id={id}
              terminal={terminal}
              fitAddon={fitAddon}
              socket={socket}
              dimensions={dimensions}
              position={position}
              zIndex={zIndex}
              isMinimized={isMinimized}
              user={user}
              host={host}
              port={port}
              onMouseDownDrag={handleMouseDownDrag}
              onDoubleClickTitleBar={handleDoubleClickTitleBar}
              onMinimize={toggleMinimizeConnection}
              onMaximize={handleResizeWindow}
              onClose={handleCloseTerminal}
              handleMouseDownResize={handleMouseDownResize}
              handleMouseDownResizeX={handleMouseDownResizeX}
              handleMouseDownResizeY={handleMouseDownResizeY}
              onClickWindow={handleTerminalClick}
              sendResizeMessage={sendResizeMessage}
            />
          )
        }
      )}

      <ConnectionBar
        connections={connections}
        showScrollButtons={showScrollButtons}
        maxZIndex={maxZIndex}
        onToggleMinimize={toggleMinimizeConnection}
        onOpenConnectionModal={() => setShowModal((prev) => !prev)}
      />

      <OpenConnectionModal
        showModal={showModal}
        maxZIndex={maxZIndex}
        message={message}
        onSubmitConnection={onSubmitConnection}
        onCancel={() => {
          setShowModal(false)
        }}
        handleFileToText={handleFileToText}
      />

      <HelpShortcutModal
        showFirstAccessModal={showFirstAccessModal}
        maxZIndex={maxZIndex}
        handleFirstAccessModal={handleFirstAccessModal}
      />
    </>
  )
}

export { TerminalTemplate }
