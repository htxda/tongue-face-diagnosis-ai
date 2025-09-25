import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const navigate = useNavigate();

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
          <div className="flex gap-4">
            <Link to="/chat" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium flex items-center gap-1">
              <i className="fa-solid fa-comment-medical"></i>
              健康咨询
            </Link>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium flex items-center gap-1"
            >
              <i className="fa-solid fa-arrow-left"></i>
              返回首页
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-red-800 dark:text-amber-400">关于中医面诊舌诊</h2>
          
          <div className="space-y-8">
            {/* 中医面诊简介 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-user-doctor"></i>
                中医面诊简介
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                中医面诊是中医诊断方法中的重要组成部分，通过观察患者的面部特征来判断身体内部的健康状况。中医理论认为，面部的不同部位对应着人体的不同脏腑，面部的色泽、形态等变化可以反映出相应脏腑的功能状态。
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                面诊主要观察面部的色泽、形态、表情等方面，其中色泽是最重要的观察内容。中医认为，正常的面色应该是红润有光泽，而异常的面色则可能提示不同的健康问题。
              </p>
            </motion.section>
            
            {/* 中医舌诊简介 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-tongue"></i>
                中医舌诊简介
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                舌诊是中医诊断的重要方法之一，通过观察舌头的色泽、形态、舌苔等特征来判断身体内部的健康状况。中医理论认为，舌头是人体内脏的"窗口"，舌头的变化可以直接反映出内脏的功能状态。
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                舌诊主要观察舌质、舌色、舌形、舌苔等方面。正常的舌头应该是淡红色、柔软灵活、舌苔薄白均匀。不同的舌象变化提示着不同的健康问题，如舌质淡白可能提示气血不足，舌苔黄腻可能提示湿热内蕴等。
              </p>
            </motion.section>
            
             {/* 智能诊断原理 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
            >
               <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-microchip"></i>
                智能诊断原理
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                我们的智能诊断系统结合了中医传统理论和现代计算机视觉技术，通过以下核心步骤进行分析：
              </p>
              <ol className="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-300">
                <li className="pl-2">
                  <span className="font-medium">图像采集与预处理：</span>接收用户上传的面部和舌头照片，创建HTML5 Canvas元素进行图像绘制和数据提取
                </li>
                <li className="pl-2">
                  <span className="font-medium">像素级特征分析：</span>使用Canvas API获取图片的像素数据，计算平均RGB值、亮度、饱和度、颜色分布标准差等统计特征
                </li>
                <li className="pl-2">
                  <span className="font-medium">中医特征识别：</span>基于像素分析结果，结合中医理论识别面部特征（面色、眼睛、嘴唇、整体色调）和舌头特征（舌色、舌苔、舌形、湿度）
                </li>
                <li className="pl-2">
                  <span className="font-medium">体质类型判断：</span>使用加权算法计算不同体质类型的匹配度，确定最符合的体质类型组合
                </li>
                <li className="pl-2">
                  <span className="font-medium">健康评分计算：</span>根据识别的特征和体质类型，计算综合健康评分
                </li>
                <li className="pl-2">
                  <span className="font-medium">结果生成：</span>基于分析结果，生成个性化的健康建议和调理方案
                </li>
              </ol>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4 border border-blue-200 dark:border-blue-800/30">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">关于诊断结果的说明</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  系统的诊断结果不是简单的随机生成或固定的模拟数据，而是基于以下机制：
                </p>
                <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>主要基于上传图片的实际像素特征进行分析</li>
                  <li>使用文件信息（名称、大小、修改时间）生成唯一性种子，确保不同图片产生不同结果</li>
                  <li>结合中医理论的辨证逻辑进行加权计算</li>
                  <li>添加适度的随机因素以增加结果的多样性，但保持在合理的医学范围内</li>
                </ul>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-4">
                系统能够智能识别面部和舌头的特征变化，并根据中医理论进行综合分析。虽然我们的系统能够提供有价值的健康参考信息，但仍建议在必要时咨询专业中医师的意见。</p>
            </motion.section>
             
             {/* 智能体问答系统介绍 */}
             <motion.section
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.4 }}
               className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
             >
               <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                 <i className="fa-solid fa-robot"></i>
                 智能体问答系统
               </h3>
               <p className="text-slate-600 dark:text-slate-300 mb-4">
                 我们的智能体问答系统基于中医理论知识库，能够回答用户关于中医健康、体质调理、诊断结果解读等方面的问题。系统通过以下方式提供服务：
               </p>
               <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                 <li className="pl-2">智能理解用户的健康问题，提供针对性的解答</li>
                 <li className="pl-2">结合用户的诊断结果，提供个性化的健康建议</li>
                 <li className="pl-2">解答中医基础理论问题，帮助用户了解中医知识</li>
                 <li className="pl-2">提供常见健康问题的调理方法和注意事项</li>
               </ul>
               <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-4 border border-green-200 dark:border-green-800/30">
                 <div className="flex items-center gap-2">
                   <i className="fa-solid fa-lightbulb text-green-600 dark:text-green-400"></i>
                   <h4 className="font-medium text-green-800 dark:text-green-400">使用提示</h4>
                 </div>
                 <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                   您可以通过点击顶部导航栏的"健康咨询"按钮或诊断结果页面的"咨询智能助手"按钮，与我们的智能体进行交互，获取更多健康相关的信息和建议。
                 </p>
               </div>
             </motion.section>
            
            {/* 使用注意事项 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-amber-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 flex items-center gap-2">
                <i className="fa-solid fa-circle-info"></i>
                使用注意事项
              </h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-exclamation-circle text-amber-600 dark:text-amber-400 mt-1"></i>
                  <span>本系统仅提供健康参考信息，不能替代专业医生的诊断和治疗。</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-exclamation-circle text-amber-600 dark:text-amber-400 mt-1"></i>
                  <span>如有不适症状，请及时就医，遵循专业医生的建议进行治疗。</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-exclamation-circle text-amber-600 dark:text-amber-400 mt-1"></i>
                  <span>上传的照片质量会影响诊断结果的准确性，请确保照片清晰、光线充足。</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-exclamation-circle text-amber-600 dark:text-amber-400 mt-1"></i>
                  <span>系统的诊断结果仅供参考，不应作为诊断和治疗的唯一依据。</span>
                </li>
              </ul>
            </motion.section>
            
            {/* 立即体验按钮 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center"
            >
              <motion.button
                onClick={() => navigate('/diagnosis')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fa-solid fa-stethoscope"></i>
                立即体验智能诊断
              </motion.button>
            </motion.div>
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