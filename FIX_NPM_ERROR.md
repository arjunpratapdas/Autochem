# 🔧 Fix npm run dev:all Error

## 🎯 The Problem

```
zsh: command not found: nom
sh: 1: concurrently: not found
```

**Causes:**
1. Dependencies not installed
2. `concurrently` package missing
3. Corrupted node_modules

---

## ✅ Solution

### **Option 1: Quick Fix (Recommended)**

```bash
# 1. Clean everything
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. Reinstall
npm install

# 3. Run
npm run dev:all
```

### **Option 2: Run Servers Separately**

**Terminal 1:**
```bash
npm run server
```

**Terminal 2 (new terminal):**
```bash
npm run dev
```

### **Option 3: Install concurrently Globally**

```bash
npm install -g concurrently
npm run dev:all
```

---

## 🔍 Verify Installation

### Check if concurrently is installed:
```bash
npm list concurrently
```

Should show:
```
autochem@0.0.0
└── concurrently@8.2.2
```

### Check if all dependencies are installed:
```bash
npm list
```

Should show all packages without errors.

---

## 📝 What Each Command Does

| Command | Purpose |
|---------|---------|
| `npm cache clean --force` | Clears npm cache |
| `rm -rf node_modules` | Removes installed packages |
| `rm -rf package-lock.json` | Removes lock file |
| `npm install` | Installs all dependencies |
| `npm run server` | Starts backend on port 5000 |
| `npm run dev` | Starts frontend on port 3000 |
| `npm run dev:all` | Runs both together |

---

## 🚀 After Installation

Once `npm install` completes successfully:

```bash
npm run dev:all
```

You should see:
```
✓ Auth Server Running
http://localhost:3000
```

---

## ✅ Verification Checklist

- [ ] `npm cache clean --force` completed
- [ ] `node_modules` deleted
- [ ] `package-lock.json` deleted
- [ ] `npm install` completed without errors
- [ ] `npm list concurrently` shows version
- [ ] `npm run dev:all` starts both servers

---

## 🎉 If It Works

1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Fill in form
4. Click "Sign Up"
5. **Should work!** ✅

---

## 🆘 If Still Not Working

### Check Node.js version:
```bash
node --version
npm --version
```

Should be:
- Node.js: v18 or higher
- npm: v9 or higher

### If versions are old, update:
```bash
# Using Homebrew (macOS)
brew upgrade node

# Or download from https://nodejs.org
```

### Try with yarn instead:
```bash
npm install -g yarn
yarn install
yarn dev:all
```

---

## 📊 Troubleshooting

### "npm: command not found"
- Node.js not installed
- Install from https://nodejs.org

### "concurrently: not found"
- Run: `npm install`
- Or: `npm install -g concurrently`

### "Port 3000 already in use"
- Kill process: `lsof -i :3000` then `kill -9 <PID>`
- Or use different port: `PORT=3001 npm run dev`

### "Port 5000 already in use"
- Kill process: `lsof -i :5000` then `kill -9 <PID>`
- Or edit server.ts to use different port

---

## 🎯 Quick Commands

```bash
# Full clean install
npm cache clean --force && rm -rf node_modules package-lock.json && npm install && npm run dev:all

# Just reinstall
npm install && npm run dev:all

# Run separately
npm run server &
npm run dev
```

---

**Status**: ✅ READY TO FIX

Follow the steps above and your app will run!

🧪 **Let's go!**
