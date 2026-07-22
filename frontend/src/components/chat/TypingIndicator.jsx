/**
 * Typing indicator — three pulsing dots shown while AI is generating
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      {/* AI avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center flex-shrink-0 mr-3 shadow-[0_0_10px_rgba(247,147,26,0.3)]">
        <span className="font-mono text-white text-xs font-bold">AI</span>
      </div>

      <div className="bg-[#242423] border border-white/8 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#F7931A] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
    </div>
  )
}
