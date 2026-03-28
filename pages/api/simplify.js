export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');
  
  // We now expect 'mode' in the request body (e.g., 'standard' or 'interview')
  const { text, language, mode } = req.body; 

  // Define dynamic instructions based on Maliviwe's feedback
  const systemInstruction = mode === 'interview' 
    ? `You are a professional Interview Assistant for a Deaf job seeker. 
       Distill the speech into clear, professional bullet points in ${language}. 
       If a question is asked, prefix it with "❓ QUESTION:". 
       Remove all verbal fillers and focus on the employer's core intent and action items.`
    : `You are a communication bridge. Simplify the user's spoken input into one short, 
       easy-to-read sentence in the ${language} language. Keep it natural and accessible for a deaf user.`;

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
          { role: "system", content: systemInstruction },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
       console.error("OpenAI Error:", data.error);
       return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ simplified: data.choices[0].message.content });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Simplification failed" });
  }
}