<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1OFT-4pC4_cQn2P3EDQZj2E0JXO80b_AY

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Setup for `next-app`

If you're working inside `next-app` and encountered `next: not found` or `ERESOLVE unable to resolve dependency tree`, do the following from the repo root or from the `next-app` folder:

```bash
# from repo root
cd next-app
chmod +x bootstrap.sh
./bootstrap.sh

# then start dev server
npm run dev
```

If you prefer `nvm`, install Node >=18 with `nvm install 20`, then run `npm install` and `npm run dev`.
