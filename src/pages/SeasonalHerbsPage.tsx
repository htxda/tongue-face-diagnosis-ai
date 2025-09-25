import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SeasonalHerbsPage() {
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
            <h1 className="text-3xl font-bold mb-4 text-red-800 dark:text-amber-400">中医季节药膳</h1>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">什么是季节药膳</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
              季节药膳是根据中医"天人合一"理论，结合四季气候变化和人体生理特点，选择相应的食材和药材制作的具有调理作用的膳食。
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              通过合理搭配食材和药材，季节药膳可以增强人体适应能力，预防疾病，达到养生保健的目的。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">四季养生原理</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">春季养肝</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  春季属木，与肝相应。宜食绿色蔬菜，疏肝理气，如韭菜、芹菜、菠菜等，配以养肝血的枸杞、当归等。
                </p>
              </div>
              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">夏季养心</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  夏季属火，与心相应。宜食清热解暑之品，如绿豆、西瓜、苦瓜等，配以养心安神的莲子、百合等。
                </p>
              </div>
              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">秋季养肺</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  秋季属金，与肺相应。宜食润燥生津之品，如梨、银耳、百合等，配以滋阴润肺的沙参、麦冬等。
                </p>
              </div>
              <div className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                <h3 className="text-xl font-semibold mb-3 text-red-800 dark:text-amber-400">冬季养肾</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  冬季属水，与肾相应。宜食温补之品，如羊肉、核桃、黑芝麻等，配以补肾壮阳的肉桂、杜仲等。
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">四季药膳推荐</h2>
            <div className="space-y-8">
              {/* 春季药膳 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 border-l-4 border-red-600 pl-3">春季药膳</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "枸杞叶猪肝汤",
                      ingredients: "枸杞叶100g，猪肝150g，生姜3片",
                      effect: "补肝明目，养血润燥。适用于肝血不足引起的视力模糊、头晕等症状。"
                    },
                    {
                      name: "薄荷菊花茶",
                      ingredients: "薄荷叶5g，菊花10g，蜂蜜适量",
                      effect: "疏风清热，清利头目。适用于春季风热感冒、头痛目赤等症状。"
                    },
                    {
                      name: "韭菜炒鸡蛋",
                      ingredients: "韭菜200g，鸡蛋2个，食用油适量",
                      effect: "温肾助阳，行气活血。适用于肾阳不足、气血瘀滞等症状。"
                    },
                    {
                      name: "芹菜粥",
                      ingredients: "芹菜100g，粳米100g",
                      effect: "清热平肝，祛风利湿。适用于高血压、头晕头痛等症状。"
                    },
                    {
                      name: "菠菜猪血汤",
                      ingredients: "菠菜200g，猪血150g，生姜3片",
                      effect: "养血润燥，通便排毒。适用于血虚便秘、面色萎黄等症状。"
                    }
                  ].map((dish, index) => (
                    <div key={index} className="bg-amber-50 dark:bg-slate-700/50 p-6 rounded-xl border border-amber-100 dark:border-slate-600">
                      <h4 className="text-lg font-semibold mb-2 text-red-700 dark:text-amber-500">{dish.name}</h4>
                      <p className="text-slate-700 dark:text-slate-300 mb-2">
                        <span className="font-medium">材料：</span>{dish.ingredients}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium">功效：</span>{dish.effect}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 夏季药膳 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 border-l-4 border-red-600 pl-3">夏季药膳</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "绿豆汤",
                      ingredients: "绿豆100g，冰糖适量",
                      effect: "清热解毒，消暑利水。适用于夏季中暑、口渴烦躁等症状。"
                    },
                    {
                      name: "银耳莲子汤",
                      ingredients: "银耳20g，莲子30g，冰糖适量",
                      effect: "滋阴润燥，养心安神。适用于心烦失眠、口干舌燥等症状。"
                    },
                    {
                      name: "苦瓜炒鸡蛋",
                      ingredients: "苦瓜200g，鸡蛋2个，食用油适量",
                      effect: "清热解暑，明目解毒。适用于夏季热病、中暑烦渴等症状。"
                    },
                    {
                      name: "西瓜翠衣汤",
                      ingredients: "西瓜翠衣（西瓜皮）200g，瘦肉100g",
                      effect: "清热解暑，利尿消肿。适用于夏季暑热、小便不利等症状。"
                    },
                    {
                      name: "冬瓜薏米汤",
                      ingredients: "冬瓜300g，薏米50g，瘦肉100g",
                      effect: "清热利湿，健脾消肿。适用于湿热内蕴、水肿等症状。"
                    }
                  ].map((dish, index) => (
                    <div key={index} className="bg-amber-50 dark:bg-slate-700/50 p-6 rounded-xl border border-amber-100 dark:border-slate-600">
                      <h4 className="text-lg font-semibold mb-2 text-red-700 dark:text-amber-500">{dish.name}</h4>
                      <p className="text-slate-700 dark:text-slate-300 mb-2">
                        <span className="font-medium">材料：</span>{dish.ingredients}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium">功效：</span>{dish.effect}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 秋季药膳 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 border-l-4 border-red-600 pl-3">秋季药膳</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "川贝炖雪梨",
                      ingredients: "川贝母5g，雪梨1个，冰糖适量",
                      effect: "润肺止咳，化痰平喘。适用于秋季燥咳、痰少质黏等症状。"
                    },
                    {
                      name: "百合莲子粥",
                      ingredients: "百合30g，莲子30g，粳米100g",
                      effect: "滋阴润燥，养心安神。适用于秋燥伤津、心烦失眠等症状。"
                    },
                    {
                      name: "银耳枸杞汤",
                      ingredients: "银耳20g，枸杞15g，冰糖适量",
                      effect: "滋阴润肺，益精明目。适用于肺燥干咳、视力模糊等症状。"
                    },
                    {
                      name: "沙参玉竹汤",
                      ingredients: "沙参15g，玉竹15g，瘦肉200g",
                      effect: "养阴润燥，生津止渴。适用于秋燥伤津、口干咽燥等症状。"
                    },
                    {
                      name: "杏仁炖雪耳",
                      ingredients: "杏仁10g，雪耳20g，冰糖适量",
                      effect: "润肺化痰，止咳平喘。适用于燥咳痰黏、胸闷气喘等症状。"
                    }
                  ].map((dish, index) => (
                    <div key={index} className="bg-amber-50 dark:bg-slate-700/50 p-6 rounded-xl border border-amber-100 dark:border-slate-600">
                      <h4 className="text-lg font-semibold mb-2 text-red-700 dark:text-amber-500">{dish.name}</h4>
                      <p className="text-slate-700 dark:text-slate-300 mb-2">
                        <span className="font-medium">材料：</span>{dish.ingredients}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium">功效：</span>{dish.effect}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 冬季药膳 */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-amber-400 border-l-4 border-red-600 pl-3">冬季药膳</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "当归生姜羊肉汤",
                      ingredients: "当归10g，生姜30g，羊肉500g",
                      effect: "温中补血，祛寒止痛。适用于血虚寒凝、腹痛肢冷等症状。"
                    },
                    {
                      name: "核桃仁粥",
                      ingredients: "核桃仁30g，粳米100g，红糖适量",
                      effect: "补肾固精，温肺定喘。适用于肾虚腰痛、肺肾两虚等症状。"
                    },
                    {
                      name: "杜仲猪腰汤",
                      ingredients: "杜仲15g，猪腰1对，生姜3片",
                      effect: "补肾强腰，壮筋骨。适用于肾虚腰痛、筋骨无力等症状。"
                    },
                    {
                      name: "肉桂炖牛肉",
                      ingredients: "肉桂3g，牛肉300g，胡萝卜100g",
                      effect: "温肾助阳，补中益气。适用于肾阳不足、畏寒肢冷等症状。"
                    },
                    {
                      name: "黑芝麻糊",
                      ingredients: "黑芝麻100g，糯米粉50g，红糖适量",
                      effect: "补肝肾，益精血，润肠燥。适用于肝肾不足、须发早白等症状。"
                    }
                  ].map((dish, index) => (
                    <div key={index} className="bg-amber-50 dark:bg-slate-700/50 p-6 rounded-xl border border-amber-100 dark:border-slate-600">
                      <h4 className="text-lg font-semibold mb-2 text-red-700 dark:text-amber-500">{dish.name}</h4>
                      <p className="text-slate-700 dark:text-slate-300 mb-2">
                        <span className="font-medium">材料：</span>{dish.ingredients}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium">功效：</span>{dish.effect}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">药膳制作要点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "选材新鲜",
                  desc: "选择新鲜、优质的食材和药材，确保药膳的营养价值和功效。"
                },
                {
                  title: "搭配合理",
                  desc: "根据个人体质和季节特点，合理搭配食材和药材，避免相克。"
                },
                {
                  title: "火候适宜",
                  desc: "掌握适当的火候和时间，既要保证食材熟透，又要保留营养成分。"
                },
                {
                  title: "适量食用",
                  desc: "药膳虽好，但不宜过量食用，应根据个人情况适量调整。"
                }
              ].map((point, index) => (
                <div key={index} className="bg-red-50 dark:bg-slate-700/50 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                  <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-amber-400">{point.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-amber-500">使用建议</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
                <p className="text-slate-700 dark:text-slate-300">
                  根据个人体质选择合适的药膳，避免盲目跟风。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
                <p className="text-slate-700 dark:text-slate-300">
                  孕妇、儿童、老年人及慢性病患者应在医师指导下使用。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
                <p className="text-slate-700 dark:text-slate-300">
                  药膳不能替代药物治疗，有疾病应及时就医。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</div>
                <p className="text-slate-700 dark:text-slate-300">
                  食用药膳期间如出现不适，应立即停止并咨询医师。
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">5</div>
                <p className="text-slate-700 dark:text-slate-300">
                  注意药膳的保存方法，避免变质影响效果。
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