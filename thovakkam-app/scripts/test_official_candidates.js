const https = require("https");
const http = require("http");
const { URL } = require("url");

const candidateUrls = [
  "https://tnsocialwelfare.tn.gov.in",
  "https://pudhumaipenn.tn.gov.in",
  "https://penkalvi.tn.gov.in",
  "https://picme.tn.gov.in",
  "https://tahdco.com",
  "https://adw.tn.gov.in",
  "https://mathi.tn.gov.in",
  "https://tnrdd.tn.gov.in",
  "https://tnesevai.tn.gov.in",
  "https://edistricts.tn.gov.in",
  "https://revenue.tn.gov.in",
  "https://tnagrisnet.tn.gov.in",
  "https://ahd.tn.gov.in",
  "https://handloom.tn.gov.in",
  "https://aavin.tn.gov.in",
  "https://tnschools.gov.in",
  "https://scw.tn.gov.in",
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
  "https://tnpds.gov.in",
  "https://tnstc.in",
  "https://www.tn.gov.in",
  "https://tneaonline.org",
  "https://pmkisan.gov.in",
  "https://pmfby.gov.in",
  "https://www.msmeonline.tn.gov.in",
  "https://kviconline.gov.in",
  "https://civilservicecoaching.tn.gov.in"
];

function checkUrl(urlStr) {
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
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          timeout: 8000,
          rejectUnauthorized: false
        },
        (res) => {
          resolve({ url: urlStr, status: res.statusCode, location: res.headers.location, ok: res.statusCode >= 200 && res.statusCode < 400 });
        }
      );

      req.on("error", (err) => resolve({ url: urlStr, status: 0, error: err.message, ok: false }));
      req.on("timeout", () => { req.destroy(); resolve({ url: urlStr, status: 0, error: "TIMEOUT", ok: false }); });
      req.end();
    } catch (e) {
      resolve({ url: urlStr, status: 0, error: e.message, ok: false });
    }
  });
}

async function testAll() {
  console.log("Testing Candidate Official Government Portals...\n");
  for (const u of candidateUrls) {
    const res = await checkUrl(u);
    console.log(`${res.ok ? "✓ [OK " + res.status + "]" : "✗ [ERR " + (res.status || res.error) + "]"} ${res.url} ${res.location ? "-> " + res.location : ""}`);
  }
}

testAll();
