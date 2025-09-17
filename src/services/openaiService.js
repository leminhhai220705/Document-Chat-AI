import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.client = null;
    this.apiKey = null;
  }

  // Initialize with API key
  initialize(apiKey) {
    this.apiKey = apiKey;
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Allow running in browser
    });
  }

  // Check if initialized
  isInitialized() {
    return this.client !== null;
  }

  // Chat with document context
  async chatWithDocument(message, documentContent, chatHistory = []) {
    if (!this.isInitialized()) {
      throw new Error('OpenAI service not initialized. Please provide API key.');
    }

    try {
      // Create system prompt for document chat
      const systemPrompt = `You are an AI assistant specialized in document reading and comprehension.

The user has uploaded a document with the following content:
"""
${documentContent}
"""

Response rules:
1. Only use content from the above document to answer
2. If possible, specify the location in the document (page number, paragraph, section...)
3. If the information is not in the document, respond "This information is not available in the document."
4. Answer concisely, accurately, and clearly
5. Always quote relevant text passages from the document`;

      // Create messages array
      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.3, // Low creativity to ensure accurate answers
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check again.');
      } else if (error.status === 429) {
        throw new Error('API limit exceeded. Please try again later.');
      } else {
        throw new Error('Error occurred when calling OpenAI API: ' + error.message);
      }
    }
  }

  // Simple chat (without document)
  async simpleChat(message, chatHistory = []) {
    if (!this.isInitialized()) {
      throw new Error('OpenAI service not initialized. Please provide API key.');
    }

    try {
      const messages = [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        ...chatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Error occurred when calling OpenAI API: ' + error.message);
    }
  }
}

// Singleton instance
const openAIService = new OpenAIService();
export default openAIService;