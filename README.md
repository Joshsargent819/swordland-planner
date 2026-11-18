# Swordland Planner

Battle planner for K976 [OPC] Swordlands Summit League matches.
Players open the site, look up their assignment and check in without logging in. Leaders sign in with Google to edit plans and see attendance; the owner manages who has access in ⚙️ Settings.

**Files**

| File | What it is |
|---|---|
| `index.html` | The whole planner (map, plans, roster, attendance). |
| `firebase-config.js` | Your Firebase connection (already filled in). |
| `firestore.rules` | Who can read and write what (setup step 3). |
| `map.jpg` | The battle map (Duvy's Round 3 map, names removed). |
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

## How the site is laid out

Tabs across the top:

- **👤 My orders** (shows as **Players** for leaders): look up a name and see that player's assignment.
- **🗺️ Map:** the map, with a side panel for whatever you tap.
- **One tab per zone:** that zone's buildings, leads and co-leads, supporters, sub manager, rotations, Town Center spots and If → Then switches. These tabs follow the plan's zones, so renaming, adding or removing zones updates them automatically.
- **📜 Briefing**
- **🔀 If → Then**
- **⏱️ Schedule:** unlock times, phases, orders and map markers.
- **🛠 Admin** (leaders only): every plan tool, attendance, the plan check, substitutes and rotations.

Times show in **UTC** by default. Anyone can switch to their own local time.

## The map

The map is Duvy's Round 3 map with this week's names cleaned off. Building positions are fixed to it. In **Edit plan → Map**, you can place:

- 📍 **Town Center spots:** add the players who set up there.
- ⛏ **Undercellars:** each one shows only in the phase you place it in, because they spawn at different times.
- 🎁 **Loot crates:** also tied to a phase.

**Zones ▾** on the map toolbar moves buildings between zones, or leaves them out of the plan.

To use a clean copy of the map without any text, replace `map.jpg` in the repo with it. Keep the same file name and the same layout.

## Writing the briefing

In **Edit plan**, the **📜 Briefing** tab is a writing box with a live preview beside it. Just type:

| Type this | You get |
|---|---|
| `# Heading` | a heading |
| `## Subheading` | a smaller heading |
| `- text` | a bullet |
| `1. text` | a numbered line |
| `> text` | a red callout |
| `**text**` | bold |
| `[[zones]]` `[[rotations]]` `[[playbook]]` `[[orders]]` `[[timeline]]` `[[subs]]` | a live section built from the plan |

The buttons above the box insert these for you. **Saved line** inserts a reusable sentence.

Translation stays cheap without any templates: player names, times and numbers in each line are filled in automatically. "**Support** takes the Hall at **15:00**" is translated once, and when it becomes "**Duvy** takes the Hall at **18:00**" no new translation is needed.

The **🔀 If → Then** tab works the same way: one IF line and free-written THEN orders. **Who & where ▾** holds the zone, role and player options, the zone or building switch, and the phase.

When the briefing shows **🌐 new lines to translate**, run **🛠 Admin → 🌐 Translations → Translate what's new** before you save.

## Attendance

- **Players:** type your name in **Check my assignment**, then tap **✅ I'm in** or **❌ Can't make it**, with an optional note. No login needed.
- **Leaders:** the **Attendance** board shows who is in, out or hasn't replied, along with alerts for missing leads (with their backup) and for missing players (with a suggested sub).
  - **Copy roll call** makes a Discord post asking everyone to react ✅ or ❌.
  - **Mark from a list** marks everyone who reacted in one go.

## If → Then playbook

Plans branch depending on what happens. In **Edit plan**, the **🔀 If → Then playbook** card lists each branch:

- **IF:** write the trigger, e.g. "The enemy captures Blue Sanctum". Saved triggers are suggested as you type.
- **THEN:** the orders, written the same way as the briefing.
- **Applies to:** zones, roles (Building Leads, Co-Leads, Supporters, Substitutes, Sub Managers) and/or specific players. Nothing ticked means everyone.
- **Attach to a zone or building:** the entry becomes a **switch** on that zone's card and that building's panel, so one zone can shift plans while the others stay normal.
- **Replaces their normal orders:** while it's active, those players' usual orders show as paused.
- **When:** any time, or a specific phase.

Players see the entries that apply to them on their assignment card, with an **Only mine** filter on the playbook.

## Live match mode

Leaders tap **🔴 Live match** on the **🗺️ Map** tab, outside Edit mode:

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
