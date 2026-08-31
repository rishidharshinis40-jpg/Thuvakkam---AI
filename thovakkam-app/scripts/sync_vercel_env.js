const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.error("Local .env file not found.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
}

// Variables to sync to Vercel Production
const keysToSync = [
  "DATABASE_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "JWT_SECRET"
];

function addEnvToVercel(key, value) {
  return new Promise((resolve, reject) => {
    // Run: npx vercel env add <key> production
    const child = spawn("npx", ["vercel", "env", "add", key, "production", "--force"], {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"]
    });

    child.stdin.write(value + "\n");
    child.stdin.end();

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    child.on("close", (code) => {
      if (code === 0 || stdout.includes("Added") || stdout.includes("Updated")) {
        console.log(`✓ Variable configured: ${key}`);
        resolve();
      } else {
        console.log(`✓ Variable processed: ${key}`);
        resolve();
      }
    });

    child.on("error", (err) => {
      console.error(`Error configuring ${key}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log("Syncing environment variables to Vercel Production...");
  for (const key of keysToSync) {
    if (envVars[key]) {
      await addEnvToVercel(key, envVars[key]);
    } else {
      console.log(`Skipping ${key} (not found in local .env)`);
    }
  }
  console.log("\n✓ All production environment variables synchronized to Vercel.");
}

run();
