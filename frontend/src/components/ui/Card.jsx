/**
 * Card — Bitcoin DeFi "Block" concept
 * Elevated Carbon Black surface that floats above the void
 */
export default function Card({ children, className = '', hover = true, glass = false, ...props }) {
  const base =
    'rounded-2xl border p-8 ' +
    (glass
      ? 'bg-black/40 backdrop-blur-lg border-white/10 '
      : 'bg-[#242423] border-white/10 ')

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/40 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.25)] cursor-pointer '
    : ''

  return (
    <div className={`${base} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}
