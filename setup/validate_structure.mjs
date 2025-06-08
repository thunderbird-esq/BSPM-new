#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🧭 Resolve current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_DIRS = ["src", "public", "styles"];
const REQUIRED_FILES = ["index.html", "vite.config.js", "package.json"];
const ENTRY_SCRIPT = "/src/main.js";
const EXTRA_DIRS = ["config", "extras"];
const ROOT = path.resolve(__dirname, "..");

const checkExists = (target, type = "file") => {
  const full = path.join(ROOT, target);
  if (type === "file") return fs.existsSync(full) && fs.lstatSync(full).isFile();
  if (type === "dir") return fs.existsSync(full) && fs.lstatSync(full).isDirectory();
  return false;
};

const scanDir = (dirPath, allFiles = []) => {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      scanDir(fullPath, allFiles);
    } else {
      allFiles.push(fullPath);
    }
  });
  return allFiles;
};

const isReferencedInSource = (filePath, sourceFiles) => {
  const fileName = path.basename(filePath);
  return sourceFiles.some(src =>
    fs.readFileSync(src, "utf-8").includes(fileName)
  );
};

console.log("🔍 Validating project structure...\n");

// 1. Check required directories
REQUIRED_DIRS.forEach(dir => {
  if (!checkExists(dir, "dir")) {
    console.warn(`⚠️  Missing required directory: ${dir}`);
  }
});

// 2. Check required files
REQUIRED_FILES.forEach(file => {
  if (!checkExists(file, "file")) {
    console.warn(`⚠️  Missing required file: ${file}`);
  }
});

// 3. Check entry script in index.html
const indexPath = path.join(ROOT, "index.html");
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, "utf-8");
  if (!indexContent.includes(ENTRY_SCRIPT)) {
    console.warn(`⚠️  index.html does NOT reference ${ENTRY_SCRIPT}`);
  } else {
    console.log(`✅ Entry script correctly referenced in index.html`);
  }
}

// 4. Detect unreferenced files
const allSourceFiles = scanDir(path.join(ROOT, "src"));
const allFiles = scanDir(ROOT);
const suspectFiles = allFiles.filter(f => {
  if (
    f.includes("node_modules") ||
    f.includes("dist") ||
    f.includes("package-lock.json") ||
    f.includes("vite.config.js") ||
    f.includes("/setup/") ||
    f.endsWith(".log")
  ) return false;

  const rel = path.relative(ROOT, f);
  if (REQUIRED_FILES.includes(path.basename(f))) return false;
  if (REQUIRED_DIRS.some(d => rel.startsWith(d))) return false;
  if (EXTRA_DIRS.some(d => rel.startsWith(d))) return false;

  return !isReferencedInSource(f, allSourceFiles) &&
         !isReferencedInSource(f, [indexPath]);
});

if (suspectFiles.length) {
  console.warn("\n🧹 Unreferenced or unused files:");
  suspectFiles.forEach(f => console.warn(`  - ${path.relative(ROOT, f)}`));
  if (process.argv.includes("--clean")) {
    suspectFiles.forEach(f => fs.unlinkSync(f));
    console.log(`\n🧼 Deleted ${suspectFiles.length} unused files.`);
  }
} else {
  console.log("✅ No unreferenced files found.");
}

console.log("\n✅ Project structure validated.\n");

