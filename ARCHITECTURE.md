# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                   React App                         │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │           App.tsx (Main Router)              │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                      │                              │    │
│  │         ┌────────────┴────────────┐                │    │
│  │         ▼                         ▼                │    │
│  │  ┌─────────────┐         ┌──────────────┐         │    │
│  │  │ GroupSetup  │         │  Dashboard   │         │    │
│  │  │   (Setup)   │         │   (Tabs)     │         │    │
│  │  └─────────────┘         └──────────────┘         │    │
│  │                                  │                 │    │
│  │                    ┌─────────────┴─────────────┐   │    │
│  │                    ▼                           ▼   │    │
│  │         ┌─────────────────┐         ┌────────────┐ │    │
│  │         │ TransactionList │         │  Balances  │ │    │
│  │         │   + Filters     │         │  Summary   │ │    │
│  │         └─────────────────┘         └────────────┘ │    │
│  │                    │                           │   │    │
│  │         ┌──────────┴──────────┐     ┌─────────┘   │    │
│  │         ▼                     ▼     ▼             │    │
│  │  ┌──────────────┐    ┌──────────────────────┐    │    │
│  │  │ Transaction  │    │  SettlementButton    │    │    │
│  │  │    Form      │    │     (Modal)          │    │    │
│  │  └──────────────┘    └──────────────────────┘    │    │
│  │                                                    │    │
│  └────────────────────────────────────────────────────┘    │
│                             │                               │
│                             ▼                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │           GroupContext (State Management)          │    │
│  │                                                     │    │
│  │  • createGroup()    • addTransaction()             │    │
│  │  • addMember()      • updateTransaction()          │    │
│  │  • removeMember()   • deleteTransaction()          │    │
│  │  • addSettlement()  • clearGroup()                 │    │
│  └────────────────────────────────────────────────────┘    │
│                             │                               │
│                             ▼                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Utility Modules                        │    │
│  │                                                     │    │
│  │  ┌────────────┐  ┌──────────────┐  ┌───────────┐  │    │
│  │  │  storage   │  │ calculations │  │ formatters│  │    │
│  │  │  .ts       │  │    .ts       │  │   .ts     │  │    │
│  │  └────────────┘  └──────────────┘  └───────────┘  │    │
│  │       │                  │                │        │    │
│  │       └──────────────────┴────────────────┘        │    │
│  │                          ▼                          │    │
│  └─────────────────────────────────────────────────────┘   │
│                             │                               │
│                             ▼                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │                 LocalStorage API                    │    │
│  │        (Browser's Built-in Persistence)             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Creating a Trip
```
User Input → GroupSetup → GroupContext.createGroup()
                              ↓
                         storage.saveGroup()
                              ↓
                         LocalStorage
```

### 2. Adding an Expense
```
User clicks + → TransactionForm opens
                     ↓
User fills form → Validation
                     ↓
Submit → GroupContext.addTransaction()
              ↓
         storage.saveGroup()
              ↓
         LocalStorage
              ↓
    TransactionList updates (React re-render)
```

### 3. Viewing Balances
```
BalanceSummary renders
         ↓
GroupContext.group
         ↓
calculations.calculateBalances()
         ↓
calculations.simplifyDebts()
         ↓
Display results
```

### 4. Marking Payment
```
User clicks "Mark as Paid" → SettlementButton modal
                                    ↓
                              User confirms
                                    ↓
                     GroupContext.addSettlement()
                                    ↓
                              storage.saveGroup()
                                    ↓
                              LocalStorage
                                    ↓
                     BalanceSummary updates
```

## Component Hierarchy

```
App
├── GroupSetup (conditional - if no group)
│   └── Form with member inputs
│
└── Dashboard (conditional - if group exists)
    ├── Header
    │   ├── Trip name & member count
    │   ├── Export CSV button
    │   └── New Trip button
    │
    ├── Tabs (Transactions | Balances)
    │
    ├── TransactionList (if Transactions tab)
    │   ├── Filters (Category, Member)
    │   ├── Summary (count, total)
    │   └── Transaction cards
    │       ├── Details (description, category, date)
    │       ├── Payer info
    │       ├── Split breakdown
    │       └── Edit/Delete buttons
    │
    ├── BalanceSummary (if Balances tab)
    │   ├── Total expenses card
    │   ├── Member breakdown
    │   │   └── Per-member: spent, owed, balance
    │   ├── Simplified debts list
    │   │   └── Payment cards with "Mark as Paid"
    │   └── Settlement history
    │
    ├── TransactionForm (modal - conditional)
    │   ├── Amount input
    │   ├── Description input
    │   ├── Category & Date selectors
    │   ├── Payer selector
    │   ├── Member checkboxes
    │   ├── Split mode toggle
    │   └── Custom split inputs (if custom mode)
    │
    ├── SettlementButton (modal - conditional)
    │   ├── Payment details
    │   ├── Note input
    │   └── Confirm button
    │
    └── Floating Action Button (+ to add expense)
```

## State Management

### GroupContext State
```typescript
{
  group: Group | null
  //    ↓
  {
    id: string
    name: string
    currency: string
    members: Member[]
    transactions: Transaction[]
    settlements: Settlement[]
    createdAt: string
  }
}
```

### State Updates
- All updates go through GroupContext methods
- GroupContext automatically saves to LocalStorage
- React re-renders components when state changes
- No external state library needed (React Context is sufficient)

## Key Algorithms

### Balance Calculation
```
For each member:
  balance = 0

For each transaction:
  payer.balance -= transaction.amount
  for each split:
    split.member.balance += split.amount

For each settlement:
  from.balance -= settlement.amount
  to.balance += settlement.amount

Return balances
```

### Debt Simplification (Greedy)
```
creditors = members with balance < 0 (owed money)
debtors = members with balance > 0 (owe money)

sort creditors by amount descending
sort debtors by amount descending

payments = []
i = 0, j = 0

while i < creditors.length && j < debtors.length:
  amount = min(creditors[i].amount, debtors[j].amount)
  payments.add(debtors[j] → creditors[i]: amount)

  creditors[i].amount -= amount
  debtors[j].amount -= amount

  if creditors[i].amount == 0: i++
  if debtors[j].amount == 0: j++

return payments
```

## Technology Stack

```
┌─────────────────────────────────────┐
│         Build Time                   │
├─────────────────────────────────────┤
│ TypeScript    Type safety            │
│ Vite          Build tool             │
│ PostCSS       CSS processing         │
│ Tailwind      Utility CSS            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Runtime                      │
├─────────────────────────────────────┤
│ React 18      UI framework           │
│ LocalStorage  Data persistence       │
│ Browser APIs  Date, Intl, etc.       │
└─────────────────────────────────────┘
```

## File Organization

```
src/
├── components/          # React components (UI)
│   ├── GroupSetup.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── BalanceSummary.tsx
│   └── SettlementButton.tsx
│
├── context/            # State management
│   └── GroupContext.tsx
│
├── utils/              # Business logic
│   ├── storage.ts         # LocalStorage I/O
│   ├── calculations.ts    # Balance algorithms
│   └── formatters.ts      # Helper functions
│
├── types/              # TypeScript definitions
│   └── index.ts
│
├── App.tsx             # Main app & routing
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## Security Model

```
┌──────────────────────────────────────┐
│         No Backend                    │
├──────────────────────────────────────┤
│ ✓ No server to hack                  │
│ ✓ No database to breach               │
│ ✓ No API keys to steal                │
│ ✓ No authentication vulnerabilities   │
│ ✓ All data stays in user's browser    │
└──────────────────────────────────────┘
```

## Performance Characteristics

- **Initial Load**: ~56 KB (very fast)
- **Rendering**: O(n) where n = number of transactions
- **Balance Calculation**: O(n) where n = number of transactions
- **Debt Simplification**: O(n log n) where n = number of members
- **Storage**: O(1) read/write to LocalStorage

## Scalability

**Limits:**
- LocalStorage: ~5-10 MB per domain (browser dependent)
- Practical limit: ~1000 transactions before UI slows down
- Recommended: Reset data after each trip

**For typical usage** (vacation with 10 people, 100 transactions):
- Data size: ~50 KB
- Performance: Instant
- No issues

## Browser Compatibility

Requires:
- ES2020 support
- LocalStorage API
- Intl.NumberFormat (currency)
- Date API
- CSS Grid/Flexbox

Supported:
- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ iOS Safari 14+
- ✓ Android Chrome

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         CDN / Static Host            │
│      (Vercel, Netlify, etc.)         │
├─────────────────────────────────────┤
│  • index.html                        │
│  • index-[hash].js                   │
│  • index-[hash].css                  │
└─────────────────────────────────────┘
              ↓
        User's Browser
              ↓
     LocalStorage (data)
```

No backend servers needed! Just serve static files from a CDN.

---

This architecture keeps the app:
- **Simple**: No complex backend
- **Fast**: Everything runs locally
- **Private**: Data never leaves the browser
- **Cheap**: Static hosting is free/cheap
- **Reliable**: No server downtime
- **Scalable**: CDN handles any traffic
