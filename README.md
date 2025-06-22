🎥 [Watch the Live Demo on YouTube](https://www.youtube.com/watch?v=0lZ8QidDQrE)

# 🌿 SereneScape — A Personalized Mood Companion

SereneScape is a lightweight, privacy-focused mental wellness web app built during a hackathon. It offers users a calm space to check in on their emotions, log moods over time, and receive AI-powered suggestions — all while respecting their privacy and mental bandwidth.

> 🧠 Not a replacement for therapy — just a gentle companion for your mental health journey.

---

## 🧩 Core Features

### ✅ Mood Check-In
Users are prompted with a simple question like “How are you feeling today?” using emoji or word-based selectors. Their input is then stored and analyzed.

### ✅ Mood Labeling & Tracking
User moods are categorized (happy, anxious, stressed, etc.) and tracked over time. Charts powered by **Chart.js** visualize mood trends across sessions.

### ✅ LLM Mood Reflection Chat
A custom **Gemini AI** agent reflects back what the user writes in a journaling-style interface. It gently challenges negative thought patterns without becoming a “yes man,” using prompt engineering for nuanced responses.

### ✅ AI-Powered Suggestions
Based on mood input, Gemini AI generates affirmations, breathing prompts, or short mindfulness suggestions tailored to the user’s state of mind.

### ✅ Audio & Visual Library
Soothing nature sound files and calming visuals are hosted via **Firebase** and presented to the user as part of a gentle sensory experience.

### ✅ Secure Authentication
Users are authenticated through **Supabase**, which also manages avatar storage and profile data.

---

## 🛠️ Tech Stack

| Tech            | Use Case                                       |
|-----------------|------------------------------------------------|
| **Next.js**     | Frontend framework (React-based)              |
| **Gemini AI**   | LLM for mood reflection and suggestions        |
| **Supabase**    | Auth and avatar data storage                   |
| **Firebase**    | Backend for image/audio asset hosting          |
| **Chart.js**    | Mood tracking visualizations                   |
| **Tailwind CSS**| UI styling and responsive design               |

---

## 💡 Inspiration

Mental wellness apps often feel bloated or clinical. SereneScape was designed to be a **low-pressure**, user-first experience: no over-commitment, no judgment — just a peaceful check-in when you need it.

---

## 🧪 Future Features (Stretch Goals)

- Anger/stress management challenge system  
- Crisis alert trigger for flagged phrases (e.g., detecting mental health red flags)  
- More customizable journaling prompts  
- Expanded LLM personas for different user preferences (gentle, direct, humorous, etc.)

---

## 🚀 Getting Started (Local Dev)

```bash
git clone https://github.com/yourusername/SereneScape.git
cd SereneScape
npm install
npm run dev
Ensure .env.local contains:
```

Ensure .env.local contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
FIREBASE_CONFIG=your_firebase_config
GEMINI_API_KEY=your_gemini_key
```

## 🔑 How to Get Your Environment Variables

### `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
1. Go to [https://app.supabase.com](https://app.supabase.com) and sign in.
2. Create a new project or open an existing one.
3. In your project dashboard:
   - Navigate to **Project Settings → API**.
   - Copy the **URL** → use this as `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy the **anon public key** → use this as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

### `FIREBASE_CONFIG`
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com).
2. Create a new project (or open an existing one).
3. Click the ⚙️ **Settings icon** → go to **Project settings**.
4. Scroll to **Your apps** and register a **Web app** (</> icon).
5. You'll get a config object like:
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-app.firebaseapp.com",
     projectId: "your-app",
     storageBucket: "your-app.appspot.com",
     messagingSenderId: "XXXXXXX",
     appId: "1:XXXXXXX:web:XXXXXXXX"
   };
   ```
6. Format this as a string or JSON object depending on your Firebase setup in the project.
### 'GEMINI_API_KEY (Google Gemini AI)'
Go to https://aistudio.google.com/app/apikey.

Create a new project if needed.

Click Get API Key and copy it.

Add it to your .env.local file as:
```
GEMINI_API_KEY=your_api_key_here
```

## 🙏 Credits
Built by Me(Giovanni), @jtega149, @Lindan Thillanayagam

Thanks to Google Gemini, Supabase, Firebase, and all the incredible open-source libraries that made this possible.

