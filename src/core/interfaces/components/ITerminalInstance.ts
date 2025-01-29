import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'

export interface ITerminalInstance {
  id: string
  terminal: Terminal
  fitAddon: FitAddon
  socket: WebSocket
  dimensions: { width: number; height: number }
  previousDimensions?: { width: number; height: number }
  position: { x: number; y: number }
  previousPosition?: { x: number; y: number }
  zIndex: number
}
