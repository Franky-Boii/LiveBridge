<img width="450" height="804" alt="Screenshot 2026-03-29 at 12 02 20" src="https://github.com/user-attachments/assets/29b3e1d8-03c9-49c0-be68-e8111735f0f0" />
<img width="450" height="804" alt="Screenshot 2026-03-29 at 12 05 06" src="https://github.com/user-attachments/assets/dd13f5f9-96ec-452d-9fd4-80b7ed488653" />
<img width="450" height="804" alt="Screenshot 2026-03-29 at 12 05 55" src="https://github.com/user-attachments/assets/14e0d259-fd50-4911-9927-d3ba5c4d97ad" />
<img width="450" height="804" alt="Screenshot 2026-03-29 at 12 33 34" src="https://github.com/user-attachments/assets/01d73fd5-1018-448f-945f-8ddd955c648d" />



**🌉 LIVEBRIDGE: The Intelligent Accessibility Engine**

Beyond Transcription: Real-Time AI Contextual Bridging for the Global Workforce.

LiveBridge is a high-performance, cross-platform accessibility suite engineered to dismantle communication barriers for Deaf and Hard-of-Hearing (HoH) professionals.

While traditional Speech-to-Text (STT) tools overwhelm users with raw, jargon-heavy "walls of text," LiveBridge utilizes a GPT-4o-mini Intelligence Layer to simplify linguistic complexity into high-readability insights in real-time. By bridging remote devices via low-latency WebSockets, we provide a frictionless, two-way communication channel designed for high-stakes interviews, corporate boardrooms, and educational lectures.

**✨ Key Features**

⚡ Zero-Friction Onboarding: Instant device bridging via dynamically generated QR codes. No accounts, no downloads—just instant inclusion.

📥 QR Sharing & Portability: Integrated SVG-to-PNG Canvas conversion allowing users to download and share their unique "Bridge" QR code for remote sessions.

🧠 Contextual AI Simplification: Processes dense professional jargon into clear, actionable language using custom-prompted LLM logic.

🌊 Audio Presence (Visual Waveforms): A live CSS animation that gives Deaf users a visual "pulse" of the speaker's voice, providing "presence" before the AI even finishes processing.

🇿🇦 Deep SADC Localization: Native support for South African regional languages including isiZulu, isiXhosa, Sesotho, and Afrikaans.

📳 Haptic Intelligence: Uses mobile vibration APIs to provide a physical "nudge" the exact moment a message is processed and ready to read.

✨ AI Smart Replies: Dynamic, context-aware suggestion chips that allow for rapid, professional responses with a single tap.

🎯 Interview Mode: A specialized UI toggle that highlights questions and adds professional cues to help users navigate high-stakes conversations.

**🚀 Technical Stack**

Frontend: Next.js (React) & Tailwind CSS

Real-time Layer: Supabase Broadcast & PostgreSQL CDC

Intelligence: OpenAI API (Custom Prompt Engineering for Simplification)

Connectivity: QRCode.react with integrated Download logic

Speech Engine: Web Speech API (Chrome Optimized)

Deployment: Netlify / Vercel Edge Runtime

**🛠️ Local Setup Instructions**

To run this project locally, follow these steps:

**Clone the repository:**

Bash

git clone [your-repo-url]

cd livebridge

Install dependencies:

Bash

npm install

Configure Environment Variables:

Create a .env.local file in the root directory and add your keys:

**Code snippet**

OPENAI_API_KEY=your_openai_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Run the development server:

Bash

npm run dev
Open http://localhost:3000 in Google Chrome.

**🎯 The Vision**

LiveBridge was born from the need to dismantle career barriers faced by Deaf professionals in the South African job market. 

Traditional STT often fails due to speed and linguistic complexity. 

LiveBridge doesn't just transcribe; it bridges the gap of understanding to move accessibility from "compliant" to "empowering."

**Built for the 2026 Global Accessibility Hackathon. MIT License © 2026 Frank Mulongoyi**
