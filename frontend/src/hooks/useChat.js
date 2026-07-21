import { useState, useCallback } from 'react'
import { getMockCopilotResponse } from '../lib/mockResponses'

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
    const userMsg = {
      id:      `user-${Date.now()}`,
      role:    'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      // TODO Phase 9: replace getMockCopilotResponse with real API call:
      // const res = await fetch('/api/copilot/query', { method: 'POST', body: JSON.stringify({ question: text }), headers: { 'Content-Type': 'application/json' } })
      // const data = await res.json()
      const data = await getMockCopilotResponse(text)

      const aiMsg = {
        id:               `ai-${Date.now()}`,
        role:             'assistant',
        content:          data.answer,
        confidence:       data.confidence,
        confidence_score: data.confidence_score,
        citations:        data.citations ?? [],
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const errMsg = {
        id:         `err-${Date.now()}`,
        role:       'assistant',
        content:    'Sorry, I encountered an error. Please try again.',
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
