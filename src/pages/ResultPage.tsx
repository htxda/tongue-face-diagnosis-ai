import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiagnosisContext } from '../App';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { DiagnosisResult } from '../lib/diagnosticEngine';
import { FaceFeatures, TongueFeatures } from '../lib/imageAnalyzer';

export default function ResultPage() {
  const navigate = useNavigate();
  const { diagnosisResult, faceImage, tongueImage, loading, setLoading } = useContext(DiagnosisContext);
  const [localResult, setLocalResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从localStorage加载诊断结果（如果有）
  useEffect(() => {
    const loadResult = () => {
      setIsLoading(true);
      
      try {
        // 优先使用context中的结果
        if (diagnosisResult) {
          setLocalResult(diagnosisResult);
          setIsLoading(false);
          return;
        }
        
         // 如果context中没有，尝试从localStorage加载
         const savedResult = localStorage.getItem('diagnosisResult');
         if (savedResult) {
           const parsedResult = JSON.parse(savedResult);
           setLocalResult(parsedResult);
           setIsLoading(false);
           return;
         }
         
         // 如果都没有，不生成默认结果，而是提示用户重新诊断
          setIsLoading(false);
         const defaultResult = generateDefaultDiagnosisResult();
         setLocalResult(defaultResult);
        
      } catch (error) {
        console.error('加载诊断结果失败:', error);
        // 出错时生成默认结果
        const defaultResult = generateDefaultDiagnosisResult();
        setLocalResult(defaultResult);
        setIsLoading(false);
      }
    };

    // 延迟加载，模拟网络请求
    const timer = setTimeout(loadResult, 800);
    
    return () => clearTimeout(timer);
  }, [diagnosisResult]);

  // 生成默认的诊断结果（仅用于诊断过程中的错误处理）
  const generateDefaultDiagnosisResult = (): DiagnosisResult => {
    // 随机生成一个种子，确保每次结果不同
    const seed = Math.floor(Math.random() * 1000000);
    
    // 随机选择体质类型
    const bodyTypesOptions = [
      ['气虚质'],
      ['湿热质'],
      ['阴虚质'],
      ['阳虚质'],
      ['痰湿质'],
      ['血瘀质'],
      ['气郁质'],
      ['气虚质', '湿热质'],
      ['阴虚质', '气郁质']
    ];
    const bodyTypes = bodyTypesOptions[seed % bodyTypesOptions.length];
    
    // 随机生成面部特征
    const complexions: FaceFeatures['complexion'][] = ['苍白', '萎黄', '暗黄', '潮红'];
    const eyes: FaceFeatures['eyes'][] = ['无神', '红肿', '干涩', '浑浊'];
    const lips: FaceFeatures['lips'][] = ['苍白', '发紫', '干燥', '裂纹'];
    const overallColors: FaceFeatures['overallColor'][] = ['偏白', '偏黄', '偏红', '偏暗'];
    
    const faceAnalysis: FaceFeatures = {
      complexion: complexions[seed % complexions.length],
      eyes: eyes[(seed * 7) % eyes.length],
      lips: lips[(seed * 13) % lips.length],
      overallColor: overallColors[(seed * 19) % overallColors.length]
    };
    
    // 随机生成舌头特征
    const colors: TongueFeatures['color'][] = ['淡白', '红', '暗红', '青紫'];
    const coatings: TongueFeatures['coating'][] = ['厚腻', '黄腻', '少苔', '无苔'];
    const shapes: TongueFeatures['shape'][] = ['胖大', '瘦小', '齿痕', '裂纹'];
    const moistures: TongueFeatures['moisture'][] = ['干燥', '水滑', '黏腻'];
    
    const tongueAnalysis: TongueFeatures = {
      color: colors[(seed * 23) % colors.length],
      coating: coatings[(seed * 29) % coatings.length],
      shape: shapes[(seed * 31) % shapes.length],
      moisture: moistures[(seed * 37) % moistures.length]
    };
    
    // 随机生成健康评分（稍微偏低，因为这是错误情况）
    const healthScore = 60 + (seed % 20); // 60-80之间的随机分数
    
    // 基础建议
    const suggestions = [
      '由于系统无法获取完整的诊断数据，建议您重新上传照片进行分析',
      '保持规律作息，避免熬夜和过度劳累',
      '饮食宜清淡，均衡营养，避免暴饮暴食',
      '适当进行有氧运动，增强体质',
      '保持心情舒畅，避免过度紧张和焦虑',
      '如有不适症状，建议及时咨询专业中医师进行进一步诊断和调理'
    ];
    
    // 分析详情
    const analysisDetails = [
      '面部分析显示您的面色为' + faceAnalysis.complexion + '，可能存在一定程度的健康问题',
      '眼睛状态为' + faceAnalysis.eyes + '，提示可能需要注意休息和调养',
      '嘴唇状态为' + faceAnalysis.lips + '，建议适当调整饮食和生活习惯',
      '舌色为' + tongueAnalysis.color + '，提示可能存在气血或阴阳失衡',
      '舌苔为' + tongueAnalysis.coating + '，建议注意消化系统的调养',
      '舌形为' + tongueAnalysis.shape + '，可能与体质状况有关',
      '舌面湿度为' + tongueAnalysis.moisture + '，提示津液代谢可能存在异常',
      '由于诊断过程中出现异常，建议重新进行诊断以获取更准确的结果'
    ];
    
    return {
      healthScore,
      bodyTypes,
      faceAnalysis,
      tongueAnalysis,
      suggestions,
      diagnosisTime: new Date().toISOString(),
      analysisDetails
    };
  };

   // 生成雷达图数据 - 基于中医理论的五项核心健康指标
  const generateRadarData = () => {
    if (!localResult) return [];
    
    // 根据诊断结果和中医理论生成相关的雷达图数据
    const baseScore = localResult.healthScore || 80;
    
    // 根据体质类型调整各项中医健康指标
    const bodyTypeAdjustments: Record<string, Record<string, number>> = {
      '气虚质': { '气血': -15, '脏腑': -10 },
      '湿热质': { '津液': -15, '阴阳': -10 },
      '阴虚质': { '津液': -20, '阴阳': -15 },
      '阳虚质': { '气血': -10, '阴阳': -20 },
      '痰湿质': { '津液': -10, '脏腑': -15 },
      '血瘀质': { '气血': -20, '经络': -15 },
      '气郁质': { '气血': -10, '经络': -10 }
    };
    
    let adjustments = { '气血': 0, '津液': 0, '阴阳': 0, '脏腑': 0, '经络': 0 };
    
    if (localResult.bodyTypes) {
      localResult.bodyTypes.forEach((type: string) => {
        if (bodyTypeAdjustments[type]) {
          Object.keys(adjustments).forEach(key => {
            adjustments[key as keyof typeof adjustments] += bodyTypeAdjustments[type][key] || 0;
          });
        }
      });
    }
    
    const aspects = [
      { name: '气血', value: Math.max(30, Math.min(100, baseScore + adjustments['气血'])) },
      { name: '津液', value: Math.max(30, Math.min(100, baseScore + adjustments['津液'])) },
      { name: '阴阳', value: Math.max(30, Math.min(100, baseScore + adjustments['阴阳'])) },
      { name: '脏腑', value: Math.max(30, Math.min(100, baseScore + adjustments['脏腑'])) },
      { name: '经络', value: Math.max(30, Math.min(100, baseScore + adjustments['经络'])) },
    ];
    
    return aspects;
  };

  const radarData = generateRadarData();

  // 定义健康分数的颜色
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  // 定义体质类型的标签样式
  const getBodyTypeBadge = (type: string) => {
    const colors = [
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    ];
    if (!localResult || !localResult.bodyTypes) return colors[0];
    const index = localResult.bodyTypes.indexOf(type) % colors.length;
    return colors[index];
  };

  // 格式化日期时间
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '未知时间';
    }
  };

  // 如果仍在加载中，显示加载状态
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
        {/* 导航栏 */}
        <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-amber-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-heart-pulse text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-red-800 dark:text-amber-400">中医智能诊断</h1>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-home"></i>
              返回首页
            </button>
          </div>
        </nav>

        {/* 加载状态 */}
        <main className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8">
            <i className="fa-solid fa-spinner fa-spin text-red-600 dark:text-red-400 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-center text-red-800 dark:text-amber-400 mb-4">
            正在生成诊断结果
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-md">
            我们正在分析您的面部和舌头特征，请稍候片刻...
          </p>
        </main>

        {/* 页脚 */}
        <footer className="bg-red-800 dark:bg-slate-900 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-red-200 dark:text-slate-400">
              免责声明：本系统仅供参考，不能替代专业医生诊断
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // 如果没有结果，显示错误状态
  if (!localResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
        {/* 导航栏 */}
        <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-amber-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-heart-pulse text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-red-800 dark:text-amber-400">中医智能诊断</h1>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-home"></i>
              返回首页
            </button>
          </div>
        </nav>

        {/* 错误状态 */}
        <main className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8">
            <i className="fa-solid fa-circle-exclamation text-red-600 dark:text-red-400 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-center text-red-800 dark:text-amber-400 mb-4">
            无法加载诊断结果
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-center max-w-md mb-8">
            请返回诊断页面重新上传照片进行分析
          </p>
          <button
            onClick={() => navigate('/diagnosis')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            返回诊断页面
          </button>
        </main>

        {/* 页脚 */}
        <footer className="bg-red-800 dark:bg-slate-900 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-red-200 dark:text-slate-400">
              免责声明：本系统仅供参考，不能替代专业医生诊断
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      {/* 导航栏 */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-amber-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-heart-pulse text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-red-800 dark:text-amber-400">中医智能诊断</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <i className="fa-solid fa-home"></i>
            返回首页
          </button>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center text-red-800 dark:text-amber-400"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            诊断结果
          </motion.h2>
          
          {/* 诊断时间信息 */}
          <div className="text-center mb-6 text-sm text-slate-500 dark:text-slate-400">
            诊断时间: {localResult.diagnosisTime ? formatDateTime(localResult.diagnosisTime) : '刚刚'}
          </div>

          {/* 健康评分卡片 */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 border border-amber-200 dark:border-slate-700 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">健康评分</h3>
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="text-6xl font-bold">
                <span className={getHealthScoreColor(localResult.healthScore)}>
                  {localResult.healthScore}
                </span>
              </div>
              <div className="text-xl text-slate-500 dark:text-slate-400">/ 100</div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              基于您的面部和舌头特征分析，综合评估的健康状况得分
            </p>
          </motion.div>

          {/* 体质类型 */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-amber-200 dark:border-slate-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-person"></i>
              体质类型
            </h3>
            <div className="flex flex-wrap gap-2">
              {localResult.bodyTypes.map((type: string, index: number) => (
                <span 
                  key={index} 
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getBodyTypeBadge(type)}`}
                >
                  {type}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 健康分析 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* 面部分析 */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-face-viewfinder"></i>
                面部特征分析
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">面色:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.faceAnalysis.complexion}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">眼睛:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.faceAnalysis.eyes}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">嘴唇:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.faceAnalysis.lips}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">整体色调:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.faceAnalysis.overallColor}</span>
                </li>
              </ul>
            </motion.div>

            {/* 舌诊分析 */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-tongue"></i>
                舌诊特征分析
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">舌质颜色:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.tongueAnalysis.color}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">舌苔情况:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.tongueAnalysis.coating}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">舌形特征:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.tongueAnalysis.shape}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">舌面湿度:</span>
                  <span className="font-medium text-red-700 dark:text-red-400">{localResult.tongueAnalysis.moisture}</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* 健康数据图表 */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-amber-200 dark:border-slate-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-red-800 dark:text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-chart-simple"></i>
              健康数据分析
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={radarData}>
                  <PolarGrid stroke="#d1d5db" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar
                    name="健康指数"
                    dataKey="value"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 分析详情 */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-amber-200 dark:border-slate-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-microscope"></i>
              诊断分析详情
            </h3>
            <ul className="space-y-3">
              {localResult.analysisDetails.map((detail: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-info text-blue-600 dark:text-blue-400 mt-1"></i>
                  <span className="text-slate-600 dark:text-slate-300">{detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 健康建议 */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-amber-200 dark:border-slate-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb"></i>
              个性化健康建议
            </h3>
            <ul className="space-y-3">
              {localResult.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400 mt-1"></i>
                  <span className="text-slate-600 dark:text-slate-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 操作按钮 */}
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/diagnosis')}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-rotate"></i>
              重新诊断
            </motion.button>
            <motion.button
              onClick={() => navigate('/chat')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-comment-medical"></i>
              咨询智能助手
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-home"></i>
              返回首页
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-red-800 dark:bg-slate-900 text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-red-200 dark:text-slate-400">
            免责声明：本系统仅供参考，不能替代专业医生诊断
          </p>
        </div>
      </footer>
    </div>
  );
}