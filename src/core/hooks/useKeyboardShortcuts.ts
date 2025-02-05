import { useEffect, useRef } from 'react'

export type ShortcutHandler = (event: KeyboardEvent) => void

export interface ShortcutMap {
  [shortcut: string]: ShortcutHandler
}

const normalizeKeyCombo = (event: KeyboardEvent): string => {
  const keys: string[] = []

  if (event.ctrlKey) keys.push('Ctrl')
  if (event.altKey) keys.push('Alt')
  if (event.shiftKey) keys.push('Shift')
  if (event.metaKey) keys.push('Meta')

  let key = event.key
  if (key.length === 1) {
    key = key.toUpperCase()
  } else {
    key = key.charAt(0).toUpperCase() + key.slice(1)
  }
  keys.push(key)

  return keys.join('+')
}

const useKeyboardShortcuts = (
  shortcuts: ShortcutMap,
  target: HTMLElement | Window = window
) => {
  const shortcutsRef = useRef<ShortcutMap>(shortcuts)

  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    const handleKeyDown: EventListener = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent
      const keyCombo = normalizeKeyCombo(keyboardEvent)
      const handler = shortcutsRef.current[keyCombo]
      if (handler) {
        keyboardEvent.preventDefault()
        handler(keyboardEvent)
      }
    }

    target.addEventListener('keydown', handleKeyDown)
    return () => {
      target.removeEventListener('keydown', handleKeyDown)
    }
  }, [target])
}

export { useKeyboardShortcuts }
