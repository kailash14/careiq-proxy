const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/v1/messages', async (req, res) => {
  const messages = [];
  
  // Convert Anthropic system field to OpenAI system message
  if (req.body.system) {
    messages.push({ role: 'system', content: req.body.system });
  }
  
  // Add the rest of the messages
  messages.push(...req.body.messages);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: req.body.max_tokens,
      messages: messages
    })
  });

  const data = await response.json();
  res.json({
    content: [{ text: data.choices?.[0]?.message?.content || '' }]
  });
});

app.listen(3001);
