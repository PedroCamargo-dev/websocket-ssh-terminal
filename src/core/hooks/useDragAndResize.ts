import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { ITerminalInstance } from '../interfaces/components'
import { sendResizeMessage } from '../utils/websocket'

interface DragAndResize {
  terminals: ITerminalInstance[]
  setTerminals: Dispatch<SetStateAction<ITerminalInstance[]>>
  handleTerminalClick: (id: string) => void
}

const useDragAndResize = ({
  terminals,
  setTerminals,
  handleTerminalClick,
}: DragAndResize) => {
  const [isResizing, setIsResizing] = useState(false)
  const [isResizingX, setIsResizingX] = useState(false)
  const [isResizingY, setIsResizingY] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const activeTerminalId = useRef<string | null>(null)

  const handleMouseDownResize = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizing(true)
    activeTerminalId.current = id
    handleTerminalClick(id)
  }

  const handleMouseDownResizeX = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizingX(true)
    activeTerminalId.current = id
    handleTerminalClick(id)
  }

  const handleMouseDownResizeY = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setIsResizingY(true)
    activeTerminalId.current = id
    handleTerminalClick(id)
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
      handleTerminalClick(id)
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
        Math.max(350, e.clientX - activeTerminal.position.x),
        maxWidth
      )
      newHeight = Math.min(
        Math.max(200, e.clientY - activeTerminal.position.y),
        maxHeight
      )
    }

    if (isResizingX) {
      newWidth = Math.min(
        Math.max(350, e.clientX - activeTerminal.position.x),
        maxWidth
      )
    }

    if (isResizingY) {
      newHeight = Math.min(
        Math.max(200, e.clientY - activeTerminal.position.y),
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

  return {
    handleMouseDownResize,
    handleMouseDownResizeX,
    handleMouseDownResizeY,
    handleMouseDownDrag,
  }
}

export { useDragAndResize }
