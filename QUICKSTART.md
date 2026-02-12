# Quick Start Guide

Get the Vacation Expense Tracker running in 2 minutes!

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

## Step 2: Start the App (5 seconds)

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 3: Use the App (1 minute)

### First Time Setup
1. Enter a trip name (e.g., "Bali 2024")
2. Select your currency
3. Add group members (at least 2)
4. Click "Create Trip"

### Add an Expense
1. Click the blue "+" button
2. Enter the amount
3. Add a description
4. Select who paid
5. Check which members to split with
6. Click "Add Expense"

### Check Balances
1. Click the "Balances" tab
2. See who owes what
3. When someone pays you back, click "Mark as Paid"

That's it! 🎉

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Tips

- All data saves automatically in your browser
- Refresh the page - your data persists!
- Use the "Export CSV" button to backup your data
- Click "New Trip" to start fresh

## Example Usage

**Trip to Bali with 3 friends:**
1. You pay $120 for dinner, split 4 ways → Everyone owes $30
2. Alice pays $80 for taxi, split 4 ways → Everyone owes $20
3. Bob pays $60 for tickets, split 4 ways → Everyone owes $15

**Result**: App shows exactly who needs to pay who and how much!

## Need Help?

- Read the full [README.md](README.md) for detailed documentation
- Check [TESTING.md](TESTING.md) for example scenarios
- See [DEPLOYMENT.md](DEPLOYMENT.md) to deploy online

## Deploy It (Optional)

Want to use it from your phone?

### Vercel (easiest)
```bash
npm i -g vercel
npm run build
vercel --prod
```

### Netlify
Drag and drop the `dist` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

Now you have a live URL to access from anywhere! 📱

---

**That's all you need to know to get started!** The app is designed to be intuitive - just start using it and it will make sense.

Happy tracking! ✈️
