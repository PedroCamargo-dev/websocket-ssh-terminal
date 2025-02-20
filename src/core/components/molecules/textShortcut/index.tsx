interface TextShortcutProps {
  icon: React.ReactNode
  text: string
}

function TextShortcut({ icon, text }: Readonly<TextShortcutProps>) {
  return (
    <div className="flex rounded-xl bg-white/10 px-4 py-2.5">
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  )
}

export { TextShortcut }
