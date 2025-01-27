import {
  ChangeEvent,
  FC,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Connection {
  id: string
  host: string
  port: number
  user: string
  isMinimized?: boolean
}

interface TerminalInstance {
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

const ResizableTerminalSSH: FC = () => {
  const terminalIdCounter = useRef(0)
  const [maxZIndex, setMaxZIndex] = useState(50)
  const [showModal, setShowModal] = useState(false)
  const [authMethod, setAuthMethod] = useState('password')
  const [host, setHost] = useState('')
  const [port, setPort] = useState(0)
  const [isResizing, setIsResizing] = useState(false)
  const [isResizingX, setIsResizingX] = useState(false)
  const [isResizingY, setIsResizingY] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])
  const [terminals, setTerminals] = useState<TerminalInstance[]>([])
  const dragOffset = useRef({ x: 0, y: 0 })
  const activeTerminalId = useRef<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault()
        setShowModal((prev: boolean) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const generateUniqueId = () => {
    terminalIdCounter.current += 1
    return `terminal-${terminalIdCounter.current}`
  }

  const bringToFront = (id: string) => {
    setMaxZIndex((prev) => prev + 1)
    setTerminals((prev) =>
      prev.map((terminal) =>
        terminal.id === id ? { ...terminal, zIndex: maxZIndex + 1 } : terminal
      )
    )
  }

  const handleTerminalClick = (id: string) => {
    bringToFront(id)
  }

  const sendResizeMessage = (terminal: Terminal, socket: WebSocket) => {
    const rows = terminal.rows
    const cols = terminal.cols

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'resize', rows, cols }))
    }
  }

  const handleMouseDownResize = (e: MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizing(true)
    activeTerminalId.current = id
    bringToFront(id)
  }

  const handleMouseDownResizeX = (e: MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizingX(true)
    activeTerminalId.current = id
    bringToFront(id)
  }

  const handleMouseDownResizeY = (e: MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizingY(true)
    activeTerminalId.current = id
    bringToFront(id)
  }

  const handleMouseDownDrag = (e: MouseEvent, id: string) => {
    e.preventDefault()
    const terminal = terminals.find((t) => t.id === id)
    if (terminal) {
      dragOffset.current = {
        x: e.clientX - terminal.position.x,
        y: e.clientY - terminal.position.y,
      }
      setIsDragging(true)
      activeTerminalId.current = id
      bringToFront(id)
    }
  }

  const handleMouseMove = (e: WindowEventMap['mousemove']) => {
    const activeTerminal = terminals.find(
      (t) => t.id === activeTerminalId.current
    )
    if (!activeTerminal) return

    let newWidth = activeTerminal.dimensions.width
    let newHeight = activeTerminal.dimensions.height
    let newX = activeTerminal.position.x
    let newY = activeTerminal.position.y

    const maxWidth = window.innerWidth - activeTerminal.position.x
    const maxHeight = window.innerHeight - activeTerminal.position.y
    const maxX = window.innerWidth - activeTerminal.dimensions.width
    const maxY = window.innerHeight - activeTerminal.dimensions.height

    if (isResizing) {
      newWidth = Math.min(
        Math.max(200, e.clientX - activeTerminal.position.x),
        maxWidth
      )
      newHeight = Math.min(
        Math.max(150, e.clientY - activeTerminal.position.y),
        maxHeight
      )
    }

    if (isResizingX) {
      newWidth = Math.min(
        Math.max(200, e.clientX - activeTerminal.position.x),
        maxWidth
      )
    }

    if (isResizingY) {
      newHeight = Math.min(
        Math.max(150, e.clientY - activeTerminal.position.y),
        maxHeight
      )
    }

    if (isDragging) {
      newX = Math.min(Math.max(0, e.clientX - dragOffset.current.x), maxX)
      newY = Math.min(Math.max(0, e.clientY - dragOffset.current.y), maxY)
    }

    setTerminals((prev) =>
      prev.map((t) =>
        t.id === activeTerminalId.current
          ? {
              ...t,
              dimensions: {
                width: newWidth,
                height: newHeight,
              },
              position: {
                x: newX,
                y: newY,
              },
            }
          : t
      )
    )

    activeTerminal.fitAddon.fit()
    sendResizeMessage(activeTerminal.terminal, activeTerminal.socket)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    setIsResizingX(false)
    setIsResizingY(false)
    setIsDragging(false)
    activeTerminalId.current = null
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, isResizingX, isResizingY, isDragging])

  const handleCloseTerminal = (id: string) => {
    const terminalInstance = terminals.find((t) => t.id === id)

    if (terminalInstance) {
      terminalInstance.socket.close()
      setTerminals((prev) => {
        return prev.filter((t) => t.id !== id)
      })
      setConnections((prev) => {
        return prev.filter((conn) => conn.id !== id)
      })
    }
  }

  const handleResizeWindow = (id: string) => {
    const terminal = terminals.find((t) => t.id === id)
    if (!terminal) return

    const isFullScreen =
      window.innerWidth === terminal.dimensions.width &&
      window.innerHeight === terminal.dimensions.height

    setTerminals((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              dimensions: isFullScreen
                ? terminal.previousDimensions || { width: 800, height: 500 }
                : { width: window.innerWidth, height: window.innerHeight },
              position: isFullScreen
                ? terminal.previousPosition || { x: 100, y: 100 }
                : { x: 0, y: 0 },
              previousDimensions: isFullScreen
                ? undefined
                : {
                    width: terminal.dimensions.width,
                    height: terminal.dimensions.height,
                  },
              previousPosition: isFullScreen
                ? undefined
                : { x: terminal.position.x, y: terminal.position.y },
            }
          : t
      )
    )
  }

  const handleSocketClose = (terminalId: string) => {
    setTerminals((prev) => prev.filter((t) => t.id !== terminalId))
    setConnections((prev) => prev.filter((conn) => conn.id !== terminalId))
  }

  const openNewConnection = (
    newHost: string,
    newPort: number,
    newUser: string,
    newPassword?: string,
    newPrivateKey?: string
  ) => {
    const terminalId = generateUniqueId()
    const newConnection = {
      id: terminalId,
      host: newHost,
      port: newPort,
      user: newUser,
      password: newPassword,
      privateKey: newPrivateKey,
    }

    const newSocket = new WebSocket('ws://localhost:8080/ws')
    const newTerminal = new Terminal()
    const newFitAddon = new FitAddon()

    newSocket.onopen = () => {
      newSocket.send(
        JSON.stringify({
          type: 'config',
          content: JSON.stringify(newConnection),
        })
      )
      setConnections((prev) => [
        ...prev,
        { id: terminalId, host: newHost, port: newPort, user: newUser },
      ])
    }

    newSocket.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data)
      if (message.type === 'output') {
        newTerminal.write(message.content)
      }
    }

    newSocket.onclose = () => {
      handleSocketClose(terminalId)
    }

    newTerminal.onData((data) => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.send(JSON.stringify({ type: 'input', content: data }))
      }
    })

    setMaxZIndex((prev) => prev + 1)

    setTerminals((prev) => [
      ...prev,
      {
        id: terminalId,
        terminal: newTerminal,
        fitAddon: newFitAddon,
        socket: newSocket,
        dimensions: { width: 800, height: 500 },
        position: { x: 100, y: 100 },
        zIndex: maxZIndex + 1,
      },
    ])
  }

  const onSubmitConnection = (e: FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const host = formData.get('host') as string
      const port = parseInt(formData.get('port') as string, 10)
      const user = formData.get('user') as string
      const password = formData.get('password') as string
      const privateKey = formData.get('privateKey') as string

      if (!host || !port || !user) {
        return
      }

      setHost(host)
      setPort(port)

      if (privateKey) {
        openNewConnection(host, port, user, password, privateKey)
      } else {
        openNewConnection(host, port, user, password)
      }

      setShowModal(false)
    } catch (error) {
      console.error('Failed to submit connection:', error)
    } finally {
      const form = e.target as HTMLFormElement
      form.reset()
    }
  }

  const handleFileToText = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const textarea = document.querySelector(
          'textarea[name="privateKey"]'
        ) as HTMLTextAreaElement
        textarea.value = text
      }
      reader.readAsText(file)
    }
  }

  const checkScrollVisibility = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerWidth = container.clientWidth
    const totalContentWidth = container.scrollWidth

    setShowScrollButtons(totalContentWidth > containerWidth)
  }

  const scrollContainer = (distance: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: distance,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    checkScrollVisibility()

    const handleResize = () => checkScrollVisibility()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [connections])

  const toggleMinimizeConnection = (id: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isMinimized: !c.isMinimized } : c))
    )
  }

  return (
    <>
      {terminals.map(
        ({ id, terminal, fitAddon, socket, dimensions, position, zIndex }) => {
          const connection = connections.find((conn) => conn.id === id)
          const isMinimized = connection?.isMinimized

          return (
            <div
              key={id}
              onClick={() => handleTerminalClick(id)}
              style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: 'black',
                border: '1px solid #555',
                borderRadius:
                  window.innerWidth === dimensions.width ? 0 : '0.75rem',
                transform: isMinimized
                  ? 'translateY(100vh) scale(0.5)'
                  : 'translateY(0) scale(1)',
                transition: 'transform 0.3s ease',
                zIndex: zIndex,
              }}
              aria-hidden="true"
            >
              <div
                className={`flex h-8 cursor-move items-center justify-between ${window.innerWidth === dimensions.width ? 'rounded-none' : 'rounded-tl-xl rounded-tr-xl'} bg-[#333] px-2.5 text-white`}
                onMouseDown={(e) => handleMouseDownDrag(e, id)}
                onDoubleClick={() => handleResizeWindow(id)}
              >
                <span>
                  {connection
                    ? `${connection.user}@${connection.host}:${connection.port}`
                    : 'Terminal'}
                </span>
                <div>
                  <button
                    className="mr-2 border-none bg-transparent text-white"
                    onClick={() =>
                      toggleMinimizeConnection(
                        connections.map((c) => c.id).includes(id) ? id : ''
                      )
                    }
                  >
                    &#x1F5D5;
                  </button>
                  <button
                    className="mr-2 border-none bg-transparent text-white"
                    onClick={() => handleResizeWindow(id)}
                  >
                    &#x1F5D6;
                  </button>
                  <button
                    className="border-none bg-transparent text-white"
                    onClick={() => handleCloseTerminal(id)}
                  >
                    &#x2715;
                  </button>
                </div>
              </div>
              <div
                ref={(ref) => {
                  if (ref && !terminal.element) {
                    terminal.loadAddon(fitAddon)
                    terminal.open(ref)
                    fitAddon.fit()
                    sendResizeMessage(terminal, socket)
                    terminal.write(`Connecting to ${host}:${port}...\r\n`)
                  }
                }}
                style={{
                  flex: 1,
                  height: 'calc(100% - 44px)',
                  overflow: 'hidden',
                  display: isMinimized ? 'none' : 'block',
                }}
              ></div>
              <div
                className="absolute bottom-0 right-0 z-10 h-2.5 w-2.5 cursor-se-resize bg-transparent"
                onMouseDown={(e) => handleMouseDownResize(e, id)}
              ></div>
              <div
                className="absolute right-0 top-0 h-full w-2.5 cursor-e-resize bg-transparent"
                onMouseDown={(e) => handleMouseDownResizeX(e, id)}
              ></div>
              <div
                className="absolute bottom-0 left-0 h-2.5 w-full cursor-s-resize bg-transparent"
                onMouseDown={(e) => handleMouseDownResizeY(e, id)}
              ></div>
            </div>
          )
        }
      )}
      <div
        className="absolute bottom-0 right-0 flex min-h-12 w-full items-center overflow-x-hidden bg-white bg-opacity-10 bg-clip-padding p-2 text-white backdrop-blur backdrop-filter"
        style={{
          zIndex: maxZIndex + 3,
        }}
      >
        <div className="flex w-full items-center gap-2 px-4">
          <button
            className="min-w-52 rounded-md border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
            onClick={() => setShowModal((prev: boolean) => !prev)}
          >
            Open Connection SSH
          </button>
          {showScrollButtons && (
            <button
              className="rounded-md border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
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
            {connections.map((conn: any) => (
              <div
                key={conn.id}
                className={`flex items-center rounded-md px-3.5 py-2 transition-all duration-200 hover:cursor-pointer ${
                  conn.isMinimized
                    ? 'bg-white bg-opacity-10 hover:bg-opacity-30'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-10'
                }`}
                onClick={() => toggleMinimizeConnection(conn.id)}
                aria-hidden="true"
              >
                <span>
                  {conn.user}@{conn.host}:{conn.port}
                </span>
              </div>
            ))}
          </div>
          {showScrollButtons && (
            <button
              className="rounded-md border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
              onClick={() => scrollContainer(400)}
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
      <div
        className={`fixed inset-0 flex transform items-center justify-center p-28 transition-transform duration-300 ease-out ${
          showModal ? 'translate-x-0' : '-translate-x-[99rem]'
        }`}
        style={{
          zIndex: maxZIndex + 2,
        }}
      >
        <div className="flex max-h-full w-full max-w-md flex-col gap-4 rounded-xl bg-white bg-opacity-10 bg-clip-padding p-8 text-white backdrop-blur-xl backdrop-filter">
          <h1 className="text-center text-2xl font-bold">Open Connection</h1>
          <form
            className="flex h-full flex-col gap-2 overflow-y-auto px-2 py-2"
            onSubmit={onSubmitConnection}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="host" className="font-medium">
                Host
              </label>
              <input
                id="host"
                type="text"
                name="host"
                className="rounded-xl border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 focus:bg-opacity-20"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="port" className="font-medium">
                Port
              </label>
              <input
                id="port"
                type="number"
                name="port"
                defaultValue={22}
                className="rounded-xl border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 focus:bg-opacity-20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="user" className="font-medium">
                User
              </label>
              <input
                id="user"
                type="text"
                name="user"
                className="rounded-xl border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 focus:bg-opacity-20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="authMethod" className="font-medium">
                Authentication Method
              </label>
              <select
                id="authMethod"
                name="authMethod"
                className="rounded-xl border-none bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 focus:bg-opacity-20"
                onChange={(e) => {
                  const authMethod = e.target.value
                  setAuthMethod(authMethod)
                }}
              >
                <option value="password" className="text-black">
                  Password
                </option>
                <option value="privateKey" className="text-black">
                  Private Key
                </option>
              </select>
            </div>
            {authMethod === 'password' ? (
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="rounded-xl border-none bg-transparent bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
                />
              </div>
            ) : (
              <div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="privateKey" className="font-medium">
                    Private Key
                  </label>
                  <textarea
                    id="privateKey"
                    name="privateKey"
                    className="rounded-xl border-none bg-transparent bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="privateKeyFile" className="font-medium">
                    Private Key File
                  </label>
                  <input
                    id="privateKeyFile"
                    type="file"
                    name="privateKeyFile"
                    className="rounded-xl border-none bg-transparent bg-white bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
                    onChange={handleFileToText}
                  />
                </div>
              </div>
            )}
            <div className="mt-2 flex w-full justify-between gap-2">
              <button
                type="submit"
                className="w-full rounded-xl border-none bg-blue-700 bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
              >
                Connect
              </button>
              <button
                type="button"
                className="w-full rounded-xl border-none bg-red-500 bg-opacity-10 p-2 text-white outline-none transition-all duration-200 hover:bg-opacity-20"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export { ResizableTerminalSSH }
