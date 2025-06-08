#!/bin/bash

echo "🚧 [TBESQ] Beginning project structure cleanup..."

# Create extras/ for unused files
mkdir -p extras

# Move legacy/demo/test HTML files
for FILE in index2.html splash.html; do
  if [ -f "$FILE" ]; then
    echo "📦 Moving $FILE → extras/"
    mv "$FILE" extras/
  fi
done

# Remove barry_head.png from root if it's duplicated in src/images
if [ -f "barry_head.png" ] && [ -f "src/images/barry_head.png" ]; then
  echo "🗑️  Removing duplicate barry_head.png from root"
  rm barry_head.png
fi

# Move auxiliary Vite config files to config/
mkdir -p config
for FILE in vite.demo.config.js vite.lib.config.js vite.lib.full.config.js; do
  if [ -f "$FILE" ]; then
    echo "📂 Archiving $FILE → config/"
    mv "$FILE" config/
  fi
done

# Confirm expected structure
echo "📁 Verifying core directories..."
for DIR in public src styles; do
  if [ ! -d "$DIR" ]; then
    echo "⚠️  Missing $DIR/ — creating empty scaffold"
    mkdir -p "$DIR"
  fi
done

# Check index.html script path
if grep -q 'src=".*main.js' index.html; then
  echo "✅ index.html references main.js correctly"
else
  echo "⚠️  index.html does NOT reference /src/main.js — please update manually"
fi

# Optional: install tree if not present and show final layout
if ! command -v tree &> /dev/null; then
  echo "📦 Installing 'tree' via Homebrew..."
  brew install tree
fi

echo "📂 Final project layout:"
tree -L 2

# Git stage and commit
echo "📬 Staging cleaned structure..."
git add .
git commit -m "Clean structure: relocate legacy files, standardize Vite layout"
echo "✅ Commit ready. Review with 'git diff --cached' if needed."

echo "🎉 Structure cleanup complete."

