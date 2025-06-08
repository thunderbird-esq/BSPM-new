#!/bin/bash

echo "🚀 [TBESQ] Bootstrapping BSPM Vite Deployment..."

# Step 1: Validate structure
echo "🔍 Running structure validation..."
node ./setup/validate_structure.mjs --clean

# Step 2: Ensure vite.config.js
if [ ! -f vite.config.js ]; then
  echo "⚙️  Creating vite.config.js..."
  cat <<EOF > vite.config.js
import { defineConfig } from 'vite'
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
EOF
else
  echo "✅ vite.config.js exists."
fi

# Step 3: Patch index.html for main.js if needed
if ! grep -q "src/main.js" index.html; then
  echo "⚙️  Injecting <script src='/src/main.js'> into index.html..."
  sed -i '' '/<\/body>/i\
  <script type="module" src="/src/main.js"></script>
  ' index.html
else
  echo "✅ index.html already includes main.js"
fi

# Step 4: Ensure .gitignore
[[ ! -f .gitignore ]] && echo -e "node_modules\ndist\n.DS_Store\nsetup/*.swp" > .gitignore

# Step 5: Install deps
echo "📦 Reinstalling npm modules..."
rm -rf node_modules package-lock.json
npm install

# Step 6: Git setup check
if [ ! -d .git ]; then
  echo "🔁 Initializing Git repo..."
  git init
  git branch -M main
  git remote add origin git@github.com:thunderbird-esq/BSPM-new.git
else
  echo "✅ Git is already initialized."
fi

# Step 7: Build with Vite
echo "🔨 Building with Vite..."
npm run build

# Step 8: Deploy only if dist/ is newer
if [ -d dist ]; then
  echo "📤 Deploying to gh-pages..."
  npx gh-pages -d dist --branch gh-pages --repo git@github.com:thunderbird-esq/BSPM-new.git
  echo "🎉 Live"
fi

