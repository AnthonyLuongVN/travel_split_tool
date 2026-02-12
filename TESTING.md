# Testing Guide

## Manual Test Scenarios

### Scenario 1: Basic Flow (5 minutes)

**Goal**: Verify core functionality works end-to-end

1. **Create a group**
   - Open app in browser
   - Enter trip name: "Bali Trip"
   - Select currency: USD
   - Add 3 members: You, Alice, Bob
   - ✓ Verify group is created and dashboard appears

2. **Add first expense**
   - Click "+" button
   - Amount: 90
   - Description: "Dinner at restaurant"
   - Category: Food
   - Payer: You
   - Select all 3 members
   - Choose "Equal Split"
   - ✓ Verify transaction appears in list
   - ✓ Expected: Alice owes $30, Bob owes $30

3. **Add second expense**
   - Amount: 60
   - Description: "Taxi to hotel"
   - Payer: You
   - Select only Alice
   - ✓ Expected: Alice now owes $60 total, Bob still owes $30

4. **Add third expense**
   - Amount: 45
   - Description: "Museum tickets"
   - Payer: Alice
   - Select all 3 members (equal split = $15 each)
   - ✓ Expected: Alice owes $45, Bob owes $45, You owe $15

5. **Check balances**
   - Switch to "Balances" tab
   - ✓ Verify simplified debts show correctly
   - ✓ Expected: Bob pays you, Alice pays you (amounts calculated correctly)

6. **Mark settlement**
   - Click "Mark as Paid" on one debt
   - Add optional note
   - Confirm payment
   - ✓ Verify balance updates immediately
   - ✓ Verify payment appears in history

7. **Persistence test**
   - Refresh the page
   - ✓ Verify all data is still there (LocalStorage working)

### Scenario 2: Custom Splits

1. Add expense with custom amounts
   - Amount: 100
   - Select 3 members
   - Choose "Custom Amounts"
   - Alice: 50, Bob: 30, You: 20
   - ✓ Verify splits sum to 100
   - ✓ Try invalid split (90 total) - should show error

### Scenario 3: Edge Cases

1. **Single member split**
   - Create expense
   - Select only 1 member
   - ✓ Should work - that member owes full amount

2. **Zero balance member**
   - Member who hasn't participated in any transaction
   - ✓ Should show $0 balance

3. **Already settled**
   - When all debts are paid
   - ✓ Should show "All settled up!" message

4. **Delete transaction**
   - Delete a transaction
   - ✓ Balances should recalculate correctly

5. **Edit transaction**
   - Edit amount or splits
   - ✓ Balances should update

### Scenario 4: Filters

1. **Category filter**
   - Add transactions in different categories
   - Filter by category
   - ✓ Only matching transactions appear

2. **Member filter**
   - Filter by specific member
   - ✓ Only transactions involving that member appear

### Scenario 5: Export

1. **CSV Export**
   - Click "Export CSV"
   - ✓ File downloads
   - ✓ Open in Excel/Sheets
   - ✓ Verify data is correct and complete

### Scenario 6: Mobile

1. **Responsive design**
   - Open on phone
   - ✓ Layout adapts to screen size
   - ✓ All buttons are tappable (min 44px)
   - ✓ Number keyboard appears for amount inputs
   - ✓ Forms are usable

2. **Portrait/Landscape**
   - Rotate device
   - ✓ Layout works in both orientations

### Scenario 7: Data Management

1. **New trip**
   - Click "New Trip"
   - ✓ Confirm dialog appears
   - ✓ After confirm, all data is cleared
   - ✓ Returns to setup screen

## Calculation Verification

### Test Case 1: Simple Equal Split
- Transaction: $90, 3 people, equal split
- Expected: Each person owes $30
- ✓ Verify amounts are correct

### Test Case 2: Custom Split
- Transaction: $100
- Alice: $50, Bob: $30, Charlie: $20
- Expected: Exact amounts owed
- ✓ No rounding errors

### Test Case 3: Multiple Payers
- You pay $100, split 4 ways ($25 each)
- Alice pays $80, split 4 ways ($20 each)
- Expected balances:
  - You: owed $75 (paid $100, owe $45)
  - Alice: owed $55 (paid $80, owe $25)
  - Bob: owes $45 (paid $0, owe $45)
  - Charlie: owes $45 (paid $0, owe $45)
- ✓ Verify simplified debts minimize transactions

### Test Case 4: Debt Simplification
- 4 people: A, B, C, D
- A is owed $100
- B owes $50, C owes $30, D owes $20
- Expected simplified: 3 payments (B→A $50, C→A $30, D→A $20)
- ✓ Algorithm finds minimum transactions

### Test Case 5: Settlements
- Initial: Alice owes $50
- Settlement: Alice pays $50
- Expected: Alice balance = $0
- ✓ Verify settlement reduces debt correctly

## Browser Compatibility

Test in these browsers:

- ✓ Chrome (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)
- ✓ iOS Safari
- ✓ Android Chrome
- ✓ Samsung Internet

## Performance Tests

1. **Large dataset**
   - Add 100+ transactions
   - ✓ App remains responsive
   - ✓ Calculations complete quickly
   - ✓ List scrolls smoothly

2. **LocalStorage limits**
   - ✓ Verify data saves correctly
   - ✓ Check console for errors

## Accessibility

1. **Keyboard navigation**
   - ✓ Can navigate with Tab
   - ✓ Can submit forms with Enter
   - ✓ Focus indicators visible

2. **Screen reader**
   - ✓ Form labels are read correctly
   - ✓ Buttons have descriptive text

## Error Handling

1. **Invalid inputs**
   - ✓ Empty amount - shows error
   - ✓ Negative amount - shows error
   - ✓ Invalid split total - shows error
   - ✓ No members selected - shows error

2. **Edge cases**
   - ✓ Very large amounts (millions)
   - ✓ Very small amounts (cents)
   - ✓ Many decimal places

## Regression Tests

After any code changes, re-run:
- ✓ Scenario 1 (Basic Flow)
- ✓ Calculation Verification tests
- ✓ Build succeeds (`npm run build`)
- ✓ No TypeScript errors (`tsc --noEmit`)

## Automated Testing (Future)

Consider adding:
- Unit tests (Vitest) for calculations.ts
- Component tests (React Testing Library)
- E2E tests (Playwright)

## Issues to Watch For

Common bugs to check for:
- ✓ Rounding errors in currency calculations
- ✓ Floating point precision issues
- ✓ Race conditions in state updates
- ✓ LocalStorage quota exceeded
- ✓ Memory leaks with large datasets
- ✓ Incorrect date parsing across timezones

## Sign-Off Checklist

Before considering the app production-ready:

- [ ] All Scenario 1-7 tests pass
- [ ] All Calculation Verification tests pass
- [ ] Tested on mobile device
- [ ] Tested on all major browsers
- [ ] Build succeeds without errors
- [ ] No console errors in production build
- [ ] Export functionality works
- [ ] Data persists after refresh
- [ ] New trip clears data correctly
- [ ] README is accurate
- [ ] Deployment guide tested

## Next Steps

If all tests pass, the app is ready to deploy! 🎉
