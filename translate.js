// Netlify Function: translate new planner text with Google Cloud Translation.
// Only leaders listed in ⚙️ Settings (Firestore swordland_admins, keyed by email) can call it.
// Environment variables (Netlify → Site configuration → Environment variables):
//   GOOGLE_TRANSLATE_KEY   API key with the Cloud Translation API enabled
//   FIREBASE_API_KEY       same apiKey as firebase-config.js
//   FIREBASE_PROJECT_ID    same projectId as firebase-config.js

const ALLOWED = ['es','fr','de','pt','ru','ar','tr','it','nl','no','pl','uk','id','vi','zh-CN','ja','ko','hi','th','he','sv','el'];
const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST' });
  const { GOOGLE_TRANSLATE_KEY, FIREBASE_API_KEY, FIREBASE_PROJECT_ID } = process.env;
  if (!GOOGLE_TRANSLATE_KEY || !FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) return json(500, { error: 'Translation is not configured on Netlify yet' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Bad request' }); }
  const { idToken, target, texts } = body;
  if (!idToken || !ALLOWED.includes(target) || !Array.isArray(texts)) return json(400, { error: 'Missing token, language or texts' });
  if (texts.length > 1500 || texts.some((t) => typeof t !== 'string' || t.length > 4000)) return json(400, { error: 'Too much text in one request' });

  // 1. Who is calling? Verify the Firebase login token.
  const look = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }),
  });
  const lj = await look.json();
  const email = lj.users && lj.users[0] && lj.users[0].email;
  if (!email) return json(401, { error: 'Sign-in expired. Sign in again.' });

  // 2. Are they an admin? Read their own swordland_admins entry with their token (security rules apply).
  const adm = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/swordland_admins/${encodeURIComponent(email.toLowerCase())}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (adm.status !== 200) return json(403, { error: 'Only admins can translate' });

  // 3. Translate in chunks of 100 lines.
  const out = [];
  for (let i = 0; i < texts.length; i += 100) {
    const chunk = texts.slice(i, i + 100);
    const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: chunk, source: 'en', target, format: 'html' }),
    });
    const d = await r.json();
    if (!r.ok) return json(502, { error: (d.error && d.error.message) || 'Google Translate error' });
    d.data.translations.forEach((t) => out.push(t.translatedText));
  }
  return json(200, { translations: out });
};
