interface SectionLabelProps {
  children: React.ReactNode
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-5">
      {children}
    </p>
  )
}
