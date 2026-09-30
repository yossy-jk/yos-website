interface SectionLabelProps {
  children: React.ReactNode
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-teal font-bold text-[13px] tracking-[0.12em] uppercase mb-5">
      {children}
    </p>
  )
}
