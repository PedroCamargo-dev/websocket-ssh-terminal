import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { IDimensions } from './IDimensions'
import { IPositions } from './IPositions'

export interface ITerminalInstance {
  id: string
  terminal: Terminal
  fitAddon: FitAddon
  socket: WebSocket
  dimensions: IDimensions
  previousDimensions?: IDimensions
  position: IPositions
  previousPosition?: IPositions
  zIndex: number
}
