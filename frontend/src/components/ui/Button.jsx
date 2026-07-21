/**
 * Button — Bitcoin DeFi aesthetic
 * Variants: primary | outline | ghost
 * Sizes: sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-heading font-bold whitespace-nowrap ' +
    'rounded-full transition-all duration-300 cursor-pointer select-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030304] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-5 py-2 text-xs tracking-wide uppercase min-h-[36px]',
    md: 'px-7 py-3 text-sm tracking-wide uppercase min-h-[44px]',
    lg: 'px-9 py-4 text-base tracking-wide uppercase min-h-[52px]',
  }

  const variants = {
    primary:
      'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white ' +
      'shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] ' +
      'hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)] ' +
      'active:scale-95',
    outline:
      'bg-transparent border-2 border-white/20 text-white ' +
      'hover:border-[#F7931A]/70 hover:bg-white/5 hover:text-[#F7931A] ' +
      'active:scale-95',
    ghost:
      'bg-transparent text-white/80 ' +
      'hover:bg-white/8 hover:text-[#F7931A] ' +
      'active:scale-95',
  }

  return (
    <Tag
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
