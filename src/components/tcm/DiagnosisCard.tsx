"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Diagnosis = {
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
  advice?: { lifestyle?: string[]; diet?: string[]; precautions?: string[] };
  confidence?: number;
  summary?: string;
};

export default function DiagnosisCard({ data }: { data: Diagnosis }) {
  if (!data) return null;
  const pct = typeof data.confidence === "number" ? Math.round(data.confidence * 100) : undefined;
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">分析结果</h3>
        {pct !== undefined && <span className="text-sm text-muted-foreground">可信度 {pct}%</span>}
      </div>

      {data.summary && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</div>
      )}

      <section className="grid md:grid-cols-2 gap-4">
        {data.tongue && (
          <div>
            <h4 className="font-medium mb-2">舌象</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {Object.entries(data.tongue).map(([k, v]) => v ? (<li key={k}><span className="text-foreground mr-1">{labelMap[k] || k}:</span>{String(v)}</li>) : null)}
            </ul>
          </div>
        )}
        {data.face && (
          <div>
            <h4 className="font-medium mb-2">面部体征</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {Object.entries(data.face).map(([k, v]) => v ? (<li key={k}><span className="text-foreground mr-1">{labelMap[k] || k}:</span>{String(v)}</li>) : null)}
            </ul>
          </div>
        )}
      </section>

      {Array.isArray(data.tcmPatternHypotheses) && data.tcmPatternHypotheses.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">可能体质/证候</h4>
          <div className="flex flex-wrap gap-2">
            {data.tcmPatternHypotheses.map((p, i) => (<Badge key={i} variant="secondary">{p}</Badge>))}
          </div>
        </div>
      )}

      {data.advice && (
        <div className="grid md:grid-cols-3 gap-4">
          {renderList("生活方式建议", data.advice.lifestyle)}
          {renderList("饮食建议", data.advice.diet)}
          {renderList("注意事项", data.advice.precautions)}
        </div>
      )}

      <p className="text-xs text-muted-foreground">提示：以上内容仅供健康参考，不能替代专业医疗诊断。如有不适请及时就医。</p>
    </Card>
  );
}

const labelMap: Record<string, string> = {
  color: "舌色",
  coatColor: "苔色",
  coatThickness: "苔厚",
  shape: "舌形",
  fissures: "裂纹",
  moisture: "津液",
  petechiae: "瘀点",
  toothMarks: "齿痕",
  notes: "备注",
  complexion: "面色",
  lipColor: "唇色",
  eyeBags: "眼袋",
  acneOrSpots: "痘/斑",
  gloss: "光泽",
  darkCircles: "黑眼圈",
  redNose: "鼻尖红",
  cheekRuddiness: "颧红",
};

function renderList(title: string, items?: string[]) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
        {items.map((it, i) => (<li key={i}>{it}</li>))}
      </ul>
    </div>
  );
}