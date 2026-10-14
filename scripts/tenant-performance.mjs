import puppeteer from "puppeteer";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
const base = process.env.QA_BASE || "http://127.0.0.1:3121";
const out = process.env.QA_OUT || "../output/tenant-rep-client-journey/local";
const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].filter(Boolean).find(existsSync);
const browser = await puppeteer.launch({ pipe: true, headless: true, ...(executablePath ? { executablePath } : {}), args: ["--no-sandbox"] });
const rows = [];
try {
  for (const route of ["/tenant-rep", "/lease-checklist"]) {
    for (let run = 1; run <= 3; run++) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 390, height: 844 });
      await page.setCacheEnabled(false);
      await page.evaluateOnNewDocument(() => {
        window.__yosLcp = 0;
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) window.__yosLcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        sessionStorage.setItem("yos-service-guide-dismissed", "1");
      });
      const session = await page.createCDPSession();
      await session.send("Network.enable");
      await session.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
      await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await page.setRequestInterception(true);
      page.on("request", request => request.method() === "POST" || /google-analytics|googletagmanager|hs-analytics/.test(request.url()) ? request.abort() : request.continue());
      await page.goto(base + route, { waitUntil: "networkidle0", timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      rows.push({ route, run, ...await page.evaluate(() => ({ lcpMs: Math.round(window.__yosLcp), domContentLoadedMs: Math.round(performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd), initialScriptBytes: performance.getEntriesByType("resource").filter(entry => entry.initiatorType === "script").reduce((sum, entry) => sum + entry.transferSize, 0) })) });
      await context.close();
    }
  }
  const medianByRoute = Object.fromEntries(["/tenant-rep", "/lease-checklist"].map(route => [route, rows.filter(row => row.route === route).map(row => row.lcpMs).sort((a, b) => a - b)[1]]));
  mkdirSync(out, { recursive: true });
  const result = { environment: "Local production build; 390px; cold browser contexts; 1.6Mbps down, 150ms latency, 4x CPU slowdown. Simulation, not field performance.", medianLcpMs: medianByRoute, rows };
  writeFileSync(out + "/simulated-4g-performance-latest.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
