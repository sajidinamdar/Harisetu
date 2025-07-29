# Gemini API Adapter for OpenAI Interface

This adapter allows you to use Google's Gemini API with code that was originally designed for OpenAI's API. It provides a compatible interface so you can easily switch between the two services with minimal code changes.

## Installation

1. Install the required dependencies:

```bash
npm install @google/generative-ai
```

2. Copy the `geminiAdapterExample.js` file to your project and rename it to `geminiAdapter.js`.

## Usage

### Basic Example

```javascript
import GeminiAdapter from './geminiAdapter.js';

// Initialize with your Gemini API key
const gemini = new GeminiAdapter('YOUR_GEMINI_API_KEY');

// Text completion (same interface as OpenAI)
const completion = await gemini.createCompletion({
  prompt: "What are the best practices for growing tomatoes in India?",
  max_tokens: 500,
  temperature: 0.7
});
console.log(completion.choices[0].text);

// Chat completion (same interface as OpenAI)
const chatCompletion = await gemini.createChatCompletion({
  messages: [
    { role: "system", content: "You are an agricultural expert specializing in Indian farming." },
    { role: "user", content: "What crops are best suited for Maharashtra's climate?" }
  ],
  max_tokens: 500,
  temperature: 0.7
});
console.log(chatCompletion.choices[0].message.content);
```

### Replacing OpenAI in Existing Code

Original OpenAI code:

```javascript
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Text completion
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Hello, I am a language model",
  max_tokens: 100
});
console.log(completion.data.choices[0].text);

// Chat completion
const chatCompletion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, who are you?" }
  ],
});
console.log(chatCompletion.data.choices[0].message.content);
```

Modified code using GeminiAdapter:

```javascript
import GeminiAdapter from './geminiAdapter.js';

const gemini = new GeminiAdapter(process.env.GEMINI_API_KEY);

// Text completion (same interface as OpenAI)
const completion = await gemini.createCompletion({
  prompt: "Hello, I am a language model",
  max_tokens: 100
});
console.log(completion.choices[0].text);  // Note: no .data prefix

// Chat completion (same interface as OpenAI)
const chatCompletion = await gemini.createChatCompletion({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, who are you?" }
  ],
});
console.log(chatCompletion.choices[0].message.content);  // Note: no .data prefix
```

## Key Differences from OpenAI

1. The response structure is slightly different:
   - OpenAI: `response.data.choices[0].text`
   - Gemini Adapter: `response.choices[0].text`

2. No model selection is needed in the request (it's set in the adapter constructor)

3. Token usage is approximated rather than exact

4. Some advanced OpenAI features may not be available

## Adapter Limitations

1. This adapter provides a basic compatibility layer and doesn't support all OpenAI features
2. Token counting is approximated
3. Some advanced parameters like `presence_penalty` are not supported
4. Error handling may differ from OpenAI

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an account if you don't have one
3. Generate an API key
4. Use this key when initializing the GeminiAdapter