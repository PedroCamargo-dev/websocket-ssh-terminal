import { Terminal } from '@xterm/xterm'
import { useRef, useEffect } from 'react'
import { IDimensions } from '../interfaces/components'
import { FitAddon } from '@xterm/addon-fit'

interface TerminalWindow {
  terminal: Terminal
  fitAddon: FitAddon
  socket: WebSocket
  dimensions: IDimensions
  host: string
  port: number
  sendResizeMessage: (terminal: Terminal, socket: WebSocket) => void
}

const useTerminalWindow = ({
  terminal,
  fitAddon,
  socket,
  dimensions,
  host,
  port,
  sendResizeMessage,
}: TerminalWindow) => {
  const terminalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (terminalRef.current && !terminal.element) {
      terminal.loadAddon(fitAddon)
      terminal.open(terminalRef.current)
      fitAddon.fit()
      sendResizeMessage(terminal, socket)
    }
  }, [terminalRef, terminal, fitAddon, socket, host, port, sendResizeMessage])

  const isFullWidth = window.innerWidth === dimensions.width

  return {
    terminalRef,
    isFullWidth,
  }
}

export { useTerminalWindow }
