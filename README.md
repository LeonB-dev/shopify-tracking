# 08 — New Shopify site: tracking setup quickstart (beginner edition)


## What you need before you start
- [ ] Access to the client's **Shopify admin** (with theme-edit permission)
- [ ] A **Google account** that can access/create **GA4**, **Google Tag Manager**,
      and **Google Ads** for this client

## The two reusable files (in this KB)
- **`gtm-container-template.json`** — our ready-made GTM setup (GA4 tag, purchase
  tag, trigger, variables). You'll import this.
- **`pattern-b-pixel.template.js`** — the checkout pixel. You'll paste this.

You only ever change **two IDs**: the GA4 Measurement ID (`G-XXXXXXX`) and the
GTM container ID (`GTM-XXXXXXX`).

---

## PART 1 — Create the accounts & copy two IDs

**Step 1. GA4 property + Measurement ID**
- Go to Google Analytics → **Admin** → create a **GA4 property** for the client (or
  use theirs).
- Create a **Web data stream** for the store's domain.
- **Copy the Measurement ID** — it looks like `G-ABCDE12345`. Write it down.

**Step 2. GTM account + container ID**
- Go to Google Tag Manager → create a new **container**, type **Web**, for the
  store's domain.
- **Copy the container ID** — it looks like `GTM-XXXXXXX`. Write it down.

---

## PART 2 — Load our GTM template into the new container

**Step 3. Import the template**
- In the new GTM container: **Admin → Import Container**.
- Choose file: **`gtm-container-template.json`**.
- Workspace: **Existing → Default Workspace**.
- Import option: **Merge → Overwrite conflicting tags**. Confirm.
- You should now see tags like `GAnalytics Tag` and `GAnalytics Purchase`, a
  `checkout_completed` trigger, and some variables.

**Step 4. Put in the real Measurement ID**
- The template uses a placeholder `G-XXXXXXX`. Replace it with the real one from
  Step 1.
- Open **`GAnalytics Tag`** (the GA4 config tag) and set its Measurement ID /
  Tag ID to your `G-ABCDE12345`. (If there's a Constant variable holding the ID,
  set it there instead — same effect.)
- **Don't publish yet** — do it after Part 4.

---

## PART 3 — Install GTM on the storefront (theme)

This makes storefront pages (home, product, collection) send `page_view`.

**Step 5. Get the two GTM snippets**
- In GTM: **Admin → Install Google Tag Manager**. You'll see a `<head>` snippet
  and a `<body>` snippet.

**Step 6. Paste them into the theme**
- Shopify admin → **Online Store → Themes**. ⚠️ Best practice: click **⋯ →
  Duplicate** first and edit the **copy**, so you don't break the live site.
- On the copy: **⋯ → Edit code → `layout/theme.liquid`**.
- Paste the **`<head>` snippet** just after the opening `<head>` tag.
- Paste the **`<body>` snippet** just after the opening `<body>` tag.
- **Save.** (Publish the duplicated theme once you've tested, Part 6.)

---

## PART 4 — Install the checkout pixel

This is what tracks the **purchase**.

**Step 7. Add the custom pixel**
- Shopify admin → **Settings → Customer events → Add custom pixel**. Name it
  e.g. "datalayer pixel".
- Open **`pattern-b-pixel.template.js`**, copy ALL of it, paste it in.
- Find the line ending `'GTM-XXXXXXX'` and change it to **your** container ID
  from Step 2.
- **Save.** It should show **Connected**.

---

## PART 5 — Publish GTM

**Step 8.** In GTM, top right: **Submit → Publish**.
> ⚠️ Nothing you did in GTM is live until you publish. This is the #1 forgotten step.

---

## PART 6 — Test it (the important bit)

> 🚨 **TEST ON YOUR PHONE (or a clean browser with no ad blockers).** Your work
> laptop very likely blocks Google tracking (ad blocker / privacy settings /
> declined cookie banner), which makes a *working* setup look broken. We lost an
> hour to this on Glassware. Use a phone.

**Step 9.**
- Create a **100%-off discount + free shipping** so you can place a **£0 test
  order** without paying.
- On your **phone**: browse the store → add to cart → check out → reach the
  **Thank you** page.
- In **GA4 → Reports → Realtime** (or Admin → DebugView), confirm:
  - [ ] `page_view` appears (and only **once** per page — if you see two, see
        Troubleshooting)
  - [ ] `purchase` appears, with the right **value** and a populated **items** list
- Cross-check the GA4 purchase value against the **Shopify order**.
- If it all looks right: **publish the duplicated theme** (Step 6) to go live.

---

## PART 7 — Send purchases to Google Ads

**Step 10. Link + import (no new tags).**
- GA4 → Admin → **Product links → Google Ads links → Link** → choose the client's
  Ads account → enable auto-tagging → Submit.
- Google Ads → **Settings → Account settings → Auto-tagging = ON** (confirm).
- Google Ads → **Goals → Conversions → New conversion action → Import →
  Google Analytics 4 → Web** → tick **`purchase`** → Import.
- Set: Category **Purchase**, Value **from GA4**, Count **Every**, Primary if it
  should drive bidding.
- ⏳ Conversions take **24–48h** to show in Google Ads. Status becomes
  "Recording conversions" once data flows. (Full detail: the per-client Google
  Ads note.)

---

## Troubleshooting (the things that actually go wrong)

| Symptom | Most likely cause |
|---|---|
| Nothing shows in GA4 | Testing on a blocked device (ad blocker/consent). **Use your phone.** |
| Purchase doesn't show | GTM not **published**, or pixel not **saved** |
| "Can't see it in Tag Assistant" | Normal — the purchase fires in the checkout sandbox, which Tag Assistant can't see. Trust GA4. |
| `page_view` counted twice | GTM is firing it from both the theme AND the pixel sandbox. Tell the team — usually fixed by stopping the pixel's container from sending a page view. |
| `items` empty in purchase | Wrong line-item fields (must be `variant`, not `merchandise`) — but the template already handles this. |
| Wrong location in Realtime | IP geolocation is approximate. Ignore it. |

## Done = sign-off
Record in the client's checklist (copy of `07-per-site-checklist.md`): the two IDs,
test order ID, a DebugView screenshot of the `purchase`, and the date tested.
