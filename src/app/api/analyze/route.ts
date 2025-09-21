import { NextRequest, NextResponse } from "next/server";

// Server route to analyze tongue and face images and return TCM-oriented diagnostics
export async function POST(req: NextRequest) {
  try {
    const { prompt, tongueImage, faceImage, history } = await req.json();

    // 允许纯文本分析，不再强制要求图片

    const apiKey = process.env.COZE_API_KEY;
    const botId = process.env.COZE_BOT_ID;
    // normalize base to origin only to avoid duplicates like "/v3/chat/open_api/v2/chat"
    const rawBase = process.env.COZE_BASE_URL || "https://api.coze.com"; // 国内可改为 https://api.coze.cn
    let origin: string;
    try {
      origin = new URL(rawBase).origin;
    } catch {
      origin = "https://api.coze.com";
    }
    const userId = process.env.COZE_USER_ID || "web_user";

    if (!apiKey || !botId) {
      return NextResponse.json({ error: "缺少 Coze 凭证，请配置 COZE_API_KEY 与 COZE_BOT_ID" }, { status: 500 });
    }

    // 从请求推断站点 origin，用于把相对路径转为绝对 URL（Coze 仅能访问公网绝对链接）
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const siteOrigin = `${proto}://${host}`;
    const normalizeUrl = (u?: string | null) => (u ? (u.startsWith("/") ? `${siteOrigin}${u}` : u) : undefined);

    // Build a plain text prompt (embed image URLs) to match Coze simple chat schema
    const lines: string[] = [];
    lines.push(prompt || "请结合图片进行舌诊与面部分析");
    const tongueUrlAbs = normalizeUrl(tongueImage);
    const faceUrlAbs = normalizeUrl(faceImage);
    if (tongueUrlAbs) lines.push(`舌头图片: ![](${tongueUrlAbs})`);
    if (faceUrlAbs) lines.push(`面部图片: ![](${faceUrlAbs})`);
    const finalUserContent = lines.join("\n");

    // Transform chat history if provided (as simple text messages)
    const addlHistory = Array.isArray(history)
      ? history.slice(-6).map((m: any) => {
          const role = m?.role === "assistant" ? "assistant" : "user";
          let contentText = "";
          const c = m?.content;
          if (typeof c === "string") {
            contentText = c;
          } else if (Array.isArray(c)) {
            // extract text and image urls
            const txt = c.find((p) => p?.type === "text")?.text || "";
            const imgs = c
              .filter((p) => p?.type === "input_image" && p?.image_url)
              .map((p) => `![](${normalizeUrl(p.image_url)})`);
            contentText = [txt, ...imgs].filter(Boolean).join("\n");
          } else if (c && typeof c === "object") {
            contentText = c.summary || c.text || c.content || JSON.stringify(c);
          }
          return { role, content: contentText };
        })
      : [];

    const body = {
      bot_id: botId,
      user_id: userId,
      stream: false,
      additional_messages: [
        ...addlHistory,
        { role: "user", content: finalUserContent },
      ],
    } as const;

    const cozeResp = await fetch(`${origin}/open_api/v2/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const cozeData = await cozeResp.json().catch(() => null);
    if (!cozeResp.ok) {
      const msg = (cozeData && (cozeData.message || cozeData.msg || cozeData.error)) || "Coze 请求失败";
      return NextResponse.json({ error: msg }, { status: cozeResp.status || 500 });
    }

    // Try to find assistant final content
    let raw: any = undefined;
    try {
      const messagesArr = (cozeData?.messages || cozeData?.data?.messages || []) as any[];
      const lastAssistant = [...messagesArr].reverse().find((m) => m?.role === "assistant");
      raw = lastAssistant?.content ?? cozeData?.content ?? cozeData?.data ?? cozeData;
    } catch {
      raw = cozeData;
    }

    // content could be string or array of segments
    let textContent = "";
    if (typeof raw === "string") {
      textContent = raw;
    } else if (Array.isArray(raw)) {
      // concatenate text parts
      textContent = raw
        .map((p: any) => (typeof p === "string" ? p : p?.text || p?.content || ""))
        .filter(Boolean)
        .join("\n");
    } else if (raw && typeof raw === "object") {
      textContent = (raw as any)?.text || (raw as any)?.content || JSON.stringify(raw);
    }

    let data: any;
    try {
      data = JSON.parse(textContent);
    } catch {
      // If not JSON, wrap it into { summary }
      data = { summary: textContent };
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    console.error("/api/analyze error", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}