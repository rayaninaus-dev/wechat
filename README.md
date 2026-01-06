<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ey7NsVcA186wv9Ma6YA5kI6F7PCgtnfI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```
2. Create a `.env` file at the project root and set `GEMINI_API_KEY` to your Gemini API key (see `.env.example`). Do not commit `.env` to git.
3. Start the backend proxy server (which holds the Gemini key):
   `npm run server` (from the repository root)
4. Run the app:
   `npm run dev`
