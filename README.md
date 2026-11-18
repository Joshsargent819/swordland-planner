# Swordland Planner

Battle planner for K976 [OPC] Swordlands Summit League matches.
Players open the site, look up their assignment and check in without logging in. Leaders sign in with Google to edit plans and see attendance; the owner manages who has access in ⚙️ Settings.

**Files**

| File | What it is |
|---|---|
| `index.html` | The whole planner (map, plans, roster, attendance). |
| `firebase-config.js` | Your Firebase connection (already filled in). |
| `firestore.rules` | Who can read and write what (setup step 3). |
| `netlify/functions/translate.js` | The server step that sends new text to Google Translate (step 7). |


---

## Setup (one time)

**Firebase** (console.firebase.google.com), project `swordland-planner`:

1. **Build → Firestore Database → Create database** (production mode).
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**, pick a support email → **Save**.
3. **Firestore Database → Rules:** replace everything with `firestore.rules` → **Publish**.

`firebase-config.js` is already filled in for the `swordland-planner` project.

**GitHub + Netlify:**

4. Create a GitHub repo and upload everything in this folder, including the `netlify` folder.
5. **Netlify → Add new site → Import an existing project → GitHub** and pick the repo. Leave the build settings empty and click **Deploy**. Optionally rename the site under **Site configuration → Change site name**.
6. **Firebase → Authentication → Settings → Authorized domains → Add domain:** add your Netlify address (e.g. `opc-swordland.netlify.app`). Google sign-in only works on addresses listed here. This is the one step a website can't do for itself.

**First visit (automatic):**

7. Open the site, tap **🔒 Admin sign-in → Sign in with Google**. Because the planner is brand new, it offers **Claim this planner**. Say yes and you become the **Owner**. Your plans are saved online automatically.

## Giving leaders access

No passwords and no Firebase console needed:

1. Tap **⚙️ Settings** (top right).
2. Type the leader's Google email, pick **Admin** or **Owner**, and tap **Give access**.
3. Send them the site link. They tap **🔒 Admin sign-in → Sign in with Google**, and the edit tools appear.

- **Owners** manage the access list.
- **Admins** edit plans, see attendance and run translations.
- To take access away, tap **Remove**.
- The site won't let the last owner remove themselves.

## Turn on translation (23 languages, optional)

Translation is optional; the site works in English without it. Players pick their language from the 🌐 menu at the top.

1. **Upgrade Firebase to Blaze** (pay as you go): Firebase console → bottom-left **Upgrade**. Google requires this to enable the Translation API.
   - Google Translate's first 500,000 characters each month are free.
   - Translating everything the first time (all three plans plus every on-screen label, into 22 languages) is about 240,000 characters.
   - After that, each week only new wording is sent, usually a few thousand characters.
   - Set a budget alert: Google Cloud console → **Billing → Budgets & alerts → Create budget**, e.g. $1.
2. **Enable the API:** Google Cloud console (console.cloud.google.com), pick the same project → **APIs & Services → Library** → search **Cloud Translation API** → **Enable**.
3. **Create a key:** go to **APIs & Services → Credentials → Create credentials → API key**. Then **Edit API key → API restrictions → Restrict key → Cloud Translation API** → Save, and copy the key.
4. **Netlify → Site configuration → Environment variables → Add variable**. Add three:
   - `GOOGLE_TRANSLATE_KEY` = the key from step 3
   - `FIREBASE_API_KEY` = the `apiKey` from `firebase-config.js`
   - `FIREBASE_PROJECT_ID` = the `projectId` from `firebase-config.js`
5. **Netlify → Deploys → Trigger deploy → Deploy site**, so the function picks up the variables.

The translation key lives only on Netlify, never in the page. Only signed-in leaders on the ⚙️ Settings list can run translation.

## Writing a briefing (admins)

In **Edit plan**, the **📜 Briefing** card is the planner's message to the alliance:

- **Add blocks:** heading, paragraph, bullet and callout.
- **Templates:** pick a saved line and fill in the blanks (player, zone, building, time, number). A template is translated once; filling in different names never needs translating again.
- **Live sections:** zone rosters, rotation plan, phase timeline, orders and substitute list, built from the plan itself. They update automatically when you move players.
- **Save as template:** turns any line you wrote into a reusable template. Replace names with blanks like `{player}`.
- **Templates button:** opens the library to add, edit or delete templates.
- **Copy briefing from…:** starts this week's briefing from last week's.
- **Copy briefing:** gives a Discord-ready version in whatever language you're viewing.

Lines marked **🌐 new** haven't been translated yet. Click **🌐 Translations → Translate what's new** before you **Save for everyone**. Only new wording is sent, and everything translated before is reused from the translation memory.

In **🌐 Translations** you can also:

- **Fix any line in any language.** Fixes are locked, so auto-translate never overwrites them.
- **Edit the glossary** of game terms (Sanctum, Abbey, Undercellar, Relic Points…). Each term is translated once, using the name the game itself uses in that language, and every sentence uses that version.

## Attendance

- **Players:** type your name in **Check my assignment**, then tap **✅ I'm in** or **❌ Can't make it**, with an optional note. No login needed.
- **Leaders:** the **Attendance** board shows who is in, out or hasn't replied, along with alerts for missing leads (with their backup) and for missing players (with a suggested sub).
  - **Copy roll call** makes a Discord post asking everyone to react ✅ or ❌.
  - **Mark from a list** marks everyone who reacted in one go.

## If → Then playbook

Plans branch depending on what happens. In **Edit plan**, the **🔀 If → Then playbook** card lists each branch:

- **IF:** pick a trigger template ("The enemy captures {building}", "{player} fails to report", "We lose both buildings in {zone}"…) or write your own.
- **THEN:** the orders, built the same way as the briefing (text, bullets, templates).
- **Applies to:** zones, roles (Building Leads, Co-Leads, Supporters, Substitutes, Sub Managers) and/or specific players. Nothing ticked means everyone.
- **Attach to a zone or building:** the entry becomes a **switch** on that zone's card and that building's panel, so one zone can shift plans while the others stay normal.
- **Replaces their normal orders:** while it's active, those players' usual orders show as paused.
- **When:** any time, or a specific phase.

Players see the entries that apply to them on their assignment card, with an **Only mine** filter on the playbook.

## Live match mode

Leaders tap **🔴 Live match** (top of the page, outside Edit mode):

- **Building status:** pick 🟢 Ours, 🔴 Enemy or ⚔️ Under attack, then tap buildings on the map. Every player's map updates within a second.
- **Suggested switches:** marking a building Enemy or Under attack offers any If → Then entry tied to that building, with one tap to activate it.
- **⚡ Activate / Resolve:** turns an entry on or off for everyone. Active entries appear in a red **LIVE** banner at the top of every screen, tagged "Applies to you" for the players affected.
- **📣 Message:** sends a short message to the banner on every screen.
- **Reset map** clears all building statuses.

None of this needs **Save for everyone**. It's live the moment you tap it.

## Speed and player experience

- **Faster loading:** after the first visit, phones load the plan from their own cache and then sync, so it opens quickly even on a weak connection.
- **Faster map:** shapes are only recalculated when buildings move, and bursts of live updates are combined into a single redraw.
- **Forgiving search:** "Check my assignment" ignores capitals, accents and symbols, so `seb` finds SébRãpïoň and `paul` finds ~PAUL.
- **Remembered player:** the site remembers who looked themselves up and opens their orders on the next visit. On phones, a **👤 My orders** button stays in the corner.
- **Alerts:** when an If → Then that applies to a player goes live, their browser tab shows ⚡ and phones vibrate.
