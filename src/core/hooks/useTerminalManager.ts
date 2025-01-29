import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import {
  IConnection,
  IMessage,
  ITerminalInstance,
} from '../interfaces/components'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { sendResizeMessage } from '../utils/websocket'

const useTerminalManager = () => {
  const terminalIdCounter = useRef(0)
  const [maxZIndex, setMaxZIndex] = useState(50)
  const [showModal, setShowModal] = useState(false)
  const [connections, setConnections] = useState<IConnection[]>([])
  const [terminals, setTerminals] = useState<ITerminalInstance[]>([])
  const [message, setMessage] = useState<IMessage | undefined>()
  const activeTerminalId = useRef<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  const generateUniqueId = () => {
    terminalIdCounter.current += 1
    return `terminal-${terminalIdCounter.current}`
  }

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

  return {
    message,
    activeTerminalId,
    showScrollButtons,
    connections,
    showModal,
    terminals,
    maxZIndex,
    setMaxZIndex,
    setTerminals,
    setShowModal,
    handleCloseTerminal,
    onSubmitConnection,
    handleFileToText,
    toggleMinimizeConnection,
    sendResizeMessage,
    handleResizeWindow,
  }
}

export { useTerminalManager }
