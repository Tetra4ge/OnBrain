const DEFAULT_RESPONSE = {
  answer: 'I could not find a matching answer in the mock knowledge set yet. Try asking about inspections, compliance, or work orders.',
  confidence: 'low',
  confidence_score: 0.35,
  citations: [],
}

const RESPONSES = [
  {
    match: /(compliance|regulation|standard|gap)/i,
    response: {
      answer: 'Based on current mock data, coverage appears strongest for inspection workflows, with likely gaps around emergency shutdown procedural evidence.',
      confidence: 'medium',
      confidence_score: 0.71,
      citations: [
        { title: 'API 570 Reference Extract', page: 3, snippet: 'Inspection interval definitions and documentation requirements.' },
      ],
    },
  },
  {
    match: /(inspection|last inspection|work order|compressor)/i,
    response: {
      answer: 'Mock records indicate recent maintenance and inspections are available for primary rotating assets, including compressor-related entries.',
      confidence: 'medium',
      confidence_score: 0.68,
      citations: [
        { title: 'WO-88405-valve-actuator-overhaul.json', page: 1, snippet: 'Work-order evidence with timestamped maintenance actions.' },
      ],
    },
  },
]

export async function getMockCopilotResponse(query) {
  await new Promise(resolve => setTimeout(resolve, 250))
  const hit = RESPONSES.find(item => item.match.test(query || ''))
  return hit ? hit.response : DEFAULT_RESPONSE
}
