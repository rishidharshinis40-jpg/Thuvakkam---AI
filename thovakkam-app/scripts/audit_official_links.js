const { PrismaClient } = require("@prisma/client");
const https = require("https");
const http = require("http");
const { URL } = require("url");

const prisma = new PrismaClient();

function checkUrlReachable(urlStr) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(urlStr);
      const isHttps = parsedUrl.protocol === "https:";
      const client = isHttps ? https : http;

      const req = client.request(
        urlStr,
        {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          timeout: 8000,
          rejectUnauthorized: false
        },
        (res) => {
          const statusCode = res.statusCode || 0;
          const location = res.headers.location;
          resolve({
            status: statusCode,
            location: location,
            ok: statusCode >= 200 && statusCode < 400
          });
        }
      );

      req.on("error", (err) => {
        resolve({ status: 0, error: err.message, ok: false });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ status: 0, error: "TIMEOUT", ok: false });
      });

      req.end();
    } catch (e) {
      resolve({ status: 0, error: e.message, ok: false });
    }
  });
}

async function runAudit() {
  console.log("=================================================");
  console.log("THUVAKKAM AI - COMPREHENSIVE OFFICIAL LINK AUDIT");
  console.log("=================================================\n");

  const schemes = await prisma.scheme.findMany({
    orderBy: { createdAt: "asc" }
  });

  console.log(`Total Schemes in Database: ${schemes.length}\n`);

  const results = [];

  for (let i = 0; i < schemes.length; i++) {
    const s = schemes[i];
    const rawLink = s.officialLink;
    let normalizedLink = rawLink ? rawLink.trim() : null;

    if (normalizedLink && !normalizedLink.startsWith("http://") && !normalizedLink.startsWith("https://")) {
      normalizedLink = "https://" + normalizedLink;
    }

    const check = normalizedLink ? await checkUrlReachable(normalizedLink) : { status: 0, ok: false, error: "NO_LINK" };

    results.push({
      id: s.id,
      index: i + 1,
      name: s.name,
      department: s.department,
      category: s.category,
      rawLink: s.officialLink,
      normalizedLink,
      check
    });

    const statusStr = check.ok ? `[${check.status}]` : `[ERR: ${check.status || check.error}]`;
    console.log(`${i + 1}. ${statusStr} ${s.name.slice(0, 45)}... -> ${s.officialLink}`);
    if (check.location) {
      console.log(`   └─> Redirects to: ${check.location}`);
    }
  }

  console.log("\n================ AUDIT SUMMARY ================");
  const missing = results.filter(r => !r.rawLink);
  const valid200 = results.filter(r => r.check.status >= 200 && r.check.status < 300);
  const redirects = results.filter(r => r.check.status >= 300 && r.check.status < 400);
  const errors = results.filter(r => !r.check.ok && r.rawLink);

  console.log(`Total Schemes Checked:      ${results.length}`);
  console.log(`Direct 200 OK:              ${valid200.length}`);
  console.log(`Redirects (301/302):        ${redirects.length}`);
  console.log(`Errors / Unreachable / 404: ${errors.length}`);
  console.log(`Missing Links:              ${missing.length}`);

  console.log("\n--- DETAILED LIST OF PROBLEM / OUTDATED LINKS ---");
  errors.forEach(e => {
    console.log(`\nID: ${e.id}`);
    console.log(`Scheme: ${e.name}`);
    console.log(`Department: ${e.department}`);
    console.log(`Link: ${e.rawLink}`);
    console.log(`Issue: Status ${e.check.status} (${e.check.error || "Failed/Forbidden/404"})`);
  });

  await prisma.$disconnect();
}

runAudit().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
