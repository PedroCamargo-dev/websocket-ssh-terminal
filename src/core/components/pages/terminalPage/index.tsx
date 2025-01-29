import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TerminalTemplate } from '../../templates'
import {
  IConnection,
  IMessage,
  ITerminalInstance,
} from '../../../interfaces/components'
import { useKeyboardShortcuts } from '../../../hooks'

function TerminalPage() {
  const terminalIdCounter = useRef(0)
  const [maxZIndex, setMaxZIndex] = useState(50)
  const [showModal, setShowModal] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isResizingX, setIsResizingX] = useState(false)
  const [isResizingY, setIsResizingY] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [connections, setConnections] = useState<IConnection[]>([])
  const [terminals, setTerminals] = useState<ITerminalInstance[]>([])
  const [message, setMessage] = useState<IMessage | undefined>()
  const dragOffset = useRef({ x: 0, y: 0 })
  const activeTerminalId = useRef<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  useKeyboardShortcuts({
    'Ctrl+Tab': () => {
      const activeTerminal = terminals.find(
        (t) => t.id === activeTerminalId.current
      )
      if (!activeTerminal) return

      const currentIndex = terminals.findIndex(
        (t) => t.id === activeTerminal.id
      )
      const nextIndex =
        currentIndex === terminals.length - 1 ? 0 : currentIndex + 1
      const nextTerminal = terminals[nextIndex]

      bringToFront(nextTerminal.id)
    },
    'Ctrl+Shift+Tab': () => {
      const activeTerminal = terminals.find(
        (t) => t.id === activeTerminalId.current
      )
      if (!activeTerminal) return

      const currentIndex = terminals.findIndex(
        (t) => t.id === activeTerminal.id
      )
      const nextIndex =
        currentIndex === 0 ? terminals.length - 1 : currentIndex - 1
      const nextTerminal = terminals[nextIndex]

      bringToFront(nextTerminal.id)
    },
    'Ctrl+Shift+M': () => {
      const activeConnection = connections.find(
        (c) => c.id === activeTerminalId.current
      )
      if (!activeConnection) return

      toggleMinimizeConnection(activeConnection.id)
    },
    'Ctrl+Shift+Q': () => {
      const activeTerminal = terminals.find(
        (t) => t.id === activeTerminalId.current
      )
      if (!activeTerminal) return

      handleCloseTerminal(activeTerminal.id)
    },
    'Ctrl+Shift+O': () => {
      setShowModal((prev: boolean) => !prev)
    },
  })

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

  const handleMouseDownResize = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizing(true)
    activeTerminalId.current = id
    bringToFront(id)
  }

  const handleMouseDownResizeX = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizingX(true)
    activeTerminalId.current = id
    bringToFront(id)
  }

  const handleMouseDownResizeY = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizingY(true)
    activeTerminalId.current = id
    bringToFront(id)
  }

  const handleMouseDownDrag = (e: React.MouseEvent, id: string) => {
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
      if (
        e.clientX <
        activeTerminal.position.x + activeTerminal.dimensions.width / 2
      ) {
        newX = Math.min(Math.max(0, e.clientX), maxX)
        newWidth =
          activeTerminal.position.x +
          activeTerminal.dimensions.width -
          e.clientX
      }
    }

    if (isResizingY) {
      newHeight = Math.min(
        Math.max(150, e.clientY - activeTerminal.position.y),
        maxHeight
      )
      if (
        e.clientY <
        activeTerminal.position.y + activeTerminal.dimensions.height / 2
      ) {
        newY = Math.min(Math.max(0, e.clientY), maxY)
        newHeight =
          activeTerminal.position.y +
          activeTerminal.dimensions.height -
          e.clientY
      }
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
      setShowModal(false)
      newTerminal.write(`Connecting to ${newHost}:${newPort}\r\n`)
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

      if (message.type === 'error') {
        setShowModal(true)
        setMessage({ type: 'error', content: message.content })
      }

      if (message.type === 'output') {
        message && setMessage(undefined)
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
        if (!host || !user || !port) {
          setMessage({
            type: 'error',
            content: 'Host, port, and user are required fields.',
          })
          return
        }
        return
      }

      if (privateKey) {
        openNewConnection(host, port, user, password, privateKey)
      } else {
        openNewConnection(host, port, user, password)
      }
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
    <TerminalTemplate
      terminals={terminals}
      connections={connections}
      maxZIndex={maxZIndex}
      showModal={showModal}
      message={message}
      showScrollButtons={showScrollButtons}
      handleTerminalClick={handleTerminalClick}
      handleMouseDownDrag={handleMouseDownDrag}
      handleDoubleClickTitleBar={handleResizeWindow}
      handleResizeWindow={handleResizeWindow}
      toggleMinimizeConnection={toggleMinimizeConnection}
      handleCloseTerminal={handleCloseTerminal}
      handleMouseDownResize={handleMouseDownResize}
      handleMouseDownResizeX={handleMouseDownResizeX}
      handleMouseDownResizeY={handleMouseDownResizeY}
      sendResizeMessage={sendResizeMessage}
      setShowModal={setShowModal}
      onSubmitConnection={onSubmitConnection}
      handleFileToText={handleFileToText}
    />
  )
}

export { TerminalPage }
