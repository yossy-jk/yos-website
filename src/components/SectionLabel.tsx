interface SectionLabelProps {
  children: React.ReactNode
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">
      {children}
    </p>
  )
}
