import { Terminal } from '@xterm/xterm'

const sendResizeMessage = (terminal: Terminal, socket: WebSocket) => {
  const rows = terminal.rows
  const cols = terminal.cols

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'resize', rows, cols }))
  }
}

export { sendResizeMessage }
