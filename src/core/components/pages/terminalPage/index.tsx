import { TerminalTemplate } from '../../templates'
import { useTerminal } from '../../../hooks'

function TerminalPage() {
  const {
    message,
    showScrollButtons,
    connections,
    showModal,
    terminals,
    maxZIndex,
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
  } = useTerminal()

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
