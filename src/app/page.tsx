import Image from "next/image";
import { TcmChat } from "@/components/diagnostics/tcm-chat";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-6 row-start-2 w-full max-w-5xl">
        <div className="flex items-center gap-3">
          <Image className="dark:invert" src="/next.svg" alt="Logo" width={120} height={26} priority />
          <h1 className="text-2xl font-semibold tracking-tight">中医舌诊 · 面诊 AI 助手</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          上传舌头与面部照片，输入补充说明，获得基于中医辨证思路的非医疗性健康参考与保健建议。
        </p>
        <TcmChat />
      </main>
    </div>
  );
}