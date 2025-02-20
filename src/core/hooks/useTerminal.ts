import { useCallback, useEffect, useState } from 'react'
import { useDragAndResize } from './useDragAndResize'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'
import { useTerminalManager } from './useTerminalManager'

const useTerminal = () => {
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(true)

  const handleFirstAccessModal = useCallback(() => {
    setShowFirstAccessModal((prev) => !prev)
  }, [])

  const {
    message,
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
  } = useTerminalManager()

  const handleTerminalClick = (id: string) => {
    setMaxZIndex((prev) => prev + 1)
    setTerminals((prev) =>
      prev.map((terminal) =>
        terminal.id === id ? { ...terminal, zIndex: maxZIndex + 1 } : terminal
      )
    )
  }

  const {
    handleMouseDownResize,
    handleMouseDownResizeX,
    handleMouseDownResizeY,
    handleMouseDownDrag,
  } = useDragAndResize({
    terminals,
    setTerminals,
    handleTerminalClick,
  })

  useKeyboardShortcuts({
    'Ctrl+Shift+O': (event) => {
      event.preventDefault()
      setShowModal((prev: boolean) => !prev)
    },
  })

  useEffect(() => {
    if (showModal) {
      setShowFirstAccessModal(false)
    }
  }, [showModal])

  return {
    message,
    showScrollButtons,
    connections,
    showModal,
    terminals,
    maxZIndex,
    showFirstAccessModal,
    setShowModal,
    handleCloseTerminal,
    onSubmitConnection,
    handleFileToText,
    toggleMinimizeConnection,
    sendResizeMessage,
    handleTerminalClick,
    handleMouseDownResize,
    handleMouseDownResizeX,
    handleMouseDownResizeY,
    handleMouseDownDrag,
    handleResizeWindow,
    handleFirstAccessModal,
  }
}

export { useTerminal }
