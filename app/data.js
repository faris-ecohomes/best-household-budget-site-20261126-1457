// Hearth — example household data.
//
// Everything here is EXAMPLE data for a fictional household (the Alvarez
// family, November 2026), included so the site opens with real figures in
// place. Nothing here is a real person's money. The app lets the household
// edit every number, add transactions and reset back to this example.

const HEARTH_EXAMPLE = {
  household: {
    name: 'The Alvarez Family',
    members: ['Maya — teacher', 'Jordan — nurse', 'Sofia — age 4'],
    month: 'November 2026',
    note: 'Example household — edit any figure to fit your own home.',
  },

  incomeSources: [
    { id: 'inc-maya', label: "Maya's paycheck", amount: 4200, when: '1st + 15th' },
    { id: 'inc-jordan', label: "Jordan's paycheck", amount: 2650, when: '8th + 22nd' },
  ],

  // Planned monthly budget per category, in dollars.
  categories: [
    { id: 'housing', label: 'Housing', planned: 1850, group: 'Needs', color: '#2f6b4f' },
    { id: 'groceries', label: 'Groceries', planned: 720, group: 'Needs', color: '#5b8c5a' },
    { id: 'utilities', label: 'Utilities', planned: 285, group: 'Needs', color: '#7ba05b' },
    { id: 'transport', label: 'Transport', planned: 340, group: 'Needs', color: '#8a9a5b' },
    { id: 'childcare', label: 'Childcare', planned: 520, group: 'Needs', color: '#4a7c59' },
    { id: 'insurance', label: 'Insurance', planned: 410, group: 'Needs', color: '#3d6e57' },
    { id: 'health', label: 'Health', planned: 120, group: 'Needs', color: '#6b9080' },
    { id: 'dining', label: 'Dining out', planned: 380, group: 'Wants', color: '#c46a3b' },
    { id: 'streaming', label: 'Streaming', planned: 48, group: 'Wants', color: '#d08a4e' },
    { id: 'clothing', label: 'Clothing', planned: 150, group: 'Wants', color: '#b98a44' },
    { id: 'fun', label: 'Fun money', planned: 240, group: 'Wants', color: '#a67c52' },
    { id: 'fitness', label: 'Fitness', planned: 65, group: 'Wants', color: '#97714a' },
    { id: 'home', label: 'Home', planned: 100, group: 'Wants', color: '#8c7b6c' },
  ],

  savingsPlan: [
    { id: 'sv-emergency', label: 'Emergency fund', planned: 500 },
    { id: 'sv-retirement', label: 'Retirement', planned: 400 },
    { id: 'sv-vacation', label: 'Vacation', planned: 150 },
  ],

  // November 2026 transactions. Amounts are dollars; type is 'in' or 'out'.
  transactions: [
    { id: 't01', date: '2026-11-01', label: 'Rent — Maple Street', category: 'housing', amount: 1850.0, type: 'out' },
    { id: 't02', date: '2026-11-01', label: "Maya's paycheck", category: 'income', amount: 2100.0, type: 'in' },
    { id: 't03', date: '2026-11-02', label: 'Whole Foods Market', category: 'groceries', amount: 186.4, type: 'out' },
    { id: 't04', date: '2026-11-03', label: 'Shell fuel', category: 'transport', amount: 52.3, type: 'out' },
    { id: 't05', date: '2026-11-04', label: 'Netflix', category: 'streaming', amount: 15.49, type: 'out' },
    { id: 't06', date: '2026-11-05', label: "Trader Joe's", category: 'groceries', amount: 142.75, type: 'out' },
    { id: 't07', date: '2026-11-06', label: 'Chipotle', category: 'dining', amount: 28.4, type: 'out' },
    { id: 't08', date: '2026-11-07', label: 'Electric bill', category: 'utilities', amount: 128.6, type: 'out' },
    { id: 't09', date: '2026-11-08', label: 'Little Sprouts daycare', category: 'childcare', amount: 260.0, type: 'out' },
    { id: 't10', date: '2026-11-08', label: "Jordan's paycheck", category: 'income', amount: 1325.0, type: 'in' },
    { id: 't11', date: '2026-11-10', label: 'Costco', category: 'groceries', amount: 214.9, type: 'out' },
    { id: 't12', date: '2026-11-11', label: 'Amazon — winter coat', category: 'clothing', amount: 64.99, type: 'out' },
    { id: 't13', date: '2026-11-12', label: 'Uber', category: 'transport', amount: 18.75, type: 'out' },
    { id: 't14', date: '2026-11-13', label: 'Olive Garden', category: 'dining', amount: 56.2, type: 'out' },
    { id: 't15', date: '2026-11-14', label: 'Internet', category: 'utilities', amount: 79.99, type: 'out' },
    { id: 't16', date: '2026-11-15', label: 'CVS Pharmacy', category: 'health', amount: 42.18, type: 'out' },
    { id: 't17', date: '2026-11-15', label: "Maya's paycheck", category: 'income', amount: 2100.0, type: 'in' },
    { id: 't18', date: '2026-11-16', label: 'Spotify', category: 'streaming', amount: 11.99, type: 'out' },
    { id: 't19', date: '2026-11-17', label: 'Target', category: 'groceries', amount: 96.44, type: 'out' },
    { id: 't20', date: '2026-11-18', label: 'Gym membership', category: 'fitness', amount: 65.0, type: 'out' },
    { id: 't21', date: '2026-11-19', label: 'Pizza night', category: 'dining', amount: 34.5, type: 'out' },
    { id: 't22', date: '2026-11-20', label: 'Car insurance', category: 'insurance', amount: 205.0, type: 'out' },
    { id: 't23', date: '2026-11-21', label: 'Little Sprouts daycare', category: 'childcare', amount: 260.0, type: 'out' },
    { id: 't24', date: '2026-11-22', label: 'Water bill', category: 'utilities', amount: 76.4, type: 'out' },
    { id: 't25', date: '2026-11-22', label: "Jordan's paycheck", category: 'income', amount: 1325.0, type: 'in' },
    { id: 't26', date: '2026-11-23', label: 'H&M', category: 'clothing', amount: 48.3, type: 'out' },
    { id: 't27', date: '2026-11-24', label: 'Gas station', category: 'transport', amount: 47.8, type: 'out' },
    { id: 't28', date: '2026-11-25', label: 'Farmers market', category: 'groceries', amount: 58.6, type: 'out' },
    { id: 't29', date: '2026-11-26', label: 'Movie night', category: 'fun', amount: 42.0, type: 'out' },
    { id: 't30', date: '2026-11-27', label: 'Home Depot', category: 'home', amount: 89.99, type: 'out' },
  ],

  // Recurring bills. `day` is the day of the month it is due.
  bills: [
    { id: 'b01', label: 'Rent — Maple Street', amount: 1850.0, day: 1, category: 'housing', paid: true },
    { id: 'b02', label: 'Netflix', amount: 15.49, day: 4, category: 'streaming', paid: true },
    { id: 'b03', label: 'Electric bill', amount: 128.6, day: 7, category: 'utilities', paid: true },
    { id: 'b04', label: 'Little Sprouts daycare', amount: 260.0, day: 8, category: 'childcare', paid: true },
    { id: 'b05', label: 'Spotify', amount: 11.99, day: 16, category: 'streaming', paid: true },
    { id: 'b06', label: 'Gym membership', amount: 65.0, day: 18, category: 'fitness', paid: true },
    { id: 'b07', label: 'Car insurance', amount: 205.0, day: 20, category: 'insurance', paid: true },
    { id: 'b08', label: 'Internet', amount: 79.99, day: 14, category: 'utilities', paid: true },
    { id: 'b09', label: 'Water bill', amount: 76.4, day: 22, category: 'utilities', paid: true },
    { id: 'b10', label: 'Phone plan (2 lines)', amount: 120.0, day: 28, category: 'utilities', paid: false },
    { id: 'b11', label: 'Little Sprouts daycare', amount: 260.0, day: 21, category: 'childcare', paid: true },
  ],

  goals: [
    { id: 'g01', label: 'Emergency fund', saved: 8000, target: 10000, note: '4 months of essentials' },
    { id: 'g02', label: 'Family vacation', saved: 1450, target: 2500, note: 'Beach trip next summer' },
    { id: 'g03', label: 'New car', saved: 3200, target: 12000, note: 'Replace the 2012 sedan' },
  ],

  // Six-month history for the Reports view (income vs spending, dollars).
  // November is the month in progress.
  history: [
    { month: 'Jun', income: 6850, spent: 4980 },
    { month: 'Jul', income: 6850, spent: 5240 },
    { month: 'Aug', income: 6850, spent: 4860 },
    { month: 'Sep', income: 6850, spent: 5410 },
    { month: 'Oct', income: 6850, spent: 4990 },
    { month: 'Nov', income: 6850, spent: 4177 },
  ],
};
