// Mock AI service for demonstration purposes
export const aiService = {
  createChatSession: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { sessionId: `session-${Date.now()}` }
  },

  sendMessage: async (sessionId: string, message: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock response
    return {
      id: `resp-${Date.now()}`,
      choices: [
        {
          message: {
            content:
              "This is a mock response from the AI service. In a real implementation, this would be connected to an actual AI model.",
          },
        },
      ],
    }
  },
}
