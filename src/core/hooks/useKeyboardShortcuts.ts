import { useEffect } from 'react'

interface ShortcutMap {
  [keyCombo: string]: (event: KeyboardEvent) => void
}

const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyCombo = [
        event.ctrlKey ? 'Ctrl' : '',
        event.metaKey ? 'Meta' : '',
        event.altKey ? 'Alt' : '',
        event.shiftKey ? 'Shift' : '',
        event.key.toUpperCase(),
      ]
        .filter(Boolean)
        .join('+')

      if (shortcuts[keyCombo]) {
        event.preventDefault()
        shortcuts[keyCombo](event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export { useKeyboardShortcuts }
