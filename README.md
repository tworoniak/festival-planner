# 🤘 Metal Festival Planner v1.0

A modern **React + TypeScript + Vite + Sass** web app for building your personal festival schedule.

Browse the lineup by **day** and **stage**, filter by **genre**, **search bands**, save **favorites**, and add sets to **My Plan** with automatic **conflict detection** (overlapping sets).

---

## ✨ Features

- 🗓️ Day tabs (Fri/Sat/etc.)
- 🎭 Stage-based schedule layout (sets grouped by stage)
- 🔎 Search bands (case-insensitive)
- 🧬 Genre filters (multi-select chips)
- ⭐ Favorites (toggle + filter favorites-only)
- ✅ My Plan drawer (add/remove sets)
- ⚠️ Conflict detection (overlapping sets highlighted + conflict list)
- 💾 Persistence via `localStorage`

---

## 🧰 Tech Stack

- React 18
- TypeScript
- Vite
- Sass (SCSS Modules)
- date-fns (time formatting)
- zod (lineup JSON validation)

---

## 🗺️ Roadmap Ideas

- Timeline grid view (Clashfinder-style)
- Shareable URL (encode planned sets)
- Export to iCal
- Band details modal (links, Spotify previews)
- PWA offline support

---

```code
src/
  app/
    App.tsx

  components/
    ui/
      index.ts
      toast.context.ts
      toast.types.ts
      ToastProvider.module.scss
      ToastProvider.tsx
      useToast.ts

  features/
    festival/
      components/
        DayTabs/
          DayTabs.tsx
          DayTabs.module.scss
        FiltersBar/
          FiltersBar.tsx
          FiltersBar.module.scss
        StageSchedule/
          StageSchedule.tsx
          StageSchedule.module.scss
        SetCard/
          SetCard.tsx
          SetCard.module.scss
        MyPlanDrawer/
          MyPlanDrawer.tsx
          MyPlanDrawer.module.scss

      data/
        festivals.ts
        lineup.sample.json //add more festival .json files as needed.
        lineup.schema.ts

      hooks/
        useFestivalData.ts

      pages/
        FestivalList.module.scss
        FestivalList.tsx
        FestivalPage.module.scss
        FestivalPage.tsx

      state/
        planner.store.ts

      types/
        festival.ts

      utils/
        conflicts.ts
        filters.ts
        planUrl.ts
        time.ts

  styles/
    base/
      _reset.scss
      _globals.scss
    abstracts/
      _tokens.scss
    main.scss

  main.tsx
```

---
