import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function parseDataUrl(dataUrl: string) {
  // data:[<mediatype>][;base64],<data>
  const match = /^data:(.+);base64,(.*)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2];
  return { mime, b64 };
}

function extFromMime(mime: string) {
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "image/svg+xml": ".svg",
  };
  return map[mime] || "";
}

export async function POST(req: NextRequest) {
  try {
    const { dataUrl } = await req.json();
    if (!dataUrl || typeof dataUrl !== "string") {
      return NextResponse.json({ error: "缺少 dataUrl" }, { status: 400 });
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return NextResponse.json({ error: "无效的 data URL" }, { status: 400 });
    }

    const { mime, b64 } = parsed;
    const ext = extFromMime(mime) || ".bin";

    // Build paths
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {}

    // Filename
    const now = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const filename = `${now}-${rand}${ext}`;

    const filePath = path.join(uploadsDir, filename);
    const fileBuffer = Buffer.from(b64, "base64");

    // Optional: rudimentary size guard (10 MB)
    const tenMB = 10 * 1024 * 1024;
    if (fileBuffer.length > tenMB) {
      return NextResponse.json({ error: "文件过大，限制 10MB" }, { status: 413 });
    }

    await fs.writeFile(filePath, fileBuffer);

    // Public URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (e: any) {
    console.error("/api/upload error", e);
    return NextResponse.json({ error: e?.message || "上传失败" }, { status: 500 });
  }
}