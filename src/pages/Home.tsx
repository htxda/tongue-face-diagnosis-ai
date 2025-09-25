import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
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
              <Link to="/about" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
                了解更多
              </Link>
              <Link to="/chat" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
                健康咨询
              </Link>
              <Link to="/herb-contradictions" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
                十八反十九畏
              </Link>
              <Link to="/seasonal-herbs" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
                季节药膳
              </Link>
              <Link to="/herb-knowledge" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
                中药知识馆
              </Link>
            </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        {/* 英雄区域 */}
        <section className="mb-16 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-red-800 dark:text-amber-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            智能中医面诊舌诊
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            通过上传面部和舌头照片，获取中医健康分析和个性化建议，轻松掌握自身健康状况
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/diagnosis" 
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto w-fit"
            >
              <i className="fa-solid fa-stethoscope"></i>
              开始诊断
            </Link>
          </motion.div>
        </section>

        {/* 功能介绍 */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "fa-camera",
                title: "简单操作",
                description: "只需上传两张照片，面部和舌头，即可快速获得诊断结果"
              },
              {
                icon: "fa-user-md",
                title: "专业分析",
                description: "基于中医理论，结合现代科技，提供专业的健康状况评估"
              },
              {
                icon: "fa-heart",
                title: "健康建议",
                description: "根据诊断结果，提供个性化的中医调理建议和生活方式指导"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-amber-200 dark:border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <i className={`fa-solid ${feature.icon} text-red-600 dark:text-red-400 text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-amber-400">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 诊断流程 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-red-800 dark:text-amber-400">诊断流程</h2>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-red-200 dark:bg-red-900/30 transform -translate-x-1/2"></div>
            <div className="space-y-10 relative">
              {[
                {
                  step: "1",
                  title: "上传面部照片",
                  description: "选择一张清晰的正面面部照片，光线充足，避免遮挡"
                },
                {
                  step: "2",
                  title: "上传舌头照片",
                  description: "选择一张清晰的舌头照片，自然伸出，光线充足"
                },
                {
                  step: "3",
                  title: "等待分析",
                  description: "系统将自动分析您的照片，并根据中医理论生成诊断结果"
                },
                {
                  step: "4",
                  title: "查看报告",
                  description: "获取详细的健康分析报告和个性化的中医调理建议"
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col md:flex-row items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} mb-4 md:mb-0`}>
                    <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-amber-400">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                  </div>
                  <div className="z-10 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xl">
                    {step.step}
                  </div>
                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

         {/* 立即开始 */}
        <section className="text-center">
          <motion.div
            className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-slate-700"
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-red-800 dark:text-amber-400">准备好了解您的健康状况了吗？</h2>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              立即开始智能中医诊断，获取专业的健康分析和建议
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/diagnosis" 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
              >
                <i className="fa-solid fa-stethoscope"></i>
                立即开始诊断
              </Link>
              <Link 
                to="/chat" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
              >
                <i className="fa-solid fa-comment-medical"></i>
                咨询智能助手
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-red-800 dark:bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">中医智能诊断系统 © 2025</p>
          <p className="text-sm text-red-200 dark:text-slate-400">
            免责声明：本系统仅供参考，不能替代专业医生诊断
          </p>
        </div>
      </footer>
    </div>
  );
}