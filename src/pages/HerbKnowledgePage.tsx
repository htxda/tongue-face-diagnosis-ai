import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HerbKnowledgePage() {
  // 中药数据
  const herbs = [
    {
      icon: "🌿",
      name: "人参",
      effect: {
        main: "大补元气，复脉固脱，补脾益肺，生津安神。",
        symptoms: "体虚欲脱、气短乏力、脉微欲绝、脾肺虚弱、津伤口渴、心悸失眠。",
        usage: "煎汤、泡茶、炖汤、入药膳。",
        caution: "不宜与萝卜、浓茶同食，感冒发热、实热者慎用。"
      }
    },
    {
      icon: "🍂",
      name: "当归",
      effect: {
        main: "补血活血，调经止痛，润肠通便。",
        symptoms: "血虚萎黄、月经不调、痛经、闭经、跌打损伤、肠燥便秘。",
        usage: "煎汤、炖肉、泡酒、入药膳。",
        caution: "孕妇及月经过多者慎用，湿热内盛者忌服。"
      }
    },
    {
      icon: "🍃",
      name: "薄荷",
      effect: {
        main: "疏散风热，清利头目，利咽，透疹，疏肝行气。",
        symptoms: "风热感冒、头痛目赤、咽喉肿痛、麻疹初起、胸闷胁痛。",
        usage: "泡茶、煎汤、外用、入膏方。",
        caution: "气虚多汗、阴虚血燥者慎用，孕妇慎用。"
      }
    },
    {
      icon: "🍄",
      name: "灵芝",
      effect: {
        main: "补气安神，止咳平喘，益精补脑。",
        symptoms: "失眠多梦、心悸健忘、体虚乏力、咳嗽气喘。",
        usage: "煎汤、泡茶、炖汤、入药膳。",
        caution: "体质偏热、感冒发热者慎用。"
      }
    },
    {
      icon: "🌱",
      name: "艾草",
      effect: {
        main: "温经止血，散寒止痛，安胎，祛湿止痒。",
        symptoms: "月经不调、宫寒腹痛、崩漏下血、湿疹瘙痒、胎动不安。",
        usage: "艾灸、泡脚、煎汤、外敷。",
        caution: "阴虚火旺、孕妇慎用，过敏体质者慎用。"
      }
    },
    {
      icon: "🌰",
      name: "枸杞",
      effect: {
        main: "滋补肝肾，益精明目，润肺。",
        symptoms: "肝肾阴虚、腰膝酸软、头晕目眩、视力减退、虚劳咳嗽。",
        usage: "泡水、煲汤、煮粥、入药膳。",
        caution: "脾虚泄泻、感冒发热者慎用。"
      }
    },
    {
      icon: "🌾",
      name: "黄芪",
      effect: {
        main: "补气升阳，固表止汗，利尿消肿，托毒生肌。",
        symptoms: "气虚乏力、自汗、久泻脱肛、水肿、慢性溃疡不愈。",
        usage: "煎汤、炖汤、泡茶、入药膳。",
        caution: "实热、阴虚有热者慎用，感冒发热时不宜服用。"
      }
    },
    {
      icon: "🍊",
      name: "陈皮",
      effect: {
        main: "理气健脾，燥湿化痰。",
        symptoms: "脘腹胀满、食少呕吐、咳嗽痰多。",
        usage: "泡茶、煲汤、煎汤、入药膳。",
        caution: "阴虚燥咳、气虚体弱者慎用。"
      }
    },
    {
      icon: "🍄",
      name: "茯苓",
      effect: {
        main: "利水渗湿，健脾安神。",
        symptoms: "小便不利、水肿、脾虚泄泻、心悸失眠。",
        usage: "煎汤、煮粥、炖汤、入药膳。",
        caution: "阴虚口渴、虚寒滑精者慎用。"
      }
    },
    {
      icon: "🌰",
      name: "川芎",
      effect: {
        main: "活血行气，祛风止痛。",
        symptoms: "头痛、风湿痹痛、月经不调、跌打损伤。",
        usage: "煎汤、炖汤、泡酒、入药膳。",
        caution: "孕妇慎用，月经过多及出血性疾病者忌服。"
      }
    },
    {
      icon: "🍬",
      name: "甘草",
      effect: {
        main: "补脾益气，清热解毒，缓急止痛，调和诸药。",
        symptoms: "脾胃虚弱、咳嗽、咽喉肿痛、胃痛腹痛、中毒。",
        usage: "煎汤、泡茶、炖汤、入药膳。",
        caution: "高血压、水肿、孕妇慎用，忌与甘遂、大戟、芫花同用。"
      }
    },
    {
      icon: "🥔",
      name: "山药",
      effect: {
        main: "补脾养胃，生津益肺，补肾涩精。",
        symptoms: "脾虚食少、久泻、肺虚咳嗽、肾虚遗精、尿频。",
        usage: "煮粥、炖汤、煎汤、入药膳。",
        caution: "实热、湿热中阻者慎用。"
      }
    },
    {
      icon: "🌼",
      name: "菊花",
      effect: {
        main: "疏风清热，平肝明目，解毒消肿。",
        symptoms: "风热感冒、头痛眩晕、目赤肿痛、疮痈肿毒。",
        usage: "泡茶、煎汤、入药膳。",
        caution: "脾胃虚寒、阳虚体质者慎用。"
      }
    }
  ];

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
          className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-amber-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 text-red-800 dark:text-amber-400">中药知识馆</h1>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {herbs.map((herb, index) => (
              <motion.div
                key={index}
                className="bg-amber-50 dark:bg-slate-700/50 rounded-xl border border-amber-100 dark:border-slate-600 p-6 hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="text-4xl mb-4 text-center">{herb.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400 text-center">{herb.name}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-red-700 dark:text-amber-500">主要功效：</span>
                    <span className="text-slate-700 dark:text-slate-300">{herb.effect.main}</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-700 dark:text-amber-500">适用症状：</span>
                    <span className="text-slate-700 dark:text-slate-300">{herb.effect.symptoms}</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-700 dark:text-amber-500">常见用法：</span>
                    <span className="text-slate-700 dark:text-slate-300">{herb.effect.usage}</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-700 dark:text-amber-500">注意事项：</span>
                    <span className="text-slate-700 dark:text-slate-300">{herb.effect.caution}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <i className="fa-solid fa-arrow-left"></i>
              返回诊断
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