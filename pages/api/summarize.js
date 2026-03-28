export default async function handler(req, res) {
  const { history } = req.body;
  const transcriptString = history.map(h => `${h.sender}: ${h.text}`).join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ 
        role: "system", 
        content: "Summarize this conversation into: 1. Key Decisions, 2. Action Items, and 3. Questions Asked. Format as professional bullet points." 
      },
      { role: "user", content: transcriptString }]
    })
  });
  const data = await response.json();
  res.status(200).json({ summary: data.choices[0].message.content });
}