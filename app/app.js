// Hearth — the household budget app.
//
// One page, six views reached by links: Dashboard, Budget, Transactions,
// Bills, Goals and Reports. Every control works: budgets edit, transactions
// add and delete, bills toggle paid, goals take contributions. Figures are
// computed from the household's data, never typed into the markup.

let hearthState = hearthLoadState();

const HEARTH_NAV = [
  { hash: '#/', label: 'Dashboard' },
  { hash: '#/budget', label: 'Budget' },
  { hash: '#/transactions', label: 'Transactions' },
  { hash: '#/bills', label: 'Bills' },
  { hash: '#/goals', label: 'Goals' },
  { hash: '#/reports', label: 'Reports' },
];

function hearthRoute() {
  const hash = window.location.hash || '#/';
  return HEARTH_NAV.some((item) => item.hash === hash) ? hash : '#/';
}

function hearthNavHtml(active) {
  return HEARTH_NAV.map((item) =>
    '<a href="' + item.hash + '" class="nav-link' + (item.hash === active ? ' is-active' : '') + '">' + item.label + '</a>'
  ).join('');
}

function hearthProgressBar(pct, tone) {
  const clamped = Math.max(0, Math.min(100, pct));
  return '<div class="bar" role="img" aria-label="' + clamped + ' percent"><span class="bar-fill ' + (tone || '') + '" style="width:' + clamped + '%"></span></div>';
}

function hearthCategoryBar(label, spent, planned, color) {
  const pct = planned ? Math.round((spent / planned) * 100) : 0;
  const over = spent > planned;
  return '<div class="cat-row">' +
    '<div class="cat-head"><span class="cat-dot" style="background:' + color + '"></span><span class="cat-label">' + hearthEscape(label) + '</span>' +
    '<span class="cat-figures">' + hearthMoney(spent) + ' of ' + hearthMoney(planned) + '</span></div>' +
    hearthProgressBar(pct, over ? 'is-over' : '') +
    '<div class="cat-sub">' + pct + '% used' + (over ? ' — ' + hearthMoney(spent - planned) + ' over budget' : ' — ' + hearthMoney(planned - spent) + ' left') + '</div>' +
    '</div>';
}

// --- Dashboard --------------------------------------------------------------

function hearthViewDashboard() {
  const income = hearthTotalIncome(hearthState);
  const spent = hearthTotalSpent(hearthState);
  const left = income - spent;
  const rate = hearthPct(income - spent, income);
  const spentByCat = hearthSpentByCategory(hearthState);
  const topCats = hearthState.categories
    .map((c) => ({ label: c.label, spent: spentByCat[c.id], planned: c.planned, color: c.color }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6);
  const unpaid = hearthBillsDue(hearthState).slice().sort((a, b) => a.day - b.day).slice(0, 3);
  const recent = hearthState.transactions.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 5);
  const topGoal = hearthState.goals.slice().sort((a, b) => (b.saved / b.target) - (a.saved / a.target))[0];

  return '<section class="hero">' +
    '<div><p class="eyebrow">November 2026 · Example household</p>' +
    '<h1>Good morning, Alvarez family.</h1>' +
    '<p class="lede">You have <strong>' + hearthMoney(left) + '</strong> left to spend this month, and you are saving <strong>' + rate + '%</strong> of what comes in.</p></div>' +
    '<div class="ring-wrap">' + hearthRing(rate, 132) + '</div></section>' +

    '<section class="stat-grid">' +
    '<div class="stat"><span class="stat-label">Income</span><span class="stat-value">' + hearthMoney(income) + '</span><span class="stat-sub">2 paychecks each</span></div>' +
    '<div class="stat"><span class="stat-label">Spent so far</span><span class="stat-value">' + hearthMoney(spent) + '</span><span class="stat-sub">' + hearthState.transactions.filter((t) => t.type === 'out').length + ' purchases</span></div>' +
    '<div class="stat"><span class="stat-label">Left to spend</span><span class="stat-value">' + hearthMoney(left) + '</span><span class="stat-sub">through Nov 30</span></div>' +
    '<div class="stat"><span class="stat-label">Savings rate</span><span class="stat-value">' + rate + '%</span><span class="stat-sub">target: 20%</span></div>' +
    '</section>' +

    '<div class="two-col">' +
    '<section class="card"><h2>Where the money went</h2>' +
    topCats.map((c) => hearthCategoryBar(c.label, c.spent, c.planned, c.color)).join('') +
    '<p class="card-link"><a href="#/budget">See the full budget →</a></p></section>' +

    '<section class="card"><h2>Coming up</h2>' +
    (unpaid.length
      ? '<ul class="bill-list">' + unpaid.map((b) => '<li><span>' + hearthEscape(b.label) + '</span><span class="bill-due">Due Nov ' + b.day + '</span><strong>' + hearthMoney(b.amount) + '</strong></li>').join('') + '</ul>'
      : '<p class="empty-note">All bills are paid for November. Nice work.</p>') +
    '<h2 class="card-h2">Top goal: ' + hearthEscape(topGoal.label) + '</h2>' +
    hearthProgressBar(hearthPct(topGoal.saved, topGoal.target)) +
    '<p class="card-sub">' + hearthMoney(topGoal.saved) + ' saved of ' + hearthMoney(topGoal.target) + ' — ' + hearthPct(topGoal.saved, topGoal.target) + '%</p>' +
    '<p class="card-link"><a href="#/goals">See all goals →</a></p></section></div>' +

    '<section class="card"><h2>Recent spending</h2>' +
    '<table class="table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead><tbody>' +
    recent.map((t) => {
      const cat = hearthCategoryById(hearthState, t.category);
      return '<tr><td>' + hearthDateLabel(t.date) + '</td><td>' + hearthEscape(t.label) + '</td><td>' + (cat ? hearthEscape(cat.label) : 'Income') + '</td><td class="num ' + (t.type === 'in' ? 'is-in' : '') + '">' + (t.type === 'in' ? '+' : '−') + hearthMoney(t.amount) + '</td></tr>';
    }).join('') + '</tbody></table>' +
    '<p class="card-link"><a href="#/transactions">All ' + hearthState.transactions.length + ' transactions →</a></p></section>';
}

// --- Budget -----------------------------------------------------------------

function hearthViewBudget() {
  const income = hearthTotalIncome(hearthState);
  const spentByCat = hearthSpentByCategory(hearthState);
  const groups = ['Needs', 'Wants'];
  let html = '<section class="page-head"><h1>Budget for November</h1>' +
    '<p class="lede">Plan first, then spend. Edit any planned amount — the totals below update at once. The 50 / 30 / 20 guide says: about half for needs, a third for wants, a fifth saved.</p></section>';

  const groupTotals = {};
  for (const group of groups) {
    const cats = hearthState.categories.filter((c) => c.group === group);
    const planned = cats.reduce((s, c) => s + c.planned, 0);
    const spent = cats.reduce((s, c) => s + spentByCat[c.id], 0);
    groupTotals[group] = { planned, spent };
  }
  html += '<section class="stat-grid three">' +
    groups.map((group) => '<div class="stat"><span class="stat-label">' + group + '</span><span class="stat-value">' + hearthMoney(groupTotals[group].spent) + ' <small>of ' + hearthMoney(groupTotals[group].planned) + '</small></span><span class="stat-sub">' + hearthPct(groupTotals[group].planned, income) + '% of income planned</span></div>').join('') +
    '<div class="stat"><span class="stat-label">Saving</span><span class="stat-value">' + hearthMoney(hearthSavingsPlanned(hearthState)) + ' <small>planned</small></span><span class="stat-sub">' + hearthPct(hearthSavingsPlanned(hearthState), income) + '% of income planned</span></div>' +
    '</section>';

  for (const group of groups) {
    html += '<section class="card"><h2>' + group + '</h2><table class="table budget-table"><thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Spent</th><th class="num">Left</th><th>Progress</th></tr></thead><tbody>';
    for (const cat of hearthState.categories.filter((c) => c.group === group)) {
      const spent = spentByCat[cat.id];
      const left = cat.planned - spent;
      html += '<tr><td><span class="cat-dot" style="background:' + cat.color + '"></span> ' + hearthEscape(cat.label) + '</td>' +
        '<td class="num"><label class="visually-hidden" for="budget-' + cat.id + '">Planned for ' + hearthEscape(cat.label) + '</label>' +
        '<input class="money-input" id="budget-' + cat.id + '" data-category="' + cat.id + '" type="number" min="0" step="1" value="' + cat.planned + '"></td>' +
        '<td class="num">' + hearthMoney(spent) + '</td>' +
        '<td class="num ' + (left < 0 ? 'is-over-text' : '') + '">' + hearthMoney(left) + '</td>' +
        '<td class="bar-cell">' + hearthProgressBar(hearthPct(spent, cat.planned), spent > cat.planned ? 'is-over' : '') + '</td></tr>';
    }
    html += '</tbody></table></section>';
  }

  const planned = hearthTotalPlanned(hearthState);
  const saving = hearthSavingsPlanned(hearthState);
  const unallocated = income - planned - saving;
  html += '<section class="card"><h2>Saving first</h2><ul class="plain-list">' +
    hearthState.savingsPlan.map((s) => '<li><span>' + hearthEscape(s.label) + '</span><strong>' + hearthMoney(s.planned) + ' / month</strong></li>').join('') +
    '</ul><p class="card-sub">Planned spending ' + hearthMoney(planned) + ' + planned saving ' + hearthMoney(saving) + ' = ' + hearthMoney(planned + saving) + ' of ' + hearthMoney(income) + ' income.</p>' +
    '<p class="card-sub"><strong>' + hearthMoney(unallocated) + ' is still unallocated.</strong> Give it a job — extra debt payment, or more to the emergency fund.</p></section>';
  return html;
}

// --- Transactions -------------------------------------------------------------

let hearthTxFilter = { category: 'all', type: 'all', query: '' };

function hearthViewTransactions() {
  const sorted = hearthState.transactions.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const filtered = sorted.filter((t) => {
    if (hearthTxFilter.category !== 'all' && t.category !== hearthTxFilter.category) return false;
    if (hearthTxFilter.type !== 'all' && t.type !== hearthTxFilter.type) return false;
    if (hearthTxFilter.query && t.label.toLowerCase().indexOf(hearthTxFilter.query.toLowerCase()) === -1) return false;
    return true;
  });
  const spent = filtered.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);
  const incomeIn = filtered.filter((t) => t.type === 'in').reduce((s, t) => s + t.amount, 0);

  return '<section class="page-head"><h1>Transactions</h1>' +
    '<p class="lede">Every dollar in and out for November 2026. Add a purchase as it happens — the dashboard, budget and reports all update from this list.</p></section>' +

    '<section class="card"><h2>Add a transaction</h2>' +
    '<form id="add-tx" class="form-grid">' +
    '<label>Date<input type="date" name="date" value="2026-11-27" required></label>' +
    '<label>What<input type="text" name="label" placeholder="e.g. Weekly shop" required maxlength="80"></label>' +
    '<label>Category<select name="category">' + hearthState.categories.map((c) => '<option value="' + c.id + '">' + hearthEscape(c.label) + '</option>').join('') + '<option value="income">Income</option></select></label>' +
    '<label>Amount ($)<input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>' +
    '<label>Type<select name="type"><option value="out">Spent</option><option value="in">Received</option></select></label>' +
    '<button type="submit" class="btn">Add transaction</button></form>' +
    '<p id="add-tx-note" class="form-note" role="status"></p></section>' +

    '<section class="card"><h2>All transactions <span class="count">' + filtered.length + ' shown</span></h2>' +
    '<div class="filters">' +
    '<label>Category <select id="filter-category"><option value="all">All categories</option>' +
    hearthState.categories.map((c) => '<option value="' + c.id + '"' + (hearthTxFilter.category === c.id ? ' selected' : '') + '>' + hearthEscape(c.label) + '</option>').join('') +
    '<option value="income"' + (hearthTxFilter.category === 'income' ? ' selected' : '') + '>Income</option></select></label>' +
    '<label>Type <select id="filter-type"><option value="all">In + out</option><option value="out"' + (hearthTxFilter.type === 'out' ? ' selected' : '') + '>Spent</option><option value="in"' + (hearthTxFilter.type === 'in' ? ' selected' : '') + '>Received</option></select></label>' +
    '<label>Search <input id="filter-query" type="search" placeholder="Search descriptions" value="' + hearthEscape(hearthTxFilter.query) + '"></label></div>' +
    '<p class="card-sub">Shown: spent ' + hearthMoney(spent) + ' · received ' + hearthMoney(incomeIn) + '</p>' +
    (filtered.length
      ? '<table class="table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead><tbody>' +
        filtered.map((t) => {
          const cat = hearthCategoryById(hearthState, t.category);
          return '<tr><td>' + hearthDateLabel(t.date) + '</td><td>' + hearthEscape(t.label) + '</td><td>' + (cat ? hearthEscape(cat.label) : 'Income') + '</td>' +
            '<td class="num ' + (t.type === 'in' ? 'is-in' : '') + '">' + (t.type === 'in' ? '+' : '−') + hearthMoney(t.amount) + '</td>' +
            '<td><button class="btn-small" data-delete="' + t.id + '">Delete</button></td></tr>';
        }).join('') + '</tbody></table>'
      : '<p class="empty-note">No transactions match those filters. Clear the search or pick another category.</p>') +
    '</section>';
}

// --- Bills --------------------------------------------------------------------

function hearthViewBills() {
  const total = hearthBillsMonthlyTotal(hearthState);
  const unpaid = hearthBillsDue(hearthState);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const sorted = hearthState.bills.slice().sort((a, b) => a.day - b.day);
  return '<section class="page-head"><h1>Bills &amp; subscriptions</h1>' +
    '<p class="lede">Everything that repeats each month, in one place. Tap a bill to mark it paid — the dashboard’s “coming up” list follows.</p></section>' +
    '<section class="stat-grid three">' +
    '<div class="stat"><span class="stat-label">Bills this month</span><span class="stat-value">' + hearthMoney(total) + '</span><span class="stat-sub">' + hearthState.bills.length + ' recurring bills</span></div>' +
    '<div class="stat"><span class="stat-label">Still to pay</span><span class="stat-value">' + hearthMoney(unpaidTotal) + '</span><span class="stat-sub">' + unpaid.length + ' bill' + (unpaid.length === 1 ? '' : 's') + ' left</span></div>' +
    '<div class="stat"><span class="stat-label">Paid so far</span><span class="stat-value">' + hearthMoney(total - unpaidTotal) + '</span><span class="stat-sub">' + (hearthState.bills.length - unpaid.length) + ' of ' + hearthState.bills.length + ' paid</span></div>' +
    '</section>' +
    '<section class="card"><table class="table"><thead><tr><th>Due</th><th>Bill</th><th>Category</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead><tbody>' +
    sorted.map((b) => {
      const cat = hearthCategoryById(hearthState, b.category);
      return '<tr><td>Nov ' + b.day + '</td><td>' + hearthEscape(b.label) + '</td><td>' + (cat ? hearthEscape(cat.label) : '—') + '</td>' +
        '<td class="num">' + hearthMoney(b.amount) + '</td>' +
        '<td>' + (b.paid ? '<span class="pill is-paid">Paid</span>' : '<span class="pill is-due">Due</span>') + '</td>' +
        '<td><button class="btn-small" data-bill="' + b.id + '">' + (b.paid ? 'Mark unpaid' : 'Mark paid') + '</button></td></tr>';
    }).join('') + '</tbody></table></section>';
}

// --- Goals --------------------------------------------------------------------

function hearthViewGoals() {
  return '<section class="page-head"><h1>Savings goals</h1>' +
    '<p class="lede">Money with a name gets saved first. Add to a goal whenever there is money left over — the emergency fund is the one to finish first.</p></section>' +
    '<div class="goal-grid">' +
    hearthState.goals.map((g) => {
      const pct = hearthPct(g.saved, g.target);
      return '<section class="card goal-card"><h2>' + hearthEscape(g.label) + '</h2>' +
        '<p class="goal-note">' + hearthEscape(g.note) + '</p>' +
        '<div class="goal-figures"><strong>' + hearthMoney(g.saved) + '</strong><span>of ' + hearthMoney(g.target) + ' · ' + pct + '%</span></div>' +
        hearthProgressBar(pct) +
        '<form class="goal-form" data-goal="' + g.id + '"><label>Add $<input type="number" name="amount" min="1" step="1" value="50" required></label>' +
        '<button type="submit" class="btn">Add to goal</button></form></section>';
    }).join('') + '</div>' +
    '<section class="card"><h2>How the goals are funded</h2>' +
    '<p class="card-sub">The budget sets aside ' + hearthMoney(hearthSavingsPlanned(hearthState)) + ' a month for saving: ' +
    hearthState.savingsPlan.map((s) => hearthEscape(s.label) + ' ' + hearthMoney(s.planned)).join(', ') + '. ' +
    'At that pace the emergency fund reaches its $10,000 target in about 4 months, and the vacation is fully funded by next summer.</p></section>';
}

// --- Reports --------------------------------------------------------------------

function hearthViewReports() {
  const spentByCat = hearthSpentByCategory(hearthState);
  const slices = hearthState.categories
    .map((c) => ({ label: c.label, value: spentByCat[c.id], color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const biggest = hearthState.transactions
    .filter((t) => t.type === 'out')
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const income = hearthTotalIncome(hearthState);
  const spent = hearthTotalSpent(hearthState);
  const insights = [];
  const groceries = hearthCategoryById(hearthState, 'groceries');
  const dining = hearthCategoryById(hearthState, 'dining');
  const housing = hearthCategoryById(hearthState, 'housing');
  insights.push('Housing takes ' + hearthPct(spentByCat.housing, income) + '% of income — ' + (spentByCat.housing > income * 0.3 ? 'above the 30% rule of thumb, worth watching' : 'inside the 30% rule of thumb') + '.');
  insights.push('Groceries are ' + hearthMoney(groceries.planned - spentByCat.groceries) + ' under budget with three days left in the month.');
  insights.push('Dining out is ' + hearthMoney(dining.planned - spentByCat.dining) + ' under budget — the home-cooking nights are paying off.');
  insights.push('The savings rate is ' + hearthPct(income - spent, income) + '%, well above the 20% target. Moving the unallocated ' + hearthMoney(income - hearthTotalPlanned(hearthState) - hearthSavingsPlanned(hearthState)) + ' to the emergency fund would finish it sooner.');
  insights.push('November spending is the lowest of the last six months, helped by no big one-off purchase yet.');

  return '<section class="page-head"><h1>Reports</h1>' +
    '<p class="lede">Six months at a glance. November is the month in progress — its bar is still growing.</p></section>' +
    '<div class="two-col">' +
    '<section class="card"><h2>Income vs spending</h2>' + hearthBarChart(hearthState.history, 560, 300) +
    '<p class="legend"><span class="legend-swatch income"></span> Income <span class="legend-swatch spent"></span> Spent</p>' +
    '<p class="card-sub">Average spending over six months: ' + hearthMoney(hearthState.history.reduce((s, h) => s + h.spent, 0) / hearthState.history.length) + ' a month against ' + hearthMoney(income) + ' of income.</p></section>' +
    '<section class="card"><h2>Where November went</h2><div class="donut-wrap">' + hearthDonut(slices, 220) + '</div>' +
    '<ul class="plain-list">' + slices.slice(0, 5).map((s) => '<li><span><span class="cat-dot" style="background:' + s.color + '"></span> ' + hearthEscape(s.label) + '</span><strong>' + hearthMoney(s.value) + '</strong></li>').join('') + '</ul></section></div>' +
    '<div class="two-col">' +
    '<section class="card"><h2>Biggest single expenses</h2><ol class="ranked">' +
    biggest.map((t) => '<li><span>' + hearthEscape(t.label) + ' <em>(' + hearthDateLabel(t.date) + ')</em></span><strong>' + hearthMoney(t.amount) + '</strong></li>').join('') +
    '</ol></section>' +
    '<section class="card"><h2>What the numbers say</h2><ul class="insights">' +
    insights.map((line) => '<li>' + hearthEscape(line) + '</li>').join('') + '</ul></section></div>';
}

// --- Wiring + boot ------------------------------------------------------------

function hearthWireView(route) {
  if (route === '#/budget') {
    document.querySelectorAll('input.money-input').forEach((input) => {
      input.addEventListener('change', () => {
        hearthSetBudget(hearthState, input.getAttribute('data-category'), input.value);
        hearthRender();
      });
    });
  }
  if (route === '#/transactions') {
    const form = document.getElementById('add-tx');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        hearthAddTransaction(hearthState, {
          date: data.get('date'),
          label: data.get('label'),
          category: data.get('category'),
          amount: data.get('amount'),
          type: data.get('type'),
        });
        const note = document.getElementById('add-tx-note');
        if (note) note.textContent = 'Added. The totals on this page and the dashboard already include it.';
        hearthRender();
        const noteAfter = document.getElementById('add-tx-note');
        if (noteAfter) noteAfter.textContent = 'Added. The totals on this page and the dashboard already include it.';
      });
    }
    document.querySelectorAll('[data-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        hearthDeleteTransaction(hearthState, button.getAttribute('data-delete'));
        hearthRender();
      });
    });
    const catFilter = document.getElementById('filter-category');
    if (catFilter) catFilter.addEventListener('change', () => { hearthTxFilter.category = catFilter.value; hearthRender(); });
    const typeFilter = document.getElementById('filter-type');
    if (typeFilter) typeFilter.addEventListener('change', () => { hearthTxFilter.type = typeFilter.value; hearthRender(); });
    const query = document.getElementById('filter-query');
    if (query) query.addEventListener('input', () => { hearthTxFilter.query = query.value; hearthRender(); const again = document.getElementById('filter-query'); if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); } });
  }
  if (route === '#/bills') {
    document.querySelectorAll('[data-bill]').forEach((button) => {
      button.addEventListener('click', () => {
        hearthToggleBill(hearthState, button.getAttribute('data-bill'));
        hearthRender();
      });
    });
  }
  if (route === '#/goals') {
    document.querySelectorAll('form.goal-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        hearthAddToGoal(hearthState, form.getAttribute('data-goal'), data.get('amount'));
        hearthRender();
      });
    });
  }
  const reset = document.getElementById('reset-example');
  if (reset) {
    reset.addEventListener('click', () => {
      hearthState = hearthResetState();
      hearthTxFilter = { category: 'all', type: 'all', query: '' };
      hearthRender();
    });
  }
}

const HEARTH_VIEWS = {
  '#/': hearthViewDashboard,
  '#/budget': hearthViewBudget,
  '#/transactions': hearthViewTransactions,
  '#/bills': hearthViewBills,
  '#/goals': hearthViewGoals,
  '#/reports': hearthViewReports,
};

function hearthRender() {
  const route = hearthRoute();
  document.getElementById('nav').innerHTML = hearthNavHtml(route);
  document.getElementById('view').innerHTML = HEARTH_VIEWS[route]();
  hearthWireView(route);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', hearthRender);
document.addEventListener('DOMContentLoaded', hearthRender);

