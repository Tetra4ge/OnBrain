import { useState, useCallback } from 'react'
import { streamCopilotResponse } from '../lib/api'

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm the OnBrain Copilot — your AI-powered industrial knowledge assistant. I can answer questions about your equipment, surface compliance gaps, and help you understand incidents using your uploaded documents.\n\nTry asking: \"What compliance gaps exist in my documents?\" or \"When was the last inspection on our compressor?\"",
  confidence: 'high',
  confidence_score: 1.0,
  citations: [],
}

export function useChat() {
  const [messages,  setMessages]  = useState([WELCOME_MESSAGE])
  const [loading,   setLoading]   = useState(false)

  const sendMessage = useCallback(async (text) => {
    const sessionId = localStorage.getItem('onbrain_chat_session') || crypto.randomUUID()
    localStorage.setItem('onbrain_chat_session', sessionId)
    const userMsg = {
      id:      `user-${Date.now()}`,
      role:    'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const aiId = `ai-${Date.now()}`
      const aiMsg = {
        id:               aiId,
        role:             'assistant',
        content:          '',
        confidence:       'medium',
        confidence_score: 0,
        citations:        [],
      }
      setMessages((prev) => [...prev, aiMsg])
      await streamCopilotResponse({
        query: text,
        sessionId,
        onEvent: (event) => setMessages(prev => prev.map(message => {
          if (message.id !== aiId) return message
          if (event.type === 'token') return { ...message, content: message.content + event.text }
          if (event.type === 'meta') {
            const score = event.confidence ?? 0
            return { ...message, confidence: score >= 0.75 ? 'high' : score >= 0.45 ? 'medium' : 'low', confidence_score: score, citations: event.citations ?? [] }
          }
          return message
        })),
      })
    } catch (err) {
      const errMsg = {
        id:         `err-${Date.now()}`,
        role:       'assistant',
        content:    `Sorry, I couldn’t complete that request: ${err.message}`,
        confidence: 'low',
        confidence_score: 0,
        citations:  [],
      }
      setMessages((prev) => [...prev, errMsg])
      console.error('[useChat] error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearChat = useCallback(() => setMessages([WELCOME_MESSAGE]), [])

  return { messages, loading, sendMessage, clearChat }
}
