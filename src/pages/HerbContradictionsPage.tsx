import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HerbContradictionsPage() {
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
            <Link to="/" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
              首页
            </Link>
            <Link to="/about" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
              了解更多
            </Link>
            <Link to="/chat" className="px-4 py-2 bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-400 rounded-full hover:bg-red-200 dark:hover:bg-slate-600 transition-colors font-medium">
              健康咨询
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 text-red-800 dark:text-amber-400">十八反十九畏详解</h1>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">什么是十八反十九畏</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
              十八反和十九畏是中药配伍禁忌的重要理论，用于指导临床用药安全。"十八反"指某些药物合用会产生剧烈毒副作用，
              "十九畏"指某些药物合用会相互抵消或减弱药效。
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              这些理论源于古代医家经验总结，是中医用药的重要原则，对于保障临床用药安全具有重要意义。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">十八反详解</h2>
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">甘草反甘遂、大戟、海藻、芫花</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  歌诀：本草明言十八反，半蒌贝蔹及攻乌，藻戟遂芫俱战草，诸般熬石不顺情。
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  甘草与甘遂、大戟、海藻、芫花同用，会产生剧烈毒性反应，严重时可危及生命。
                </p>
              </div>

              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">乌头反贝母、瓜蒌、半夏、白蔹、白及</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  歌诀：本草明言十八反，半蒌贝蔹及攻乌，藻戟遂芫俱战草，诸般熬石不顺情。
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  乌头（包括川乌、草乌、附子）与贝母、瓜蒌、半夏、白蔹、白及同用，会增强毒性，引起中毒反应。
                </p>
              </div>

              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">藜芦反人参、沙参、丹参、玄参、细辛、芍药</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  歌诀：本草明言十八反，半蒌贝蔹及攻乌，藻戟遂芫俱战草，诸般熬石不顺情。
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  藜芦与人参、沙参、丹参、玄参、细辛、芍药同用，会产生毒副作用，影响药效发挥。
                </p>
              </div>

              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">其他反药</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  除上述主要反药外，还有其他一些药物配伍禁忌，需要在临床应用中特别注意。
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">十九畏详解</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { a: "硫黄", b: "朴硝", desc: "硫黄畏朴硝，合用增强泻下作用，易伤正气" },
                  { a: "水银", b: "砒霜", desc: "水银畏砒霜，合用毒性增强" },
                  { a: "狼毒", b: "密陀僧", desc: "狼毒畏密陀僧，合用药效降低" },
                  { a: "巴豆", b: "牵牛", desc: "巴豆畏牵牛，合用剧烈泻下，易伤脾胃" },
                  { a: "丁香", b: "郁金", desc: "丁香畏郁金，合用药效降低" },
                  { a: "川乌、草乌", b: "犀角", desc: "川乌、草乌畏犀角，合用药效降低" },
                  { a: "牙硝", b: "三棱", desc: "牙硝畏三棱，合用药效降低" },
                  { a: "官桂", b: "石脂", desc: "官桂畏石脂，合用药效降低" },
                  { a: "人参", b: "五灵脂", desc: "人参畏五灵脂，合用药效降低" }
                ].map((pair, index) => (
                  <div key={index} className="bg-amber-50 dark:bg-slate-700/50 p-6 rounded-xl border border-amber-100 dark:border-slate-600">
                    <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-amber-400">
                      {pair.a} 畏 {pair.b}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      {pair.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">临床应用与注意事项</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
                <p className="text-slate-700 dark:text-slate-300">
                  严格遵守十八反十九畏原则，避免配伍禁忌药物同用。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
                <p className="text-slate-700 dark:text-slate-300">
                  在特殊情况下，有经验的中医师可根据病情需要，谨慎配伍使用某些反畏药物，但需严格控制剂量和用法。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
                <p className="text-slate-700 dark:text-slate-300">
                  现代药理研究对十八反十九畏有了新的认识，临床应用时应结合现代研究成果综合判断。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</div>
                <p className="text-slate-700 dark:text-slate-300">
                  患者在服用中药时，应告知医师正在使用的其他药物，避免无意中产生配伍禁忌。
                </p>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i>
              返回主页面
            </Link>
          </div>
        </motion.div>
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