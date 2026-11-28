// Hearth — household state.
//
// Owns the budget data: loads the example household on first visit, keeps
// the household's edits in localStorage, and answers every "how much"
// question the views ask. No network, no cookies, no tracking.

const HEARTH_STORE_KEY = 'hearth-household-v1';

function hearthDeepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function hearthLoadState() {
  try {
    const raw = window.localStorage.getItem(HEARTH_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (err) {
    // A broken saved copy falls back to the example data.
  }
  return hearthDeepCopy(HEARTH_EXAMPLE);
}

function hearthSaveState(state) {
  try {
    window.localStorage.setItem(HEARTH_STORE_KEY, JSON.stringify(state));
  } catch (err) {
    // Private mode can refuse storage; the site still works for the visit.
  }
}

function hearthResetState() {
  const fresh = hearthDeepCopy(HEARTH_EXAMPLE);
  hearthSaveState(fresh);
  return fresh;
}

// --- Derived figures -------------------------------------------------------

function hearthTotalIncome(state) {
  return state.incomeSources.reduce((sum, source) => sum + source.amount, 0);
}

function hearthTotalSpent(state) {
  return state.transactions
    .filter((t) => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0);
}

function hearthTotalPlanned(state) {
  return state.categories.reduce((sum, c) => sum + c.planned, 0);
}

function hearthSavingsPlanned(state) {
  return state.savingsPlan.reduce((sum, s) => sum + s.planned, 0);
}

function hearthSpentByCategory(state) {
  const spent = {};
  for (const category of state.categories) spent[category.id] = 0;
  for (const t of state.transactions) {
    if (t.type === 'out' && Object.prototype.hasOwnProperty.call(spent, t.category)) {
      spent[t.category] += t.amount;
    }
  }
  return spent;
}

function hearthCategoryById(state, id) {
  return state.categories.find((c) => c.id === id) || null;
}

function hearthBillsDue(state) {
  return state.bills.filter((b) => !b.paid);
}

function hearthBillsMonthlyTotal(state) {
  return state.bills.reduce((sum, b) => sum + b.amount, 0);
}

// --- Edits ------------------------------------------------------------------

function hearthAddTransaction(state, fields) {
  const id = 't' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  const transaction = {
    id,
    date: fields.date,
    label: fields.label.trim(),
    category: fields.category,
    amount: Math.round(Math.abs(Number(fields.amount)) * 100) / 100,
    type: fields.type,
  };
  state.transactions.push(transaction);
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  hearthSaveState(state);
  return transaction;
}

function hearthDeleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  hearthSaveState(state);
}

function hearthSetBudget(state, categoryId, planned) {
  const category = hearthCategoryById(state, categoryId);
  if (!category) return;
  category.planned = Math.max(0, Math.round(Number(planned) * 100) / 100);
  hearthSaveState(state);
}

function hearthToggleBill(state, billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return;
  bill.paid = !bill.paid;
  hearthSaveState(state);
}

function hearthAddToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = Math.min(goal.target, goal.saved + Math.max(0, Number(amount) || 0));
  hearthSaveState(state);
}

// --- Formatting ---------------------------------------------------------------

function hearthMoney(amount) {
  const sign = amount < 0 ? '−' : '';
  return sign + '$' + Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function hearthMoneyShort(amount) {
  return '$' + Math.round(amount).toLocaleString('en-US');
}

function hearthPct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

function hearthDateLabel(isoDate) {
  const parts = isoDate.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[Number(parts[1]) - 1] + ' ' + Number(parts[2]);
}
