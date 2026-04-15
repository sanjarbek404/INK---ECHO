# Ink & Echo | AI Storyteller

Ink & Echo is a sophisticated creative writing interface that transforms visual inspiration into literary sparks. By combining advanced image analysis with creative ghostwriting and expressive narration, it serves as a powerful muse for writers and storytellers.

## 🌟 Key Features

- **Visual Inspiration**: Upload or drag-and-drop any image to set the scene.
- **AI Ghostwriting**: Powered by **Gemini 3.1 Pro**, the app analyzes the mood, scene, and hidden details of your image to craft a compelling opening paragraph.
- **Expressive Narration**: Listen to your story brought to life with an atmospheric AI voice using **Gemini 2.5 Flash TTS**.
- **Sleek Interface**: A professional, high-fidelity design featuring a split-pane layout, glass-morphism, and elegant typography.
- **Instant Regeneration**: Not quite the right vibe? Regenerate the story instantly from the same visual spark.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.
- **Animations**: Motion (Framer Motion).
- **AI Models**:
  - `gemini-3.1-pro-preview`: Image analysis and creative writing.
  - `gemini-2.5-flash-preview-tts`: Text-to-speech narration.
- **Icons**: Lucide React.

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- A **Gemini API Key** (configured in your environment).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Upload**: Drop an image into the "Visual Pane" on the left.
2. **Analyze**: Wait a moment as Gemini analyzes the scene and mood.
3. **Read**: The generated story opening will appear in the "Story Pane" on the right.
4. **Listen**: Click the "Read Aloud" button to hear the story narrated.
5. **Iterate**: Use the "Regenerate" button to explore different narrative directions for the same image.

---

*Crafted with Sanjarbek Otabekov .*
