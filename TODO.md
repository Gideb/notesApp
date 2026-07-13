# TODO - Tailwind bg-primary not working

- [ ] Inspect Tailwind build setup and verify bg-primary class generation.
- [ ] Identify why `bg-primary` / `text-primary` isn’t applying (common causes: misconfigured Tailwind, missing `bg-primary` usage in content, CSS import order, or class purging).
- [ ] Implement fix (likely ensure Tailwind `primary` color is used and class names are correct; confirm no typo; ensure `@import "tailwindcss";` is correct for v4+ or adjust to `@tailwind base/components/utilities`).
- [ ] Re-run dev build / lint to confirm Tailwind generates `bg-primary` styles.
