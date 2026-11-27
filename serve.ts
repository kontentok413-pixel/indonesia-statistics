// Serve the site locally for testing: `node serve.ts` then open
// http://localhost:8080 (or `node serve.ts --port 8090`). Serves app/ at /.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "app");
const portArg = process.argv.find((a, i) => process.argv[i - 1] === "--port");
const port = Number(portArg ?? 8080);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const server = createServer(async (req, res) => {
  const raw = new URL(req.url ?? "/", "http://localhost").pathname;
  const rel = normalize(decodeURIComponent(raw)).replace(/^\/+/, "");
  const file = join(root, rel === "" ? "index.html" : rel);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

server.listen(port, () => console.log(`serving app/ at http://localhost:${port}`));
