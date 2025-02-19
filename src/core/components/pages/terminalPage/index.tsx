import { TerminalTemplate } from '../../templates'
import { useKeyboardShortcuts, useTerminal } from '../../../hooks'
import {
  ArrowBigUp,
  ArrowBigUpDash,
  ArrowDown,
  ArrowUp,
  ChevronUp,
  Option,
  Plus,
  X,
} from 'lucide-react'
import { Button } from '../../atoms'

function TerminalPage() {
  const {
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
  } = useTerminal()

  useKeyboardShortcuts({
    'Shift+?': (event) => {
      event.preventDefault()
      handleFirstAccessModal()
    },
  })

  return (
    <>
      {showFirstAccessModal && (
        <div className="flex h-screen items-center justify-center">
          <div className="flex max-h-full w-full max-w-xl flex-col gap-4 rounded-xl bg-white/10 bg-clip-padding p-4 text-white backdrop-blur-xl backdrop-filter">
            <div className="flex max-h-full w-full max-w-xl flex-row gap-4">
              <div className="flex w-[50%] flex-col items-start gap-4">
                <div className="flex rounded-xl bg-white/10 p-2">
                  <ChevronUp />
                  <span className="ml-2">Ctrl</span>
                </div>
                <div className="flex rounded-xl bg-white/10 p-2">
                  <Option /> <span className="ml-2">Alt</span>
                </div>
                <div className="flex rounded-xl bg-white/10 p-2">
                  <ArrowBigUp /> <span className="ml-2">Shift</span>
                </div>
                <div className="flex rounded-xl bg-white/10 p-2">
                  <ArrowUp />
                  <span className="ml-2">Arrow up</span>
                </div>
                <div className="flex rounded-xl bg-white/10 p-2">
                  <ArrowDown />
                  <span className="ml-2">Arrow down</span>
                </div>
              </div>

              <div className="flex w-[50%] flex-col items-end gap-4">
                <div className="itens-center flex min-w-64 justify-between gap-6 rounded-xl bg-white/10 p-2">
                  <div className="flex items-center gap-2">
                    <ChevronUp /> <Plus size={16} /> <Option />{' '}
                    <Plus size={16} /> <ArrowUp />
                  </div>
                  <span>Maximize</span>
                </div>
                <div className="itens-center flex min-w-64 justify-between gap-6 rounded-xl bg-white/10 p-2">
                  <div className="flex items-center gap-2">
                    <ChevronUp /> <Plus size={16} /> <ArrowBigUp />{' '}
                    <Plus size={16} /> <ArrowUp />
                  </div>
                  <span>Minimize</span>
                </div>
                <div className="itens-center flex min-w-64 justify-between gap-6 rounded-xl bg-white/10 p-2">
                  <div className="flex items-center gap-2">
                    <ChevronUp /> <Plus size={16} /> <ArrowBigUp />{' '}
                    <Plus size={16} /> <ArrowDown />
                  </div>
                  <span>Minimize</span>
                </div>
                <div className="itens-center flex min-w-64 justify-between gap-6 rounded-xl bg-white/10 p-2">
                  <div className="flex items-center gap-2">
                    <ChevronUp /> <Plus size={16} /> <ArrowBigUp />{' '}
                    <Plus size={16} /> W
                  </div>
                  <span>Close</span>
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleFirstAccessModal}
              className="text-center"
            >
              Close
            </Button>
          </div>
        </div>
      )}

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
    </>
  )
}

export { TerminalPage }
