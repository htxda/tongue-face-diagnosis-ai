import React, { useContext, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DiagnosisContext } from '../App';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { DiagnosticEngine } from '../lib/diagnosticEngine';

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { 
    faceImage: contextFaceImage, 
    tongueImage: contextTongueImage, 
    setFaceImage, 
    setTongueImage, 
    setDiagnosisResult,
    loading: contextLoading,
    setLoading
  } = useContext(DiagnosisContext);
  const faceInputRef = useRef<HTMLInputElement>(null);
  const tongueInputRef = useRef<HTMLInputElement>(null);
  
  // 本地状态用于实时UI更新，确保图片上传后立即显示
  const [localFaceImage, setLocalFaceImage] = useState<File | null>(contextFaceImage);
  const [localTongueImage, setLocalTongueImage] = useState<File | null>(contextTongueImage);
  const [localLoading, setLocalLoading] = useState(false);

  // 同步context状态到本地状态
  React.useEffect(() => {
    setLocalFaceImage(contextFaceImage);
  }, [contextFaceImage]);

  React.useEffect(() => {
    setLocalTongueImage(contextTongueImage);
  }, [contextTongueImage]);

  React.useEffect(() => {
    setLocalLoading(contextLoading);
  }, [contextLoading]);

  const handleFaceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // 简单验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请上传有效的图片文件');
        return;
      }
      // 简单验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过5MB');
        return;
      }
      
      // 立即更新本地状态，确保UI实时反映
      setLocalFaceImage(file);
      // 更新context状态
      setFaceImage(file);
      
      toast.success('面部照片上传成功');
    } else {
      // 如果用户取消选择文件，确保状态正确
      setLocalFaceImage(null);
      setFaceImage(null);
    }
  };

  const handleTongueImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // 简单验证文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('请上传有效的图片文件');
        return;
      }
      // 简单验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过5MB');
        return;
      }
      
      // 立即更新本地状态，确保UI实时反映
      setLocalTongueImage(file);
      // 更新context状态
      setTongueImage(file);
      
      toast.success('舌诊照片上传成功');
    } else {
      // 如果用户取消选择文件，确保状态正确
      setLocalTongueImage(null);
      setTongueImage(null);
    }
  };

  const handleRemoveFaceImage = () => {
    setLocalFaceImage(null);
    setFaceImage(null);
    if (faceInputRef.current) {
      faceInputRef.current.value = '';
    }
  };

  const handleRemoveTongueImage = () => {
    setLocalTongueImage(null);
    setTongueImage(null);
    if (tongueInputRef.current) {
      tongueInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // 再次确认图片已上传
    if (!localFaceImage || !localTongueImage) {
      toast.error('请上传面部和舌头照片');
      return;
    }

    // 立即设置loading状态
    setLocalLoading(true);
    setLoading(true);
    
    try {
      // 显示分析过程中的不同阶段提示
      toast.info('正在分析面部特征...', { duration: 1500 });
      
      // 使用智能诊断引擎进行诊断
      const diagnosisResult = await DiagnosticEngine.diagnose(localFaceImage, localTongueImage);
      
      // 显示分析舌头特征的提示
      toast.info('正在分析舌头特征...', { duration: 1500 });
      
      // 显示中医辨证的提示
      setTimeout(() => {
        toast.info('正在进行中医辨证分析...', { duration: 1500 });
      }, 1000);
      
      // 显示生成报告的提示
      setTimeout(() => {
        toast.info('正在生成诊断报告...', { duration: 1500 });
      }, 2000);
      
      // 设置诊断结果
      setTimeout(() => {
        setDiagnosisResult(diagnosisResult);
        
        // 跳转到结果页面
        navigate('/result');
      }, 3000);
    } catch (error) {
      console.error('诊断过程出错:', error);
      toast.error('分析过程中出现错误，请重试');
      setTimeout(() => {
        setLocalLoading(false);
        setLoading(false);
      }, 500);
    }
  };

  // 检查是否可以进行分析
  const canAnalyze = localFaceImage && localTongueImage && !localLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* 中医装饰背景元素 */}
      <div className="absolute top-10 left-10 text-4xl opacity-10 dark:opacity-5">🌿</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-10 dark:opacity-5">🍃</div>
      <div className="absolute top-1/3 right-20 text-3xl opacity-10 dark:opacity-5">🌸</div>
      <div className="absolute bottom-1/3 left-20 text-3xl opacity-10 dark:opacity-5">🌺</div>
      
      {/* 导航栏 */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-emerald-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <i className="fa-solid fa-heart-pulse text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              传统中医面诊舌诊系统
            </h1>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/chat" 
              className="text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700"
            >
              <i className="fa-solid fa-comment-medical"></i>
              健康咨询
            </Link>
            <button 
              onClick={() => navigate('/')}
              className="text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700"
            >
              <i className="fa-solid fa-arrow-left"></i>
              返回首页
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-10 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              📸 上传诊断照片
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              传承千年中医智慧，通过面诊和舌诊为您提供专业健康分析
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            {/* 面部照片上传 - 使用从HTML文件中提取的精美UI设计 */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-slate-700 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {/* 顶部装饰条 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-t-2xl"></div>
              
              <h3 className="text-2xl font-bold mb-6 text-center text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
                <i className="fa-solid fa-user text-2xl"></i>
                面部照片上传
              </h3>
              
              {!localFaceImage ? (
                <div 
                  id="faceUpload"
                  className="border-3 border-dashed border-amber-300 rounded-2xl p-12 text-center cursor-pointer hover:border-amber-500 transition-all bg-white dark:bg-slate-800 relative overflow-hidden group"
                  style={{
                    border: '3px dashed #f39c12',
                    transition: 'all 0.5s ease',
                    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => faceInputRef.current?.click()}
                >
                  {/* 悬浮光效 */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-shine"></div>
                  </div>
                  
                  <div className="text-6xl text-slate-400 mb-6 transition-all hover:text-amber-500 hover:scale-110">
                    👤
                  </div>
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                    点击或拖拽上传面部照片
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    请上传光线充足的正面照片，避免遮挡
                  </p>
                  <input
                    ref={faceInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFaceImageUpload}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img 
                    src={URL.createObjectURL(localFaceImage)} 
                    alt="面部照片" 
                    className="w-full h-80 object-cover rounded-xl border-4 border-emerald-100 dark:border-slate-700 shadow-lg transition-transform group-hover:scale-105"
                    style={{
                      maxHeight: '300px',
                      borderRadius: '15px',
                      border: '4px solid #ecf0f1',
                      transition: 'all 0.4s ease',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  />
                  <button
                    onClick={handleRemoveFaceImage}
                    className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg hover:scale-110"
                    style={{
                      background: '#e74c3c',
                      borderRadius: '50%',
                      padding: '5px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </button>
                  <div 
                    className="absolute bottom-4 right-4 bg-emerald-500 text-white rounded-full px-4 py-1 text-sm font-bold shadow-lg"
                    style={{
                      background: '#27ae60',
                      borderRadius: '20px',
                      padding: '5px 15px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ 已上传
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* 舌头照片上传 - 使用从HTML文件中提取的精美UI设计 */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-slate-700 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {/* 顶部装饰条 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-2xl"></div>
              
              <h3 className="text-2xl font-bold mb-6 text-center text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
                <i className="fa-solid fa-tongue text-2xl"></i>
                舌头照片上传
              </h3>
              
              {!localTongueImage ? (
                <div 
                  id="tongueUpload"
                  className="border-3 border-dashed border-emerald-300 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-500 transition-all bg-white dark:bg-slate-800 relative overflow-hidden group"
                  style={{
                    border: '3px dashed #2ecc71',
                    transition: 'all 0.5s ease',
                    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => tongueInputRef.current?.click()}
                >
                  {/* 悬浮光效 */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-shine"></div>
                  </div>
                  
                  <div className="text-6xl text-slate-400 mb-6 transition-all hover:text-emerald-500 hover:scale-110">
                    👅
                  </div>
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                    点击或拖拽上传舌头照片
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    请自然伸出舌头，上传清晰的照片
                  </p>
                  <input
                    ref={tongueInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleTongueImageUpload}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img 
                    src={URL.createObjectURL(localTongueImage)} 
                    alt="舌头照片" 
                    className="w-full h-80 object-cover rounded-xl border-4 border-emerald-100 dark:border-slate-700 shadow-lg transition-transform group-hover:scale-105"
                    style={{
                      maxHeight: '300px',
                      borderRadius: '15px',
                      border: '4px solid #ecf0f1',
                      transition: 'all 0.4s ease',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  />
                  <button
                    onClick={handleRemoveTongueImage}
                    className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg hover:scale-110"
                    style={{
                      background: '#e74c3c',
                      borderRadius: '50%',
                      padding: '5px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </button>
                  <div 
                    className="absolute bottom-4 right-4 bg-emerald-500 text-white rounded-full px-4 py-1 text-sm font-bold shadow-lg"
                    style={{
                      background: '#27ae60',
                      borderRadius: '20px',
                      padding: '5px 15px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ 已上传
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* 预览容器 - 从HTML文件中提取的设计 */}
          {(localFaceImage || localTongueImage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-emerald-200 dark:border-slate-700">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800 dark:text-emerald-300">面部预览</h3>
                {localFaceImage ? (
                  <img 
                    src={URL.createObjectURL(localFaceImage)} 
                    alt="面部预览" 
                    className="w-full max-w-xs h-48 object-cover rounded-xl mx-auto border-4 border-emerald-100 dark:border-slate-700 shadow-md"
                    style={{
                      maxWidth: '250px',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '15px',
                      border: '4px solid #ecf0f1',
                      transition: 'all 0.4s ease',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  />
                ) : (
                  <div className="w-full max-w-xs h-48 flex items-center justify-center rounded-xl mx-auto border-4 border-emerald-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-700">
                    <span className="text-slate-400">暂无图片</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800 dark:text-emerald-300">舌头预览</h3>
                {localTongueImage ? (
                  <img 
                    src={URL.createObjectURL(localTongueImage)} 
                    alt="舌头预览" 
                    className="w-full max-w-xs h-48 object-cover rounded-xl mx-auto border-4 border-emerald-100 dark:border-slate-700 shadow-md"
                    style={{
                      maxWidth: '250px',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '15px',
                      border: '4px solid #ecf0f1',
                      transition: 'all 0.4s ease',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  />
                ) : (
                  <div className="w-full max-w-xs h-48 flex items-center justify-center rounded-xl mx-auto border-4 border-emerald-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-700">
                    <span className="text-slate-400">暂无图片</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 提示信息 - 从HTML文件中提取的设计 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-amber-200 dark:border-amber-800/30 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-2xl text-amber-600 dark:text-amber-400 mt-1">ⓘ</div>
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-3 text-lg">照片拍摄提示</h4>
                <ul className="text-amber-700 dark:text-amber-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                    <span>选择光线充足的环境拍摄照片，避免逆光</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                    <span>确保面部和舌头清晰可见，避免模糊</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                    <span>避免使用滤镜或美颜功能，保持自然状态</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 mt-1">✓</span>
                    <span>舌诊照片应显示完整的舌头，包括舌尖和舌根部</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 智能诊断技术说明 - 从HTML文件中提取的设计 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-10 border border-emerald-200 dark:border-emerald-800/30 shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-2xl text-emerald-600 dark:text-emerald-400 mt-1">⚕️</div>
              <div>
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-lg">智能诊断技术</h4>
                <p className="text-emerald-700 dark:text-emerald-300">
                  我们的系统采用先进的图像识别技术和中医诊断算法，能够分析面部色泽、舌头特征等，
                  并根据中医理论生成个性化的健康评估和调理建议。传承千年中医智慧，守护现代健康。
                </p>
              </div>
            </div>
          </div>
          
          {/* 提交按钮 - 从HTML文件中提取的设计 */}
          <div className="text-center mb-12">
            <motion.button
              onClick={handleSubmit}
              className={`font-medium py-5 px-16 rounded-full text-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3 relative overflow-hidden ${
                canAnalyze 
                  ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' 
                  : 'bg-slate-300 text-white/70 cursor-not-allowed'
              }`}
              whileHover={canAnalyze ? { scale: 1.05 } : {}}
              whileTap={canAnalyze ? { scale: 0.98 } : {}}
              disabled={!canAnalyze}
              style={{
                padding: '20px 50px',
                borderRadius: '35px',
                fontSize: '1.4rem',
                fontWeight: '500',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {localLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>正在分析中...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magic"></i>
                  <span>🔍 开始分析</span>
                </>
              )}
              
              {/* 按钮悬浮动效 */}
              {canAnalyze && (
                <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine-button"></div>
                </div>
              )}
            </motion.button>
            
            {/* 显示上传状态提示 */}
            {(!localFaceImage || !localTongueImage) && !localLoading && (
              <p className="mt-4 text-lg text-amber-600 dark:text-amber-400">
                {!localFaceImage && !localTongueImage && "请上传面部和舌头照片"}
                {!localFaceImage && localTongueImage && "请上传面部照片"}
                {localFaceImage && !localTongueImage && "请上传舌头照片"}
              </p>
            )}
            
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              分析过程通常需要几秒钟时间，请耐心等待
            </p>
          </div>
        </motion.div>
      </main>

      {/* 页脚 */}
      <footer className="bg-red-800 dark:bg-slate-900 text-white py-8 mt-16 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-red-200 dark:text-slate-400">
            © 2025 传统中医面诊舌诊系统 - 传承千年中医智慧，守护现代健康
          </p>
        </div>
        
        {/* 底部装饰元素 */}
        <div className="absolute bottom-0 left-0 w-full h-12 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 Q240,10 480,30 T960,30 T1440,30" stroke="#bfa36f" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </footer>
      
      {/* 添加动画样式 */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shine-button {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
        
        .animate-shine-button {
          animation: shine-button 1.5s ease-in-out infinite;
        }
        
        #faceUpload:hover, #tongueUpload:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}