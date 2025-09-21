import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function parseDataUrl(dataUrl: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");
  return { mime, buffer } as const;
}

function getExtFromMime(mime: string) {
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "image/bmp": ".bmp",
    "image/tiff": ".tiff",
  };
  return map[mime] || ".bin";
}

function getOrigin(req: NextRequest) {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (forwardedProto && host) return `${forwardedProto}://${host}`;
  const referer = req.headers.get("referer");
  if (referer) {
    try { return new URL(referer).origin; } catch { /* noop */ }
  }
  // Fallback for local dev
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const { dataUrl, filename } = await req.json();
    if (!dataUrl || typeof dataUrl !== "string") {
      return NextResponse.json({ error: "缺少 dataUrl" }, { status: 400 });
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return NextResponse.json({ error: "无效的 data URL" }, { status: 400 });
    }

    const { mime, buffer } = parsed;
    if (!mime.startsWith("image/")) {
      return NextResponse.json({ error: "仅支持图片类型" }, { status: 400 });
    }

    // 限制 10MB
    if (buffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "图片过大(>10MB)" }, { status: 413 });
    }

    const ext = filename ? path.extname(filename) || getExtFromMime(mime) : getExtFromMime(mime);

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dir = path.join(process.cwd(), "public", "uploads", `${y}`, `${m}${d}`);
    await mkdir(dir, { recursive: true });

    const unique = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
    const safeName = (filename ? path.basename(filename, path.extname(filename)) : "image")
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${safeName}-${unique}${ext}`;
    const filePath = path.join(dir, fileName);

    await writeFile(filePath, buffer);

    const relPath = `/uploads/${y}/${m}${d}/${fileName}`;
    const origin = getOrigin(req);
    const url = `${origin}${relPath}`;

    return NextResponse.json({ ok: true, url, path: relPath, mime, size: buffer.byteLength });
  } catch (e: any) {
    console.error("/api/upload-image error", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}