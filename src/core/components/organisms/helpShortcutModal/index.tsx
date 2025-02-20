import {
  ArrowDown,
  ArrowUp,
  ChevronUp,
  Option,
  ArrowBigUp,
  Plus,
} from 'lucide-react'
import { Button } from '../../atoms'
import { TextShortcut, TextShortcutCombination } from '../../molecules'
import { useKeyboardShortcuts } from '../../../hooks'

interface HelpShortcutModalProps {
  showFirstAccessModal: boolean
  handleFirstAccessModal: () => void
}

function HelpShortcutModal({
  showFirstAccessModal,
  handleFirstAccessModal,
}: Readonly<HelpShortcutModalProps>) {
  useKeyboardShortcuts({
    'Shift+?': (event) => {
      event.preventDefault()
      handleFirstAccessModal()
    },
  })

  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className={`flex max-h-full w-full max-w-xl flex-col gap-4 rounded-xl bg-white/10 bg-clip-padding p-4 text-white backdrop-blur-xl backdrop-filter transition-transform duration-200 ease-in ${
          showFirstAccessModal ? 'translate-y-0' : '-translate-y-[99rem]'
        }`}
      >
        <div className="flex max-h-full w-full max-w-xl flex-row gap-4">
          <div className="flex w-[50%] flex-col items-start gap-4">
            <TextShortcut icon={<ChevronUp />} text="Ctrl" />
            <TextShortcut icon={<Option />} text="Alt" />
            <TextShortcut icon={<ArrowBigUp />} text="Shift" />
            <TextShortcut icon={<ArrowUp />} text="Arrow up" />
            <TextShortcut icon={<ArrowDown />} text="Arrow down" />
          </div>
          <div className="flex w-[50%] flex-col items-end gap-4">
            <TextShortcutCombination
              icon={[
                <ChevronUp key="chevronUp" />,
                <Plus key="plus1" size={16} />,
                <Option key="option" />,
                <Plus key="plus2" size={16} />,
                <ArrowUp key="arrowUp" />,
              ]}
              text="Maximize"
            />
            <TextShortcutCombination
              icon={[
                <ChevronUp key="chevronUp" />,
                <Plus key="plus1" size={16} />,
                <ArrowBigUp key="arrowBigUp" />,
                <Plus key="plus2" size={16} />,
                <ArrowUp key="arrowUp" />,
              ]}
              text="Minimize"
            />
            <TextShortcutCombination
              icon={[
                <ChevronUp key="chevronUp" />,
                <Plus key="plus1" size={16} />,
                <ArrowBigUp key="arrowBigUp" />,
                <Plus key="plus2" size={16} />,
                <ArrowDown key="arrowDown" />,
              ]}
              text="Minimize"
            />
            <TextShortcutCombination
              icon={[
                <ChevronUp key="chevronUp" />,
                <Plus key="plus1" size={16} />,
                <ArrowBigUp key="arrowBigUp" />,
                <Plus key="plus2" size={16} />,
                'W',
              ]}
              text="Close"
            />
            <TextShortcutCombination
              icon={[
                <ArrowBigUp key="arrowBigUp" />,
                <Plus key="plus2" size={16} />,
                '?',
              ]}
              text="Help shortcuts"
            />
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
  )
}

export { HelpShortcutModal }
