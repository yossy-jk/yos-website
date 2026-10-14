import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
export function reviewText(text) {
  const issues = [];
  if (/[\u2013\u2014]/.test(text))
    issues.push("Use a plain hyphen, not an en or em dash.");
  const banned = [
    "solutions",
    "leverage",
    "deep dive",
    "in today's fast-paced world",
    "synergies",
    "holistic",
    "seamlessly",
    "exciting journey",
    "game-changer",
    "passionate about",
    "thrilled to announce",
    "delighted to share",
    "in today’s fast-paced world",
    "touch base",
    "circle back",
    "bandwidth",
    "move the needle",
    "low-hanging fruit",
    "transformative",
    "robust",
    "scalable",
    "innovative",
    "cutting-edge",
    "best-in-class",
    "world-class",
    "ecosystem",
  ];
  for (const word of banned)
    if (
      new RegExp(
        "\\b" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
        "i",
      ).test(text)
    )
      issues.push(`Remove draft wording: ${word}`);
  return issues;
}
function files(dir) {
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .flatMap((e) =>
          e.isDirectory()
            ? files(path.join(dir, e.name))
            : [path.join(dir, e.name)],
        )
    : [];
}
function run() {
  const paths = [
    "src/components/tenant",
    "src/app/tenant-rep/packages",
    "src/app/tenant-rep/guarantee",
    "src/app/tools/lease-cost-calculator",
    "src/app/tools/time-cost-calculator",
    "src/app/tools/critical-dates",
    "src/app/lease-health-check",
    "src/app/lease-checklist",
    "src/app/refer",
    "src/app/insights",
    "src/app/thank-you",
    "src/app/api/tenant-lead",
  ]
    .flatMap(files)
    .concat([
      "src/app/tenant-rep/page.tsx",
      "src/lib/tenant-offer.ts",
      "src/lib/tenant-calculations.ts",
      "src/lib/tenant-leads.ts",
    ]);
  const issues = paths.flatMap((f) =>
    reviewText(fs.readFileSync(f, "utf8")).map((x) => `${f}: ${x}`),
  );
  const sandboxModule = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync("src/lib/tenant-offer.ts", "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    { exports: sandboxModule.exports, module: sandboxModule },
  );
  const config = sandboxModule.exports.TENANT_OFFER;
  if (
    process.env.VERCEL_ENV === "production" &&
    (!config.approvedForPublication ||
      !config.guaranteeApproved ||
      !config.licenceApproved)
  )
    issues.push(
      "Production publication requires approved copy, guarantee and licence wording.",
    );
  if (issues.length) {
    console.error(issues.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Tenant offer copy check passed. " +
        (config.approvedForPublication
          ? "Publication approved."
          : "Review preview only; production release is blocked."),
    );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(new URL(import.meta.url).pathname)
)
  run();
