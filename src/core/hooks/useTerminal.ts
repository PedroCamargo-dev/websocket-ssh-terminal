import { useDragAndResize } from './useDragAndResize'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'
import { useTerminalManager } from './useTerminalManager'

const useTerminal = () => {
  const {
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
  } = useTerminalManager()

  const handleTerminalClick = (id: string) => {
    setMaxZIndex((prev) => prev + 1)
    setTerminals((prev) =>
      prev.map((terminal) =>
        terminal.id === id ? { ...terminal, zIndex: maxZIndex + 1 } : terminal
      )
    )
  }

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

      handleTerminalClick(nextTerminal.id)
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

      handleTerminalClick(nextTerminal.id)
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
    handleTerminalClick,
    handleMouseDownResize,
    handleMouseDownResizeX,
    handleMouseDownResizeY,
    handleMouseDownDrag,
    handleResizeWindow,
  }
}

export { useTerminal }
