interface SectionLabelProps {
  children: React.ReactNode
  onLight?: boolean
}

export default function SectionLabel({ children, onLight = false }: SectionLabelProps) {
  return (
    <p className={`${onLight ? 'text-action-teal' : 'text-teal'} font-bold text-[13px] tracking-[0.12em] uppercase mb-5`}>
      {children}
    </p>
  )
}
