import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const T = {".html":"text/html; charset=utf-8",".json":"application/json; charset=utf-8",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml",".css":"text/css",".js":"text/javascript"};
http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/docs/index.html";
  if (p.endsWith("/")) p += "index.html";
  const f = normalize(join(process.cwd(), p));
  if (!f.startsWith(join(process.cwd(), "docs")) ) { res.writeHead(403); return res.end("Forbidden"); }
  try { const b = await readFile(f); res.writeHead(200, {"Content-Type": T[extname(f)] || "application/octet-stream"}); res.end(b); }
  catch { res.writeHead(404); res.end("Not found"); }
}).listen(3000, "0.0.0.0", () => console.log("OZone preview on http://localhost:3000 (admin at /docs/admin/)"));
