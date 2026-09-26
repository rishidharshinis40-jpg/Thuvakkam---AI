const https = require("https");
const http = require("http");
const { URL } = require("url");

const testUrls = [
  "https://tnsocialwelfare.tn.gov.in",
  "https://tnesevai.tn.gov.in",
  "https://edistricts.tn.gov.in",
  "https://tahdco.com",
  "https://tnagrisnet.tn.gov.in",
  "https://ahd.tn.gov.in",
  "https://aavin.tn.gov.in",
  "https://tnschools.gov.in",
  "https://bcmbcmw.tn.gov.in",
  "https://scholarships.gov.in",
  "https://www.cmchistn.com",
  "https://kmut.tn.gov.in",
  "https://tamilpudhalvan.tn.gov.in",
  "https://naanmudhalvan.tn.gov.in",
  "https://thozhi.tn.gov.in",
  "https://aed.tn.gov.in",
  "https://tnhorticulture.tn.gov.in",
  "https://fisheries.tn.gov.in",
  "https://tnuwwb.tn.gov.in",
  "https://tabcedco.tn.gov.in",
  "https://nhm.tn.gov.in",
  "https://www.tnpds.gov.in",
  "https://www.tnstc.in",
  "https://www.tn.gov.in",
  "https://www.tneaonline.org",
  "https://pmkisan.gov.in",
  "https://pmfby.gov.in",
  "https://www.msmeonline.tn.gov.in",
  "https://www.kviconline.gov.in/pmegpeportal",
  "https://aicscc.tn.gov.in"
];

function check(u) {
  return new Promise(resolve => {
    try {
      const parsed = new URL(u);
      const mod = parsed.protocol === "https:" ? https : http;
      const req = mod.request(u, {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 6000,
        rejectUnauthorized: false
      }, res => {
        resolve({ u, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      });
      req.on("error", e => resolve({ u, error: e.message, ok: false }));
      req.on("timeout", () => { req.destroy(); resolve({ u, error: "TIMEOUT", ok: false }); });
      req.end();
    } catch(e) {
      resolve({ u, error: e.message, ok: false });
    }
  });
}

Promise.all(testUrls.map(check)).then(results => {
  results.forEach(r => {
    console.log(`${r.ok ? "✓ [OK " + r.status + "]" : "✗ [ERR " + (r.status || r.error) + "]"} ${r.u}`);
  });
});
