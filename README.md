<img width="1440" height="813" alt="Screenshot 2026-03-28 at 10 58 25" src="https://github.com/user-attachments/assets/bb37cec3-a7b5-4c87-992f-325a8099d2d4" />
<img width="1440" height="813" alt="Screenshot 2026-03-28 at 11 00 02" src="https://github.com/user-attachments/assets/e582d7b8-72fc-4e77-b9ef-da8d08c18b1e" />
🌉 LiveBridge: The Real-Time Accessibility Hub
🎯 The Mission
LiveBridge was built to dismantle the "double barrier" of communication. While many tools provide simple transcription, they often fail in high-speed, real-world interactions where background noise, rambling speech, and language differences make traditional STT (Speech-to-Text) overwhelming for deaf users.

Our aim is to provide Dignity through Clarity—giving deaf individuals a tool that doesn't just "listen," but understands and simplifies.

🧠 The Core Concepts
AI-Driven Simplification: We use LLMs to strip away verbal "filler" (uhs, ums, tangents) to present the deaf user with the core intent of a sentence.

Identity-First Speech: By providing a variety of regional voices, users can choose a "voice" that matches their identity, making the outgoing speech feel like them, not a machine.

Global Inclusivity: Integrated multilingual support allows for cross-cultural communication, serving as both an accessibility bridge and a real-time translator.

⚙️ Technical Architecture
LiveBridge is a Serverless Progressive Web App (PWA) designed for zero-latency communication.

The Ears (STT): Utilizes the Web Speech API for instant, on-device audio processing, ensuring the UI remains responsive without waiting for heavy audio uploads.

The Brain (AI): A Next.js API Layer proxies requests to OpenAI’s GPT-4o-mini. It processes raw transcripts and "distills" them into simplified, accessible sentences based on the selected global language.

The Voice (TTS): Leverages SpeechSynthesis to provide natural-sounding responses, mapped to the user's regional settings and personal voice preference.

The Paper Trail: A centralized state management system records every "bridge" crossed, providing a persistent Session Transcript for later reference.

🌍 Impact & Future Vision
LiveBridge is designed for:

Emergency Services: Fast, clear communication between first responders and deaf individuals.

Daily Commerce: Enabling seamless interactions at coffee shops, banks, and grocery stores.

Travel: Breaking down both the hearing and language barrier for international travelers.

Future Roadmap:

Integrating MediaPipe for basic sign-language gesture recognition.

Implementing WebSockets for multi-device "Shared Room" conversations.

Offline AI processing for use in remote areas.

🚀 Setup & Installation
Clone the repo.

Run npm install.

Create a .env.local with your OPENAI_API_KEY.

Run npm run dev.
