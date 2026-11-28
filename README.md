# Hearth — Household Budget

[![make.fun bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/faris-ecohomes/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/faris-ecohomes/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

**Hearth** is a household budget site that fits on one kitchen table: plan the
month, track every dollar, pay the bills on time, and save for what matters.

## What it does

Six views, all reached by links in the header, all working:

- **Dashboard** — income, spent, left to spend and savings rate at a glance,
  where the money went, bills coming up, the top savings goal, recent spending.
- **Budget** — every category against the 50 / 30 / 20 guide, with planned
  amounts you can edit in place; saving is planned first, and the
  unallocated remainder is shown so it can be given a job.
- **Transactions** — the full list for the month, filterable by category,
  type and search; add a purchase as it happens, delete one that was a
  mistake. Every total on the site follows from this list.
- **Bills** — every recurring bill with its due day and amount; tap to mark
  paid and the dashboard follows.
- **Goals** — savings goals with progress (emergency fund, vacation, new car)
  and a way to add money to any of them.
- **Reports** — six months of income vs spending, the category split, the
  biggest single expenses, and plain-language insights computed from the
  numbers.

## The example household

The site opens with example figures for a fictional household (the Alvarez
family, November 2026), clearly labelled as examples. Edit any budget, add
your own transactions, mark bills paid — everything is kept in the browser
only, and a "Reset to the example household" button in the footer restores
the examples.

## How it is built

Static files under `app/` — no build step, no framework, no network request
at all. `main.ts` copies `app/` and `screenshots/` to the output directory
and writes `dossier.json` with the kit's vendored library. Serve it with any
static server:

```
node serve.ts        # http://localhost:8080
```

## License

MIT — see [LICENSE](LICENSE).
