# Vacation Expense Tracker & Bill Splitter

A simple, frontend-only web application to track vacation expenses and split bills among your group. All data is stored locally in your browser using LocalStorage - no backend required!

## Features

- **Track Expenses**: Document all transactions with amount, description, category, and date
- **Flexible Splitting**: Support for both equal splits and custom amounts per member
- **Smart Calculations**: Automatically calculates who owes what using debt simplification algorithm
- **Mark Payments**: Track when members pay you back
- **Export Data**: Download your expenses as CSV
- **Mobile Friendly**: Responsive design works great on phones
- **100% Private**: All data stays in your browser - no server, no signup

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## How to Use

### 1. Create a Trip
- Enter trip name (e.g., "Bali Adventure 2024")
- Select currency
- Add group members (at least 2)
- Click "Create Trip"

### 2. Add Expenses
- Click the "+" button
- Enter amount and description
- Select category and date
- Choose who paid
- Select members to split with
- Choose equal or custom split
- Click "Add Expense"

### 3. Check Balances
- Switch to "Balances" tab
- See who owes what
- View simplified payment plan
- Click "Mark as Paid" when someone pays you back

### 4. Export Data
- Click "Export CSV" to download all transactions
- Open in Excel or Google Sheets for further analysis

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

## Project Structure

```
src/
├── components/           # React components
│   ├── GroupSetup.tsx   # Initial group creation
│   ├── TransactionForm.tsx    # Add/edit expenses
│   ├── TransactionList.tsx    # Display all transactions
│   ├── BalanceSummary.tsx     # Show who owes what
│   ├── SettlementButton.tsx   # Mark payments as complete
│   └── PivotTable.tsx         # Matrix view: spending per transaction per member
├── utils/
│   ├── storage.ts       # LocalStorage helpers
│   ├── calculations.ts  # Balance and debt simplification
│   └── formatters.ts    # Currency, date formatting
├── types/
│   └── index.ts         # TypeScript interfaces
├── context/
│   └── GroupContext.tsx # React Context for state
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Tailwind imports
```

## Key Algorithms

### Balance Calculation
For each member:
- Total paid = sum of all transactions they paid for
- Total owed = sum of all their split amounts
- Balance = total owed - total paid
  - Negative balance = they're owed money (creditor)
  - Positive balance = they owe money (debtor)

### Debt Simplification
Uses a greedy algorithm to minimize the number of payments:
1. Separate members into creditors and debtors
2. Sort both by amount (largest first)
3. Match largest creditor with largest debtor
4. Create payment for minimum of their amounts
5. Repeat until all debts settled

**Example**: If Alice is owed $70, Bob owes $40, Charlie owes $30:
- Result: Bob pays Alice $40, Charlie pays Alice $30 (2 payments instead of potentially more)

## Browser Compatibility

Works in all modern browsers that support:
- ES2020
- LocalStorage
- CSS Grid/Flexbox

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari
- Android Chrome

## Data Storage

All data is stored in browser LocalStorage under the key `vacation-expense-tracker-group`.

To clear all data:
1. Click "New Trip" button, or
2. Open browser DevTools → Application → LocalStorage → Clear

## Deployment

**Live app**: https://trpbudget.vercel.app

The app is a static site and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Just run `npm run build` and deploy the `dist` folder.

## Future Enhancements

Potential features for future versions:
- Receipt photo upload
- Export to PDF
- Multiple currencies
- Offline support (PWA)
- Data backup/restore
- Shareable links (would need backend)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
