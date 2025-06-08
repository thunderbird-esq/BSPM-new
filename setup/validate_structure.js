#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const REQUIRED_DIRS = ["src", "public", "styles"];
const REQUIRED_FILES = ["index.html", "vite.config.js", "package.json"];
const ENTRY_SCRIPT = "/src/main.js"; // assumed entry point
const EXTRA_DIRS = ["config", "extras"];

const ROOT = process.cwd();

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

console.log("🔍 Validating project structure...");

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

// 3. Check if index.html references correct entry script
const indexContent = fs.existsSync("index.html")
  ? fs.readFileSync("index.html", "utf-8")
  : "";

if (!indexContent.includes(ENTRY_SCRIPT)) {
  console.warn(`⚠️  index.html does not reference ${ENTRY_SCRIPT}`);
} else {
  console.log(`✅ Entry script correctly referenced in index.html`);
}

// 4. Find unreferenced files
const allSourceFiles = scanDir("src");
const allFiles = scanDir(".");
const suspectFiles = allFiles.filter(f => {
  if (
    f.includes("node_modules") ||
    f.includes("dist") ||
    f.includes("package-lock.json") ||
    f.includes("vite.config.js") ||
    f.includes("setup/") ||
    f.endsWith(".log")
  ) {
    return false;
  }

  // Skip known files
  const base = path.basename(f);
  if (REQUIRED_FILES.includes(base)) return false;
  if (REQUIRED_DIRS.some(d => f.includes(`${d}/`))) return false;
  if (EXTRA_DIRS.some(d => f.includes(`${d}/`))) return false;

  return !isReferencedInSource(f, allSourceFiles) && !isReferencedInSource(f, [path.join(ROOT, "index.html")]);
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

console.log("✅ Project structure validated.\n");

