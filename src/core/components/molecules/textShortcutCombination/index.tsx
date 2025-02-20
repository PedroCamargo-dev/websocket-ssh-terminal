import React from 'react'

interface TextShortcutCombinationProps {
  icon: React.ReactNode[]
  text: string
}

function TextShortcutCombination({
  icon,
  text,
}: Readonly<TextShortcutCombinationProps>) {
  return (
    <div className="itens-center flex min-w-64 justify-between gap-6 rounded-xl bg-white/10 px-4 py-2.5">
      <div className="flex items-center gap-2">
        {icon.map((iconElement, index) => (
          <React.Fragment key={index}>{iconElement}</React.Fragment>
        ))}
      </div>
      <span className="ml-2">{text}</span>
    </div>
  )
}

export { TextShortcutCombination }
