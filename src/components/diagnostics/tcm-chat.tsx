"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, ImageIcon, Send, Loader2, Trash2 } from "lucide-react";

// Types for message history
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: any;
}

interface AnalysisData {
  tongue?: {
    color?: string;
    coatColor?: string;
    coatThickness?: string;
    shape?: string;
    fissures?: string;
    moisture?: string;
    petechiae?: string;
    toothMarks?: string;
    notes?: string;
  };
  face?: {
    complexion?: string;
    lipColor?: string;
    eyeBags?: string;
    acneOrSpots?: string;
    gloss?: string;
    darkCircles?: string;
    redNose?: string;
    cheekRuddiness?: string;
    notes?: string;
  };
  tcmPatternHypotheses?: string[];
  advice?: {
    lifestyle?: string[];
    diet?: string[];
    precautions?: string[];
  };
  confidence?: number;
  summary?: string;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// Add: normalize various Coze response shapes into AnalysisData with summary
function normalizeAnalysisData(d: any): AnalysisData {
  if (!d) return { summary: "（空响应）" };
  if (typeof d === "string") return { summary: d };
  if (Array.isArray(d)) {
    const joined = d
      .map((p: any) => (typeof p === "string" ? p : p?.text || p?.content || ""))
      .filter(Boolean)
      .join("\n")
      .trim();
    return { summary: joined || undefined };
  }
  if (typeof d === "object") {
    if (typeof (d as any).summary === "string") return d as AnalysisData;
    if (typeof (d as any).text === "string") return { ...(d as any), summary: (d as any).text };
    if (typeof (d as any).content === "string") return { ...(d as any), summary: (d as any).content };
    if (Array.isArray((d as any).messages)) {
      const msgs = (d as any).messages as any[];
      const text = msgs
        .filter((m) => m?.role === "assistant")
        .map((m) => m?.content || m?.text || "")
        .filter(Boolean)
        .join("\n")
        .trim();
      if (text) return { ...(d as any), summary: text };
    }
    return d as AnalysisData;
  }
  return { summary: String(d) };
}

export const TcmChat: React.FC = () => {
  const [tongueImage, setTongueImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const tongueInputRef = useRef<HTMLInputElement | null>(null);
  const faceInputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => {
    return !loading && (!!tongueImage || !!faceImage || prompt.trim().length > 0);
  }, [loading, tongueImage, faceImage, prompt]);

  const handleFilePick = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: "tongue" | "face") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    if (type === "tongue") setTongueImage(url);
    if (type === "face") setFaceImage(url);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, type: "tongue" | "face") => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    if (type === "tongue") setTongueImage(url);
    if (type === "face") setFaceImage(url);
  }, []);

  const removeImage = (type: "tongue" | "face") => {
    if (type === "tongue") setTongueImage(null);
    if (type === "face") setFaceImage(null);
  };

  // helper: upload data URL and return accessible URL; if already URL, pass-through
  const uploadIfNeeded = useCallback(async (img?: string | null) => {
    if (!img) return null;
    if (img.startsWith("data:")) {
      const r = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: img }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err?.error || "图片上传失败");
      }
      const j = await r.json();
      return j.url as string;
    }
    return img;
  }, []);

  const sendAnalysis = useCallback(async () => {
    if (!canSend) return;
    setLoading(true);

    const userMsg: ChatMessage = {
      role: "user",
      content: [
        { type: "text", text: prompt || "请结合图片进行舌诊与面部分析" },
        ...(tongueImage ? [{ type: "input_image", image_url: tongueImage }] : []),
        ...(faceImage ? [{ type: "input_image", image_url: faceImage }] : []),
      ],
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      // upload data URLs first to get accessible URLs
      const [tongueUrl, faceUrl] = await Promise.all([
        uploadIfNeeded(tongueImage),
        uploadIfNeeded(faceImage),
      ]);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          tongueImage: tongueUrl,
          faceImage: faceUrl,
          history: messages, // pass previous history
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `请求失败: ${res.status}`);
      }

      const result = await res.json();
      const data: AnalysisData = normalizeAnalysisData(result?.data);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: { summary: e?.message || "分析失败，请稍后重试" },
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  }, [canSend, prompt, tongueImage, faceImage, messages, uploadIfNeeded]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">舌诊 / 面诊 图片上传</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          {/* Tongue uploader */}
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "tongue")}
              className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center gap-2 min-h-40"
            >
              {tongueImage ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tongueImage} alt="舌头预览" className="w-full h-40 object-cover rounded" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => removeImage("tongue")}
                  >
                    <Trash2 className="size-4 mr-2" />移除舌头图片
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="size-6" />
                  <p className="text-sm text-muted-foreground">拖拽舌头图片到此处，或点击选择</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => tongueInputRef.current?.click()}>
                    <Upload className="size-4 mr-2" /> 选择舌头图片
                  </Button>
                </div>
              )}
              <Input
                ref={tongueInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFilePick(e, "tongue")}
              />
            </div>
          </div>

          {/* Face uploader */}
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "face")}
              className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center gap-2 min-h-40"
            >
              {faceImage ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faceImage} alt="面部预览" className="w-full h-40 object-cover rounded" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => removeImage("face")}
                  >
                    <Trash2 className="size-4 mr-2" />移除面部图片
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="size-6" />
                  <p className="text-sm text-muted-foreground">拖拽面部图片到此处，或点击选择</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => faceInputRef.current?.click()}>
                    <Upload className="size-4 mr-2" /> 选择面部图片
                  </Button>
                </div>
              )}
              <Input
                ref={faceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFilePick(e, "face")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">对话与诊断结果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[420px] overflow-auto rounded border p-3 space-y-3 bg-background">
            {messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">上传图片后，可输入补充说明并点击分析。</div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    {m.role === "assistant" ? (
                      <AvatarImage src="/next.svg" alt="AI" />
                    ) : (
                      <AvatarFallback>你</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    {m.role === "assistant" ? (
                      <AssistantBlock data={m.content as AnalysisData} />
                    ) : (
                      <UserBlock content={m.content} />
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> 正在分析...
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="可输入症状、作息、饮食等补充信息（可选）"
              className="min-h-12"
            />
            <Button onClick={sendAnalysis} disabled={!canSend} className="self-end sm:self-auto">
              {loading ? (
                <><Loader2 className="size-4 mr-2 animate-spin" /> 分析中</>
              ) : (
                <><Send className="size-4 mr-2" /> 分析</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SectionRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="text-sm flex gap-2">
      <span className="text-muted-foreground min-w-20">{label}</span>
      <span className="flex-1">{value}</span>
    </div>
  );
};

const BulletList = ({ items }: { items?: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
};

const AssistantBlock = ({ data }: { data: AnalysisData }) => {
  if (!data) return null;
  return (
    <div className="space-y-3">
      {data.summary && (
        <p className="text-sm leading-relaxed">{data.summary}</p>
      )}

      {(data.tongue || data.face) && (
        <div className="grid md:grid-cols-2 gap-3">
          {data.tongue && (
            <div className="rounded-md border p-3">
              <h4 className="font-medium mb-2">舌象</h4>
              <div className="space-y-1">
                <SectionRow label="舌色" value={data.tongue.color} />
                <SectionRow label="苔色" value={data.tongue.coatColor} />
                <SectionRow label="苔厚" value={data.tongue.coatThickness} />
                <SectionRow label="形态" value={data.tongue.shape} />
                <SectionRow label="裂纹" value={data.tongue.fissures} />
                <SectionRow label="润泽" value={data.tongue.moisture} />
                <SectionRow label="瘀点" value={data.tongue.petechiae} />
                <SectionRow label="齿痕" value={data.tongue.toothMarks} />
                <SectionRow label="备注" value={data.tongue.notes} />
              </div>
            </div>
          )}
          {data.face && (
            <div className="rounded-md border p-3">
              <h4 className="font-medium mb-2">面部</h4>
              <div className="space-y-1">
                <SectionRow label="面色" value={data.face.complexion} />
                <SectionRow label="唇色" value={data.face.lipColor} />
                <SectionRow label="眼袋" value={data.face.eyeBags} />
                <SectionRow label="痤疮/斑" value={data.face.acneOrSpots} />
                <SectionRow label="光泽" value={data.face.gloss} />
                <SectionRow label="黑眼圈" value={data.face.darkCircles} />
                <SectionRow label="鼻尖发红" value={data.face.redNose} />
                <SectionRow label="面颊潮红" value={data.face.cheekRuddiness} />
                <SectionRow label="备注" value={data.face.notes} />
              </div>
            </div>
          )}
        </div>
      )}

      {data.tcmPatternHypotheses && data.tcmPatternHypotheses.length > 0 && (
        <div className="rounded-md border p-3">
          <h4 className="font-medium mb-2">体质与证候假设</h4>
          <BulletList items={data.tcmPatternHypotheses} />
        </div>
      )}

      {data.advice && (
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-md border p-3">
            <h4 className="font-medium mb-2">起居建议</h4>
            <BulletList items={data.advice.lifestyle} />
          </div>
          <div className="rounded-md border p-3">
            <h4 className="font-medium mb-2">饮食建议</h4>
            <BulletList items={data.advice.diet} />
          </div>
          <div className="rounded-md border p-3">
            <h4 className="font-medium mb-2">注意事项</h4>
            <BulletList items={data.advice.precautions} />
          </div>
        </div>
      )}

      {typeof data.confidence === "number" && (
        <div className="text-xs text-muted-foreground">置信度：{Math.round((data.confidence || 0) * 100)}%</div>
      )}

      <p className="text-xs text-muted-foreground">提示：本结果仅供健康参考，不能替代专业医疗建议。如有不适请及时就医。</p>
    </div>
  );
};

const UserBlock = ({ content }: { content: any }) => {
  const hasImages = Array.isArray(content) && content.some((c) => c.type === "input_image");
  return (
    <div className="space-y-2">
      {Array.isArray(content) ? (
        <>
          {content.find((c: any) => c.type === "text")?.text && (
            <p className="text-sm">{content.find((c: any) => c.type === "text")?.text}</p>
          )}
          {hasImages && (
            <div className="grid grid-cols-2 gap-2">
              {content
                .filter((c: any) => c.type === "input_image")
                .map((img: any, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img.image_url} alt={`上传图片${i + 1}`} className="w-full h-24 object-cover rounded" />
                ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm">{String(content)}</p>
      )}
    </div>
  );
};