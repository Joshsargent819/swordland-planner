# Swordland Planner

Battle planner for K976 [OPC] Swordlands Summit League matches.
Players open the site, look up their assignment and check in without logging in. Leaders sign in with Google to edit plans and see attendance; the owner manages who has access in ⚙️ Settings.

**Files**

| File | What it is |
|---|---|
| `index.html` | The whole planner (map, plans, roster, attendance). |
| `firebase-config.js` | Your Firebase connection (already filled in). |
| `firestore.rules` | Who can read and write what (setup step 3). |
| `map.jpg` | The battle map (Duvy's Round 3 map). |
| `i18n/` | Ready-made translations of everything on the site, one file per language (22 files). |
| `netlify/functions/translate.js` | Optional. Only used if you ever switch on paid Google Translate. |


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

## Translation (23 languages, free)

Players pick their language from the 🌐 menu at the top. Everything on the site today is already translated into all 22 other languages, so there's nothing to set up: just upload the `i18n` folder along with the other files.

**When you change the plan** (new orders, new briefing lines, a new matchup), the new wording shows in English until you translate it:

1. Sign in, then go to **🛠 Admin → 🌐 Translations**. It shows how many lines each language still needs.
2. Pick a language and tap **Copy request**.
3. Paste it into any AI chat (Claude, ChatGPT, Gemini…) and copy its whole reply.
4. Paste the reply into the box and tap **Save translations**. The next language is picked for you.

Only new lines are included, so this is usually a few lines per language. Fixes you make by hand in the Translations panel always win over the ready-made files.

Paid Google Translate is still built in as an option (`netlify/functions/translate.js`) but is switched off; you don't need it.

## Changing the matchup

In **Edit plan**, tap **✏️ Change** next to the kingdoms at the top, or go to **🛠 Admin → ⚔️ Matchup**. You can set our kingdom and alliance tag, the opponent's, the round and the event name. Tick **Use our kingdom and tag for every plan** to update all plans at once.

## How the site is laid out

Tabs across the top:

- **🗺️ Map (first tab):** type a name in **Check my assignment**. Your buildings and Town Center spot get a gold ★ on the map, and your full orders appear right under it.
- **One tab per zone:** that zone's buildings, leads and co-leads, supporters, sub manager, rotations, Town Center spots and If → Then switches. These tabs follow the plan's zones, so renaming, adding or removing zones updates them automatically.
- **📜 Briefing**
- **🔀 If → Then**
- **⏱️ Schedule:** unlock times, phases, orders and map markers.
- **🛠 Admin** (leaders only): every plan tool, attendance, the plan check, substitutes and rotations.

Times show in **UTC** by default. Anyone can switch to their own local time.

## The map

The map is Duvy's Round 3 map, untouched. Each building's live **Lead / Co-Lead** card sits exactly over the printed box, so it always shows the current plan. The Purple banner's second line follows the plan too (Conceded or Active).

- ⛏ **Undercellars** are the six printed on the map. Tap one (in **Edit plan**) to set its **refresh times** (e.g. `15:00, 25:00, 35:00`). The times appear under it on the map, in that zone's tab and in **⏱️ Schedule**, and the next refresh is highlighted during the match. **Use these times for every Undercellar** copies them to all six.
- 📍 **Town Center spots:** tap to place them, then add the players who set up there.
- 🎁 **Loot crates:** tap to place them. Each one is tied to the phase you're viewing.

**Zones ▾** on the map toolbar moves buildings between zones, or leaves them out of the plan.

To use a newer copy of the same map, replace `map.jpg` in the repo with it. Keep the same file name and the same layout.

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

**+ Saved line…** opens a small fill-in box: pick the zone, tick the zones, choose the player or building, then **Insert**. The finished sentence goes into your text as normal writing you can edit. **Skip** inserts it with ___ blanks instead.

Translation stays cheap without any templates: player names, zone names, building names, times and numbers in each line are filled in automatically. "**Support** takes the Hall at **15:00**" is translated once, and when it becomes "**Duvy** takes the Mercenary Camp at **18:00**" no new translation is needed. The same goes for "We are CONCEDING **Purple**…" becoming "We are CONCEDING **Yellow**…".

The **🔀 If → Then** tab works the same way: one IF line and free-written THEN orders. **Who & where ▾** holds the zone, role and player options, the zone or building switch, and the phase.

New wording appears in English until you translate it with **🛠 Admin → 🌐 Translations** (see **Translation** above). That panel also shows progress and lets you fix any line.

## Saving

Every change saves on its own about a second after you make it, including dragging map pins. The edit bar shows **✓ All changes saved** (or **Saving…**). Use **↶ Undo** to step back; undoing saves too. **Done** leaves edit mode.

If another leader saves at the same moment, the bar asks you to **Load theirs** or **Keep mine**.

### Restore points

Autosave means mistakes are saved too, so keep restore points:
- **📌 Restore points** (edit bar, or 🛠 Admin → 🕘 Restore points): name one and tap **📌 Save restore point** before big changes. Yours are kept until you delete them.
- The planner also saves an automatic safety point when you start editing and before deleting a plan, importing, restoring, Load theirs / Keep mine, or applying pasted Plan data. The last 10 are kept; identical ones aren't saved twice.
- **Restore** (tap twice) brings the whole planner back to that moment. A safety point of how things were is saved first, so a restore can be undone.

**One-time setup:** restore points need the updated rules. Firebase console → Firestore Database → **Rules** → replace everything with the contents of `firestore.rules` → **Publish**.

## Changing leads and co-leads mid-match

Open a building in edit mode and use **+ Add a change**, as many times as you need. Each change has its own time (a phase or a set time) and can set a new lead, new co-leads, or both. Leave a box empty to keep whoever is there.

The map card shows who is in charge at the phase you are viewing, plus the next change. The zone tab shows each change, and every affected player's orders say what to do and when (“15:00 · Hand Green Sanctum over to Demadues” / “15:00 · Take command of Green Sanctum from Duvy” / “25:00 · Join Green Sanctum as co-lead”).

Round 3 is set up this way: Duvy takes the Swordshrine when it opens in Phase 2, and Demadues takes over the Green Sanctum.

## When orders change

When a leader changes something that affects a player, that player sees **“Your orders changed since you last looked”** at the top of their orders, with what changed, until they tap **Got it**. This is remembered per device. Every player's view also shows **🕒 Plan last updated** with the time of the last save.

## Editing on a phone

Editing works at phone width. The roster turns into one card per player, buttons are larger, and on the map you tap a pin to select it and drag it with one finger (the page doesn't scroll while you drag a pin in edit mode). A bigger screen is still easier for the first full setup.

## Roster: zone, role, subs and later moves

Each row in **👥 Roster** reads left to right:

| Zone | Role | Sub for · Later move |
|---|---|---|
| Blue, Green, Yellow, Purple, or Not in plan | Supporter, Lead · building, Co-Lead · building, or Substitute | For a sub: who they cover and which cycle. For everyone else: **Moves to Purple from Phase 2**, or Stays all match. |

- **Substitutes** keep a zone too (that zone's reserve). Pull a Blue sub to Green by changing their Zone.
- **Moving players between zones mid-match:** tap **+ Move later** on a row and pick the zone and when: the start of a phase, or **At a set time…** and type the time into the match (e.g. 22:00). Tap **+ Another move** to move them again later (e.g. Blue → Purple in Phase 2 → Yellow in Phase 3); ✕ removes a move. To move a group, tick them and use the bar above the list: **Later move to Purple**, pick a phase or a set time, **Apply**. Their orders change at each phase ("15:00 · Move to Purple and reinforce…"), the zone tabs list them under **Moving out** and **Arriving**, and the map follows them when you switch phases.
- **Subs:** every sub has the same **+ Move later** button, whether paired, on standby in a zone, or in **Any zone**. A paired sub with no moves of their own follows the player they cover; give them their own move (e.g. Green at 20:00) and that takes over.
- If players move into a zone that is still conceded at that phase, Plan check says so. Change that zone's concede setting to an earlier phase.

## Town Center spots

Place 📍 Town Center spots on the map and add players to them. Each of those players then sees a **📍 Show my spot on the map** button at the top of their orders: it jumps to the map, switches to the right phase and marks their pin with **★ Your spot**.

## Match phases

The game has three stages: buildings like the Stables, Bell Tower, Sanctums and Abbeys are open from 0:00; the Hall of Reformation, Mercenary Camp and Swordshrine unlock at 15:00; Undercellars spawn in waves at 15:00 and 20:00.
- New plans start with three phases: Opening (0:00–15:00), Mid-game (15:00–20:00), Late game (20:00–End). Add or remove phases in **📝 Plan text**.
- The Hall, Mercenary Camp and Swordshrine unlock in Phase 2 by default. The Swordshrine starts outside every zone: in edit mode, use **Zones ▾** and tap it to put it in the zone that will take it, then pick its lead.
- Undercellars use 15:00 and 20:00 refresh times unless you set others.

## Personal links

Every player has a link that opens straight to their own orders, with nothing to type. It works for anyone on the roster, including players you add later.

- **Players:** after looking themselves up, they tap **🔗 My link**. Their link also remembers their language.
- **Leaders:** in **👥 Roster**, tap **🔗 Link** next to any name to copy that player's link, or **🔗 Copy all links** for a list to paste into Discord. **🛠 Admin → 🔗 Player links** does the same.
- A link looks like `your-site.netlify.app/?p=Boshbon`. Add `&lang=es` (or any language code) to open it in that language.

## Saving and reusing plans

- **🛠 Admin → ⬇️ Export plan** saves the plan you're viewing as a file on your device.
- **🛠 Admin → ⬆️ Import plan** adds a plan from one of those files as a new plan. It never replaces an existing one. Players in the file who aren't on the roster are added; players already on the roster are matched by name. It saves automatically.
- **💾 Plan data** is still there for a backup of the whole planner at once.

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

It's live the moment you tap it.

## Speed and player experience

- **Faster loading:** after the first visit, phones load the plan from their own cache and then sync, so it opens quickly even on a weak connection.
- **Faster map:** shapes are only recalculated when buildings move, and bursts of live updates are combined into a single redraw.
- **Forgiving search:** "Check my assignment" ignores capitals, accents and symbols, so `seb` finds SébRãpïoň and `paul` finds ~PAUL.
- **Remembered player:** the site remembers who looked themselves up and opens their orders on the next visit. On phones, a **👤 My orders** button stays in the corner.
- **Alerts:** when an If → Then that applies to a player goes live, their browser tab shows ⚡ and phones vibrate.
