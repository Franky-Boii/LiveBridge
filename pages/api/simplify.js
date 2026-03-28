export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a communication bridge. Simplify the user's spoken input into one short, easy-to-read sentence for a deaf user. Keep it natural." },
          { role: "user", content: req.body.text }
        ]
      })
    });
    const data = await response.json();
    res.status(200).json({ simplified: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Simplification failed" });
  }
}