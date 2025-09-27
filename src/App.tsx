import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import DiagnosisPage from "@/pages/DiagnosisPage";
import ResultPage from "@/pages/ResultPage";
import AboutPage from "@/pages/AboutPage";
import AgentChatPage from "@/pages/AgentChatPage";
import HerbContradictionsPage from "@/pages/HerbContradictionsPage";
import SeasonalHerbsPage from "@/pages/SeasonalHerbsPage";
import HerbKnowledgePage from "@/pages/HerbKnowledgePage";
import { useState, createContext, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AuthContext } from '@/contexts/authContext';
import { DiagnosisResult } from './lib/diagnosticEngine';

// 创建诊断结果上下文
interface DiagnosisContextType {
  faceImage: File | null;
  tongueImage: File | null;
  setFaceImage: Dispatch<SetStateAction<File | null>>;
  setTongueImage: Dispatch<SetStateAction<File | null>>;
  diagnosisResult: DiagnosisResult | null;
  setDiagnosisResult: Dispatch<SetStateAction<DiagnosisResult | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const DiagnosisContext = createContext<DiagnosisContextType>({
  faceImage: null,
  tongueImage: null,
  setFaceImage: () => {},
  setTongueImage: () => {},
  diagnosisResult: null,
  setDiagnosisResult: () => {},
  loading: false,
  setLoading: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [tongueImage, setTongueImage] = useState<File | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 从localStorage加载诊断结果（如果有）
  useEffect(() => {
    const savedResult = localStorage.getItem('diagnosisResult');
    if (savedResult) {
      try {
        setDiagnosisResult(JSON.parse(savedResult));
      } catch (error) {
        console.error('Failed to parse saved diagnosis result:', error);
        localStorage.removeItem('diagnosisResult');
      }
    }
  }, []);

  // 保存诊断结果到localStorage
  useEffect(() => {
    if (diagnosisResult) {
      localStorage.setItem('diagnosisResult', JSON.stringify(diagnosisResult));
    } else {
      localStorage.removeItem('diagnosisResult');
    }
  }, [diagnosisResult]);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <DiagnosisContext.Provider
        value={{ 
          faceImage, 
          tongueImage, 
          setFaceImage, 
          setTongueImage,
          diagnosisResult,
          setDiagnosisResult,
          loading,
          setLoading
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/chat" element={<AgentChatPage />} />
          <Route path="/herb-contradictions" element={<HerbContradictionsPage />} />
          <Route path="/seasonal-herbs" element={<SeasonalHerbsPage />} />
          <Route path="/herb-knowledge" element={<HerbKnowledgePage />} />
        </Routes>
      </DiagnosisContext.Provider>
    </AuthContext.Provider>
  );
}
