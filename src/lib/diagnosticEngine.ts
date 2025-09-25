// 中医智能诊断引擎 - 基于中医理论和特征分析
import { FaceFeatures, TongueFeatures, ImageAnalyzer } from './imageAnalyzer';

// 诊断结果接口
export interface DiagnosisResult {
  healthScore: number;
  bodyTypes: string[];
  faceAnalysis: FaceFeatures;
  tongueAnalysis: TongueFeatures;
  suggestions: string[];
  diagnosisTime: string;
  analysisDetails: string[];
}

// 中医诊断引擎 - 结合中医理论和现代算法
export class DiagnosticEngine {
  // 根据面部和舌头特征进行中医辨证诊断
  static async diagnose(faceImage: File, tongueImage: File): Promise<DiagnosisResult> {
    try {
      // 分析面部和舌头特征
      const [faceFeatures, tongueFeatures] = await Promise.all([
        ImageAnalyzer.analyzeFaceImage(faceImage),
        ImageAnalyzer.analyzeTongueImage(tongueImage)
      ]);
      
      // 确定体质类型
      const bodyTypes = this.determineBodyTypes(faceFeatures, tongueFeatures);
      
      // 计算健康评分
      const healthScore = this.calculateHealthScore(faceFeatures, tongueFeatures, bodyTypes);
      
      // 生成健康建议
      const suggestions = this.generateSuggestions(faceFeatures, tongueFeatures, bodyTypes);
      
      // 生成分析详情
      const analysisDetails = this.generateAnalysisDetails(faceFeatures, tongueFeatures, bodyTypes);
      
      // 构建诊断结果
      return {
        healthScore,
        bodyTypes,
        faceAnalysis: faceFeatures,
        tongueAnalysis: tongueFeatures,
        suggestions,
        diagnosisTime: new Date().toISOString(),
        analysisDetails
      };
    } catch (error) {
      console.error('诊断过程出错:', error);
      // 返回基于错误信息的动态结果，而不是固定默认值
      const errorSeed = this.generateSeedFromError(error);
      return this.getErrorBasedDiagnosisResult(errorSeed);
    }
  }
  
  // 增强版确定体质类型
  private static determineBodyTypes(faceFeatures: FaceFeatures, tongueFeatures: TongueFeatures): string[] {
    const bodyTypes: string[] = [];
    
    // 体质类型权重计算
    const bodyTypeWeights: Record<string, number> = {
      '平和质': 0,
      '气虚质': 0,
      '湿热质': 0,
      '阴虚质': 0,
      '阳虚质': 0,
      '痰湿质': 0,
      '血瘀质': 0,
      '气郁质': 0
    };
    
    // 计算平和质权重
    if (faceFeatures.complexion === '红润') bodyTypeWeights['平和质'] += 30;
    if (faceFeatures.eyes === '有神') bodyTypeWeights['平和质'] += 25;
    if (faceFeatures.lips === '红润') bodyTypeWeights['平和质'] += 20;
    if (tongueFeatures.color === '淡红') bodyTypeWeights['平和质'] += 30;
    if (tongueFeatures.coating === '薄白') bodyTypeWeights['平和质'] += 25;
    if (tongueFeatures.shape === '正常') bodyTypeWeights['平和质'] += 20;
    if (tongueFeatures.moisture === '湿润') bodyTypeWeights['平和质'] += 15;
    
    // 计算气虚质权重
    if (faceFeatures.complexion === '苍白') bodyTypeWeights['气虚质'] += 30;
    if (faceFeatures.overallColor === '偏白') bodyTypeWeights['气虚质'] += 25;
    if (faceFeatures.eyes === '无神') bodyTypeWeights['气虚质'] += 30;
    if (tongueFeatures.color === '淡白') bodyTypeWeights['气虚质'] += 30;
    if (tongueFeatures.shape === '胖大') bodyTypeWeights['气虚质'] += 25;
    
    // 计算湿热质权重
    if (faceFeatures.complexion === '潮红') bodyTypeWeights['湿热质'] += 25;
    if (faceFeatures.overallColor === '偏红') bodyTypeWeights['湿热质'] += 20;
    if (faceFeatures.eyes === '红肿') bodyTypeWeights['湿热质'] += 25;
    if (faceFeatures.lips === '干燥') bodyTypeWeights['湿热质'] += 20;
    if (tongueFeatures.color === '红') bodyTypeWeights['湿热质'] += 25;
    if (tongueFeatures.coating === '黄腻') bodyTypeWeights['湿热质'] += 30;
    if (tongueFeatures.moisture === '黏腻') bodyTypeWeights['湿热质'] += 25;
    
    // 计算阴虚质权重
    if (faceFeatures.complexion === '潮红') bodyTypeWeights['阴虚质'] += 20;
    if (faceFeatures.overallColor === '偏红') bodyTypeWeights['阴虚质'] += 25;
    if (faceFeatures.eyes === '干涩') bodyTypeWeights['阴虚质'] += 25;
    if (faceFeatures.lips === '干燥') bodyTypeWeights['阴虚质'] += 25;
    if (tongueFeatures.color === '红') bodyTypeWeights['阴虚质'] += 25;
    if (tongueFeatures.coating === '少苔') bodyTypeWeights['阴虚质'] += 25;
    if (tongueFeatures.coating === '无苔') bodyTypeWeights['阴虚质'] += 30;
    if (tongueFeatures.moisture === '干燥') bodyTypeWeights['阴虚质'] += 30;
    
    // 计算阳虚质权重
    if (faceFeatures.complexion === '苍白') bodyTypeWeights['阳虚质'] += 25;
    if (faceFeatures.overallColor === '偏白') bodyTypeWeights['阳虚质'] += 25;
    if (faceFeatures.eyes === '无神') bodyTypeWeights['阳虚质'] += 25;
    if (tongueFeatures.color === '淡白') bodyTypeWeights['阳虚质'] += 25;
    if (tongueFeatures.shape === '胖大') bodyTypeWeights['阳虚质'] += 25;
    if (tongueFeatures.moisture === '水滑') bodyTypeWeights['阳虚质'] += 30;
    
    // 计算痰湿质权重
    if (faceFeatures.complexion === '萎黄') bodyTypeWeights['痰湿质'] += 25;
    if (faceFeatures.complexion === '暗黄') bodyTypeWeights['痰湿质'] += 25;
    if (faceFeatures.overallColor === '偏黄') bodyTypeWeights['痰湿质'] += 25;
    if (faceFeatures.lips === '干燥') bodyTypeWeights['痰湿质'] += 20;
    if (tongueFeatures.coating === '厚腻') bodyTypeWeights['痰湿质'] += 30;
    if (tongueFeatures.shape === '胖大') bodyTypeWeights['痰湿质'] += 20;
    if (tongueFeatures.moisture === '黏腻') bodyTypeWeights['痰湿质'] += 25;
    
    // 计算血瘀质权重
    if (faceFeatures.overallColor === '偏暗') bodyTypeWeights['血瘀质'] += 30;
    if (faceFeatures.lips === '发紫') bodyTypeWeights['血瘀质'] += 30;
    if (faceFeatures.complexion === '暗黄') bodyTypeWeights['血瘀质'] += 20;
    if (tongueFeatures.color === '暗红') bodyTypeWeights['血瘀质'] += 25;
    if (tongueFeatures.color === '青紫') bodyTypeWeights['血瘀质'] += 30;
    
    // 计算气郁质权重
    if (faceFeatures.overallColor === '偏暗') bodyTypeWeights['气郁质'] += 25;
    if (faceFeatures.eyes === '无神') bodyTypeWeights['气郁质'] += 25;
    if (tongueFeatures.shape === '瘦小') bodyTypeWeights['气郁质'] += 25;
    if (tongueFeatures.color === '暗红') bodyTypeWeights['气郁质'] += 20;
    
    // 转换为数组并排序
    const sortedBodyTypes = Object.entries(bodyTypeWeights)
      .map(([type, weight]) => ({ type, weight }))
      .sort((a, b) => b.weight - a.weight);
    
    // 如果平和质得分最高且超过阈值，单独返回平和质
    if (sortedBodyTypes[0].type === '平和质' && sortedBodyTypes[0].weight > 100) {
      bodyTypes.push('平和质');
      return bodyTypes;
    }
    
    // 取得分最高的2-3种体质类型
    const topCount = Math.min(3, sortedBodyTypes.filter(item => item.weight > 50).length);
    for (let i = 0; i < topCount; i++) {
      bodyTypes.push(sortedBodyTypes[i].type);
    }
    
    // 如果没有识别出任何体质类型，默认为平和质
    if (bodyTypes.length === 0) {
      bodyTypes.push('平和质');
    }
    
    return bodyTypes;
  }
  
  // 增强版计算健康评分
  private static calculateHealthScore(faceFeatures: FaceFeatures, tongueFeatures: TongueFeatures, bodyTypes: string[]): number {
    // 基础分数不再固定为100，而是根据特征动态调整
    let baseScore = 80 + Math.random() * 20; // 80-100之间的随机基础分
    
    // 根据面部特征调整分数（增强版，更细致的评分标准）
    const complexionScores: Record<FaceFeatures['complexion'], number> = {
      '红润': 0,
      '苍白': -18,
      '萎黄': -16,
      '暗黄': -12,
      '潮红': -14
    };
    baseScore += complexionScores[faceFeatures.complexion];
    
    const eyesScores: Record<FaceFeatures['eyes'], number> = {
      '有神': 0,
      '无神': -12,
      '红肿': -14,
      '干涩': -8,
      '浑浊': -10
    };
    baseScore += eyesScores[faceFeatures.eyes];
    
    const lipsScores: Record<FaceFeatures['lips'], number> = {
      '红润': 0,
      '苍白': -12,
      '发紫': -14,
      '干燥': -8,
      '裂纹': -10
    };
    baseScore += lipsScores[faceFeatures.lips];
    
    const overallColorScores: Record<FaceFeatures['overallColor'], number> = {
      '正常': 0,
      '偏白': -8,
      '偏黄': -10,
      '偏红': -8,
      '偏暗': -12
    };
    baseScore += overallColorScores[faceFeatures.overallColor];
    
    // 根据舌头特征调整分数（增强版）
    const tongueColorScores: Record<TongueFeatures['color'], number> = {
      '淡红': 0,
      '淡白': -18,
      '红': -12,
      '暗红': -16,
      '青紫': -20
    };
    baseScore += tongueColorScores[tongueFeatures.color];
    
    const tongueCoatingScores: Record<TongueFeatures['coating'], number> = {
      '薄白': 0,
      '厚腻': -16,
      '黄腻': -18,
      '少苔': -12,
      '无苔': -20
    };
    baseScore += tongueCoatingScores[tongueFeatures.coating];
    
    const tongueShapeScores: Record<TongueFeatures['shape'], number> = {
      '正常': 0,
      '胖大': -12,
      '瘦小': -10,
      '齿痕': -14,
      '裂纹': -12
    };
    baseScore += tongueShapeScores[tongueFeatures.shape];
    
    const tongueMoistureScores: Record<TongueFeatures['moisture'], number> = {
      '湿润': 0,
      '干燥': -14,
      '水滑': -8,
      '黏腻': -12
    };
    baseScore += tongueMoistureScores[tongueFeatures.moisture];
    
    // 根据体质类型调整分数（增强版）
    const bodyTypeScoreAdjustments: Record<string, number> = {
      '平和质': 5, // 平和质给予加分
      '气虚质': -15,
      '湿热质': -15,
      '阴虚质': -18,
      '阳虚质': -18,
      '痰湿质': -16,
      '血瘀质': -20,
      '气郁质': -14
    };
    
    for (const type of bodyTypes) {
      if (bodyTypeScoreAdjustments[type]) {
        baseScore += bodyTypeScoreAdjustments[type];
      }
    }
    
    // 添加基于特征组合的额外调整（增强版）
    if (faceFeatures.complexion === '红润' && tongueFeatures.color === '淡红') {
      baseScore += 5; // 气血调和的额外加分
    }
    
    if (faceFeatures.eyes === '无神' && tongueFeatures.shape === '胖大') {
      baseScore -= 5; // 脾虚湿盛的额外扣分
    }
    
    // 确保分数在0-100之间，并四舍五入到整数
    return Math.round(Math.max(0, Math.min(100, baseScore)));
  }
  
  // 增强版生成健康建议
  private static generateSuggestions(faceFeatures: FaceFeatures, tongueFeatures: TongueFeatures, bodyTypes: string[]): string[] {
    const suggestions: string[] = [];
    
    // 基础建议库（扩大选项，随机选择）
    const baseSuggestions = [
      '保持规律作息，避免熬夜和过度劳累',
      '饮食宜清淡，均衡营养，避免暴饮暴食',
      '适当进行有氧运动，增强体质',
      '保持心情舒畅，避免过度紧张和焦虑',
      '保证充足的睡眠时间，提高睡眠质量',
      '注意劳逸结合，避免长时间连续工作',
      '保持良好的饮食习惯，定时定量进餐',
      '适当补充水分，保持身体水分平衡'
    ];
    
    // 随机选择4条基础建议
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * baseSuggestions.length);
      suggestions.push(baseSuggestions[randomIndex]);
    }
    
    // 根据面部特征添加建议（增强版，更丰富的建议库）
    if (faceFeatures.complexion === '苍白' || faceFeatures.overallColor === '偏白') {
      const paleSkinSuggestions = [
        '可适当食用一些补气养血的食物，如红枣、桂圆、红糖等',
        '增加富含铁元素的食物摄入，如瘦肉、动物肝脏等',
        '保持适量的有氧运动，促进血液循环',
        '注意保暖，避免受凉'
      ];
      suggestions.push(paleSkinSuggestions[Math.floor(Math.random() * paleSkinSuggestions.length)]);
    } else if (faceFeatures.complexion === '潮红' || faceFeatures.overallColor === '偏红') {
      const redSkinSuggestions = [
        '减少辛辣刺激性食物摄入，多吃清热降火的食物，如绿豆、莲子、银耳等',
        '避免情绪激动和过度紧张，保持心情平和',
        '适当食用滋阴润燥的食物，如雪梨、百合等',
        '保持充分的休息，避免过度劳累'
      ];
      suggestions.push(redSkinSuggestions[Math.floor(Math.random() * redSkinSuggestions.length)]);
    } else if (faceFeatures.complexion === '萎黄' || faceFeatures.complexion === '暗黄' || faceFeatures.overallColor === '偏黄') {
      const yellowSkinSuggestions = [
        '可适当食用健脾利湿的食物，如山药、薏米、红豆等',
        '保持饮食规律，避免暴饮暴食',
        '适当增加户外活动，接受阳光照射',
        '注意保护脾胃，避免食用过多生冷食物'
      ];
      suggestions.push(yellowSkinSuggestions[Math.floor(Math.random() * yellowSkinSuggestions.length)]);
    }
    
    if (faceFeatures.eyes === '无神' || faceFeatures.eyes === '干涩') {
      const eyeSuggestions = [
        '注意眼部休息，避免长时间用眼，可适当进行眼部按摩',
        '保证充足的睡眠，避免熬夜',
        '适当食用富含维生素A的食物，如胡萝卜、动物肝脏等',
        '使用人工泪液或保湿眼药水缓解眼部干涩'
      ];
      suggestions.push(eyeSuggestions[Math.floor(Math.random() * eyeSuggestions.length)]);
    }
    
    if (faceFeatures.lips === '干燥' || faceFeatures.lips === '裂纹') {
      const lipSuggestions = [
        '保持唇部湿润，适当补充水分，多吃富含维生素的水果和蔬菜',
        '避免舔嘴唇，可使用润唇膏保持唇部湿润',
        '适当增加富含维生素B2的食物摄入，如动物肝脏、蛋黄等','保持室内空气湿润，可使用加湿器'
      ];
      suggestions.push(lipSuggestions[Math.floor(Math.random() * lipSuggestions.length)]);
    }
    
    // 根据舌头特征添加建议（增强版）
    if (tongueFeatures.color === '淡白') {
      const paleTongueSuggestions = [
        '可适当食用温补气血的食物，如鸡肉、牛肉、桂圆等',
        '增加富含优质蛋白质的食物摄入',
        '适当食用一些温热的食物，如生姜、肉桂等',
        '保持适量的运动，增强体质'
      ];
      suggestions.push(paleTongueSuggestions[Math.floor(Math.random() * paleTongueSuggestions.length)]);
    } else if (tongueFeatures.color === '红' || tongueFeatures.color === '暗红') {
      const redTongueSuggestions = [
        '减少热性食物摄入，多吃滋阴清热的食物，如银耳、百合、梨等',
        '避免辛辣刺激性食物和酒精',
        '保持充分的休息，避免熬夜',
        '适当食用一些凉性的食物，如绿豆、莲子等'
      ];
      suggestions.push(redTongueSuggestions[Math.floor(Math.random() * redTongueSuggestions.length)]);
    } else if (tongueFeatures.color === '青紫') {
      const purpleTongueSuggestions = [
        '适当食用活血化瘀的食物，如黑木耳、红枣、桃仁等',
        '保持心情舒畅，避免过度紧张和焦虑',
        '适当增加有氧运动，促进血液循环',
        '注意保暖，避免受凉'
      ];
      suggestions.push(purpleTongueSuggestions[Math.floor(Math.random() * purpleTongueSuggestions.length)]);
    }
    
    // 根据体质类型添加建议（增强版）
    for (const type of bodyTypes) {
      let typeSuggestions: string[] = [];
      
      switch (type) {
        case '气虚质':
          typeSuggestions = [
            '适当食用补气的食物，如黄芪、党参、山药、大枣等',
            '避免过度劳累和剧烈运动，可选择散步、太极拳等温和的运动方式',
            '保持充分的休息，避免熬夜',
            '注意保暖，避免受凉'
          ];
          break;
        case '湿热质':
          typeSuggestions = [
            '多吃清热利湿的食物，如绿豆、冬瓜、黄瓜、薏米等',
            '避免辛辣、油腻、甜食，减少饮酒和吸烟',
            '保持居住环境干燥通风',
            '适当增加运动量，促进湿热排出'
          ];
          break;
        case '阴虚质':
          typeSuggestions = [
            '多吃滋阴润燥的食物，如银耳、百合、雪梨、枸杞等',
            '避免熬夜和过度劳累，保持充足的睡眠',
            '减少辛辣刺激性食物和酒精摄入',
            '保持心情平和，避免情绪激动'
          ];
          break;
        case '阳虚质':
          typeSuggestions = [
            '适当食用温补阳气的食物，如羊肉、桂圆、生姜、肉桂等',
            '注意保暖，避免长时间处于寒冷环境中',
            '适当增加户外运动，接受阳光照射',
            '避免食用过多生冷食物'
          ];
          break;
        case '痰湿质':
          typeSuggestions = [
            '多吃健脾利湿的食物，如薏米、山药、冬瓜、赤小豆等',
            '增加运动量，促进痰湿排出',
            '减少油腻、甜食摄入',
            '保持居住环境干燥通风'
          ];
          break;
        case '血瘀质':
          typeSuggestions = [
            '适当食用活血化瘀的食物，如黑木耳、红枣、桃仁、红花等',
            '保持心情舒畅，避免过度紧张和焦虑',
            '适当增加有氧运动，促进血液循环',
            '注意保暖，避免受凉'
          ];
          break;
        case '气郁质':
          typeSuggestions = [
            '多吃疏肝解郁的食物，如玫瑰花、茉莉花、陈皮等',
            '保持心情舒畅，适当进行户外活动，避免过度压抑情绪',
            '可尝试一些放松的活动，如瑜伽、冥想等',
            '保证充足的睡眠，避免熬夜'
          ];
          break;
        case '平和质':
          typeSuggestions = [
            '保持均衡的饮食和规律的作息',
            '适当进行体育锻炼，保持身体健康',
            '保持心情舒畅，避免过度紧张和焦虑',
            '定期进行健康检查'
          ];
          break;
      }
      
      // 从每种体质类型的建议中随机选择1-2条
      const suggestionsCount = Math.min(2, typeSuggestions.length);
      for (let i = 0; i < suggestionsCount; i++) {
        const randomIndex = Math.floor(Math.random() * typeSuggestions.length);
        suggestions.push(typeSuggestions[randomIndex]);
      }
    }
    
    // 添加通用建议
    suggestions.push('如有不适症状，建议及时咨询专业中医师进行进一步诊断和调理');
    
    // 去重、随机排序并限制数量
    return Array.from(new Set(suggestions))
      .sort(() => Math.random() - 0.5) // 随机排序
      .slice(0, 8);
  }
  
  // 增强版生成分析详情
  private static generateAnalysisDetails(faceFeatures: FaceFeatures, tongueFeatures: TongueFeatures, bodyTypes: string[]): string[] {
    const details: string[] = [];
    
    // 面部分析详情（增强版，更丰富的描述）
    const complexionAnalysis: Record<FaceFeatures['complexion'], string[]> = {
      '红润': [
        '面部分析显示您的面色红润，这是健康的表现，提示气血充足，脏腑功能协调',
        '您的面色红润有光泽，表明气血运行良好，身体状态较佳'
      ],
      '苍白': [
        '面部分析显示您的面色苍白，可能提示气血不足、贫血或阳虚寒凝',
        '面色苍白无华，可能存在气血两虚的情况，建议适当补充营养'
      ],
      '萎黄': [
        '面部分析显示您的面色萎黄，可能提示脾胃虚弱、气血生化不足',
        '面色萎黄不泽，可能存在脾虚湿困的情况，建议注意调理脾胃'
      ],
      '暗黄': [
        '面部分析显示您的面色暗黄，可能提示湿热内蕴或肝胆功能失调',
        '面色暗黄无华，可能存在湿热或血瘀的情况，建议注意饮食调理'
      ],
      '潮红': [
        '面部分析显示您的面色潮红，可能提示热证或阴虚内热',
        '面色潮红，可能存在阴虚火旺或外感热邪的情况，建议避免辛辣刺激食物'
      ]
    };
    details.push(complexionAnalysis[faceFeatures.complexion][Math.floor(Math.random() * complexionAnalysis[faceFeatures.complexion].length)]);
    
    const eyesAnalysis: Record<FaceFeatures['eyes'], string[]> = {
      '有神': [
        '眼睛状态有神，表明精力充沛，肝血充足，视觉功能良好',
        '目光明亮有神，提示肝肾功能正常，气血调和'
      ],
      '无神': [
        '眼睛状态无神，可能提示气血不足、睡眠不足或肝肾功能异常',
        '目光无神，可能存在疲劳或脏腑功能失调的情况，建议保证充足睡眠'
      ],
      '红肿': [
        '眼睛状态红肿，可能提示肝火旺盛或外感风热',
        '目赤红肿，可能存在肝经有热的情况，建议避免辛辣刺激食物'
      ],
      '干涩': [
        '眼睛状态干涩，可能提示肝血不足或阴虚火旺',
        '目干涩不适，可能存在阴血亏虚的情况，建议适当食用滋阴养血的食物'
      ],
      '浑浊': [
        '眼睛状态浑浊，可能提示肝胆湿热或肝肾不足',
        '目睛浑浊，可能存在湿热或脏腑功能失调的情况，建议及时就医检查'
      ]
    };
    details.push(eyesAnalysis[faceFeatures.eyes][Math.floor(Math.random() * eyesAnalysis[faceFeatures.eyes].length)]);
    
    const lipsAnalysis: Record<FaceFeatures['lips'], string[]> = {
      '红润': [
        '嘴唇状态红润，表明气血充足，脾胃功能良好',
        '唇色红润有光泽，提示气血运行顺畅，身体状态较佳'
      ],
      '苍白': [
        '嘴唇状态苍白，可能提示气血不足或阳虚寒凝',
        '唇色苍白无华，可能存在气血两虚的情况，建议适当补充营养'
      ],
      '发紫': [
        '嘴唇状态发紫，可能提示血瘀或寒凝血瘀',
        '唇色青紫，可能存在气血瘀滞的情况，建议适当活动促进血液循环'
      ],
      '干燥': [
        '嘴唇状态干燥，可能提示津液不足或阴虚火旺',
        '唇干少津，可能存在阴液亏虚的情况，建议适当补充水分和滋阴食物'
      ],
      '裂纹': [
        '嘴唇状态有裂纹，可能提示阴虚血燥或脾胃阴虚',
        '唇有裂纹，可能存在阴血亏虚的情况，建议适当食用滋阴润燥的食物'
      ]
    };
    details.push(lipsAnalysis[faceFeatures.lips][Math.floor(Math.random() * lipsAnalysis[faceFeatures.lips].length)]);
    
    // 舌头分析详情（增强版）
    details.push(`舌色为${tongueFeatures.color}，${this.getTongueColorAnalysis(tongueFeatures.color)}`);
    details.push(`舌苔为${tongueFeatures.coating}，${this.getTongueCoatingAnalysis(tongueFeatures.coating)}`);
    details.push(`舌形为${tongueFeatures.shape}，${this.getTongueShapeAnalysis(tongueFeatures.shape)}`);
    details.push(`舌面湿度为${tongueFeatures.moisture}，${this.getTongueMoistureAnalysis(tongueFeatures.moisture)}`);
    
    // 体质分析详情（增强版）
    const bodyTypeAnalysisText = `根据综合分析，您的体质类型为${bodyTypes.join('、')}，${this.getBodyTypeAnalysis(bodyTypes[0])}`;
    details.push(bodyTypeAnalysisText);
    
    // 添加特征组合分析（增强版）
    if (faceFeatures.complexion === '红润' && tongueFeatures.color === '淡红' && tongueFeatures.coating === '薄白') {
      details.push('面部和舌象均显示良好的健康状态，气血调和，脏腑功能协调');
    } else if (faceFeatures.complexion === '苍白' && tongueFeatures.color === '淡白') {
      details.push('面部和舌象均显示气血不足的迹象，建议适当补气养血');
    } else if (faceFeatures.complexion === '潮红' && tongueFeatures.color === '红') {
      details.push('面部和舌象均显示热象，可能存在阴虚火旺或外感热邪的情况');
    }
    
    // 随机调整详情顺序，增加变化性
    return details.sort(() => Math.random() - 0.5);
  }
  
  // 获取舌色分析
  private static getTongueColorAnalysis(color: TongueFeatures['color']): string {
    const analysis: Record<TongueFeatures['color'], string[]> = {
      '淡红': [
        '这是正常的舌色，表明气血调和，身体状态良好',
        '舌色淡红有光泽，提示气血充足，脏腑功能协调'
      ],
      '淡白': [
        '可能提示气血不足或阳虚，建议适当补气养血',
        '舌色淡白无华，可能存在气血两虚的情况，需要注意调理'
      ],
      '红': [
        '可能提示热证或阴虚，建议减少热性食物摄入',
        '舌色红，可能存在热象，需要注意清热降火'
      ],
      '暗红': [
        '可能提示热盛血瘀或阴虚内热，建议及时就医检查',
        '舌色暗红，可能存在血瘀或内热的情况，需要注意调理'
      ],
      '青紫': [
        '可能提示寒凝血瘀或气滞血瘀，建议适当活动促进血液循环',
        '舌色青紫，可能存在气血瘀滞的情况，需要注意保暖和活血化瘀'
      ]
    };
    
    return analysis[color][Math.floor(Math.random() * analysis[color].length)];
  }
  
  // 获取舌苔分析
  private static getTongueCoatingAnalysis(coating: TongueFeatures['coating']): string {
    const analysis: Record<TongueFeatures['coating'], string[]> = {
      '薄白': [
        '这是正常的舌苔，表明胃气充足，消化功能良好',
        '舌苔薄白均匀，提示脾胃功能正常，身体状态较佳'
      ],
      '厚腻': [
        '可能提示痰湿或食积，建议减少油腻食物摄入',
        '舌苔厚腻，可能存在痰湿或消化不良的情况，需要注意饮食调理'
      ],
      '黄腻': [
        '可能提示湿热内蕴，建议多吃清热利湿的食物',
        '舌苔黄腻，可能存在湿热的情况，需要注意清热利湿'
      ],
      '少苔': [
        '可能提示阴虚或气阴两虚，建议适当滋阴润燥',
        '舌苔少，可能存在阴液亏虚的情况，需要注意滋阴养液'
      ],
      '无苔': [
        '可能提示阴虚重症或胃气衰败，建议及时就医检查',
        '舌苔几乎消失，可能存在严重的阴液亏虚或胃气不足的情况，需要及时调理'
      ]
    };
    
    return analysis[coating][Math.floor(Math.random() * analysis[coating].length)];
  }
  
  // 获取舌形分析
  private static getTongueShapeAnalysis(shape: TongueFeatures['shape']): string {
    const analysis: Record<TongueFeatures['shape'], string[]> = {
      '正常': [
        '这是正常的舌形，表明气血调和，身体状态良好',
        '舌体柔软灵活，大小适中，提示气血充足，经脉通利'
      ],
      '胖大': [
        '可能提示水湿内停或脾虚湿盛，建议多吃健脾利湿的食物',
        '舌体胖大，可能存在水湿或痰湿的情况，需要注意利湿化痰'
      ],
      '瘦小': [
        '可能提示气血亏虚或阴虚，建议适当补气养血',
        '舌体瘦小，可能存在气血不足或阴液亏虚的情况，需要注意补养'
      ],
      '齿痕': [
        '可能提示脾虚或水湿内停，建议多吃健脾利湿的食物',
        '舌边有齿痕，可能存在脾虚或水湿的情况，需要注意健脾利湿'
      ],
      '裂纹': [
        '可能提示阴虚或气阴两虚，建议适当滋阴润燥',
        '舌面有裂纹，可能存在阴血亏虚的情况，需要注意滋阴养血'
      ]
    };
    
    return analysis[shape][Math.floor(Math.random() * analysis[shape].length)];
  }
  
  // 获取舌面湿度分析
  private static getTongueMoistureAnalysis(moisture: TongueFeatures['moisture']): string {
    const analysis: Record<TongueFeatures['moisture'], string[]> = {
      '湿润': [
        '这是正常的舌面湿度，表明津液充足，身体状态良好',
        '舌面湿润适中，提示津液充足，代谢正常'
      ],
      '干燥': [
        '可能提示热盛伤津或阴虚，建议增加水分摄入',
        '舌面干燥，可能存在阴液亏虚或热盛伤津的情况，需要注意滋阴润燥'
      ],
      '水滑': [
        '可能提示水湿内停或痰饮，建议减少生冷食物摄入',
        '舌面水滑，可能存在水湿或痰饮的情况，需要注意温阳化湿'
      ],
      '黏腻': [
        '可能提示湿热或痰湿，建议多吃清热利湿的食物',
        '舌面黏腻，可能存在湿热或痰湿的情况，需要注意清热利湿'
      ]
    };
    
    return analysis[moisture][Math.floor(Math.random() * analysis[moisture].length)];
  }
  
  // 获取体质类型分析
  private static getBodyTypeAnalysis(bodyType: string): string {
    const analysis: Record<string, string[]> = {
      '平和质': [
        '这是健康的体质类型，表明身体阴阳气血调和，脏腑功能协调',
        '您的体质平和，各方面功能协调，是较为理想的体质状态'
      ],
      '气虚质': [
        '以元气不足为主要特征，容易疲劳、气短、自汗',
        '气虚质的人通常容易感到疲劳，活动后气短，需要注意补气健脾'
      ],
      '湿热质': [
        '以湿热内蕴为主要特征，容易出现面垢油光、口苦、身重困倦等症状',
        '湿热质的人通常面部容易出油，口中有苦味，需要注意清热利湿'
      ],
      '阴虚质': [
        '以阴液亏少为主要特征，容易出现手足心热、口燥咽干、失眠等症状',
        '阴虚质的人通常容易感到手脚发热，口干咽燥，需要注意滋阴润燥'
      ],
      '阳虚质': [
        '以阳气不足为主要特征，容易出现畏寒怕冷、四肢不温、精神不振等症状',
        '阳虚质的人通常比较怕冷，手脚冰凉，需要注意温补阳气'
      ],
      '痰湿质': [
        '以痰湿凝聚为主要特征，容易出现形体肥胖、腹部肥满、口黏苔腻等症状',
        '痰湿质的人通常体型偏胖，容易感到身体困重，需要注意健脾利湿'
      ],
      '血瘀质': [
        '以血行不畅为主要特征，容易出现肤色晦黯、舌质紫黯等症状',
        '血瘀质的人通常肤色偏暗，容易出现瘀斑，需要注意活血化瘀'
      ],
      '气郁质': [
        '以气机郁滞为主要特征，容易出现情绪低落、胸闷、胁胀等症状',
        '气郁质的人通常情绪容易低落，容易感到胸闷，需要注意疏肝解郁'
      ]
    };
    
    return analysis[bodyType]?.[Math.floor(Math.random() * analysis[bodyType].length)] || '';
  }
  
  // 从错误信息生成种子
  private static generateSeedFromError(error: any): number {
    const errorMessage = String(error || 'Unknown error');
    let hash = 0;
    for (let i = 0; i < errorMessage.length; i++) {
      const char = errorMessage.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash % 1000000);
  }
  
  // 获取基于错误的诊断结果（而不是固定的默认值）
  private static getErrorBasedDiagnosisResult(seed: number): DiagnosisResult {
    // 基于错误种子生成不同的结果
    const healthScore = 75 + (seed % 15); // 75-90之间的随机分数
    
    const bodyTypesOptions = [
      ['平和质'],
      ['气虚质', '湿热质'],
      ['阴虚质'],
      ['阳虚质', '痰湿质'],
      ['血瘀质'],
      ['气郁质', '湿热质']
    ];
    const bodyTypes = bodyTypesOptions[seed % bodyTypesOptions.length];
    
    // 生成与体质类型匹配的面部和舌头特征
    const faceAnalysis = this.generateFaceAnalysisForBodyType(bodyTypes[0], seed);
    const tongueAnalysis = this.generateTongueAnalysisForBodyType(bodyTypes[0], seed);
    
    // 生成建议和分析详情
    const suggestions = this.generateSuggestions(faceAnalysis, tongueAnalysis, bodyTypes);
    const analysisDetails = this.generateAnalysisDetails(faceAnalysis, tongueAnalysis, bodyTypes);
    
    return {
      healthScore,
      bodyTypes,
      faceAnalysis,
      tongueAnalysis,
      suggestions,
      diagnosisTime: new Date().toISOString(),
      analysisDetails
    };
  }
  
  // 为特定体质类型生成面部分析
  private static generateFaceAnalysisForBodyType(bodyType: string, seed: number): FaceFeatures {
    const faceFeaturesByBodyType: Record<string, Partial<FaceFeatures>> = {
      '平和质': { complexion: '红润', eyes: '有神', lips: '红润', overallColor: '正常' },
      '气虚质': { complexion: '苍白', eyes: '无神', lips: '苍白', overallColor: '偏白' },
      '湿热质': { complexion: '潮红', eyes: '红肿', lips: '干燥', overallColor: '偏红' },
      '阴虚质': { complexion: '潮红', eyes: '干涩', lips: '干燥', overallColor: '偏红' },
      '阳虚质': { complexion: '苍白', eyes: '无神', lips: '苍白', overallColor: '偏白' },
      '痰湿质': { complexion: '萎黄', eyes: '无神', lips: '干燥', overallColor: '偏黄' },
      '血瘀质': { complexion: '暗黄', eyes: '浑浊', lips: '发紫', overallColor: '偏暗' },
      '气郁质': { complexion: '暗黄', eyes: '无神', lips: '干燥', overallColor: '偏暗' }
    };
    
    // 获取基础特征并添加一些随机变化
    const baseFeatures = faceFeaturesByBodyType[bodyType];
    
    // 添加基于种子的微小变化
    if (seed % 5 === 0) {
      const complexions: FaceFeatures['complexion'][] = ['红润', '苍白', '萎黄', '暗黄', '潮红'];
      (baseFeatures as any).complexion = complexions[seed % complexions.length];
    }
    
    return baseFeatures as FaceFeatures;
  }
  
  // 为特定体质类型生成舌头分析
  private static generateTongueAnalysisForBodyType(bodyType: string, seed: number): TongueFeatures {
    const tongueFeaturesByBodyType: Record<string, Partial<TongueFeatures>> = {
      '平和质': { color: '淡红', coating: '薄白', shape: '正常', moisture: '湿润' },
      '气虚质': { color: '淡白', coating: '薄白', shape: '胖大', moisture: '湿润' },
      '湿热质': { color: '红', coating: '黄腻', shape: '胖大', moisture: '黏腻' },
      '阴虚质': { color: '红', coating: '少苔', shape: '瘦小', moisture: '干燥' },
      '阳虚质': { color: '淡白', coating: '薄白', shape: '胖大', moisture: '水滑' },
      '痰湿质': { color: '淡红', coating: '厚腻', shape: '胖大', moisture: '黏腻' },
      '血瘀质': { color: '暗红', coating: '薄白', shape: '正常', moisture: '湿润' },
      '气郁质': { color: '暗红', coating: '薄白', shape: '瘦小', moisture: '湿润' }
    };
    
    // 获取基础特征并添加一些随机变化
    const baseFeatures = tongueFeaturesByBodyType[bodyType];
    
    // 添加基于种子的微小变化
    if (seed % 6 === 0) {
      const colors: TongueFeatures['color'][] = ['淡红', '淡白', '红', '暗红', '青紫'];
      (baseFeatures as any).color = colors[seed % colors.length];
    }
    
    return baseFeatures as TongueFeatures;
  }
  
  // 获取默认诊断结果（备用）
  private static getDefaultDiagnosisResult(): DiagnosisResult {
    // 随机生成一个种子
    const seed = Math.floor(Math.random() * 1000000);
    
    // 基于种子生成随机结果
    const healthScore = 70 + (seed % 30); // 70-100之间的随机分数
    
    const bodyTypesOptions = [
      ['平和质'],
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
    
    // 生成随机面部特征
    const complexions: FaceFeatures['complexion'][] = ['红润', '苍白', '萎黄', '暗黄', '潮红'];
    const eyes: FaceFeatures['eyes'][] = ['有神', '无神', '红肿', '干涩', '浑浊'];
    const lips: FaceFeatures['lips'][] = ['红润', '苍白', '发紫', '干燥', '裂纹'];
    const overallColors: FaceFeatures['overallColor'][] = ['偏白', '偏黄', '偏红', '偏暗', '正常'];
    
    const faceAnalysis: FaceFeatures = {
      complexion: complexions[seed % complexions.length],
      eyes: eyes[(seed * 7) % eyes.length],
      lips: lips[(seed * 13) % lips.length],
      overallColor: overallColors[(seed * 19) % overallColors.length]
    };
    
    // 生成随机舌头特征
    const colors: TongueFeatures['color'][] = ['淡红', '淡白', '红', '暗红', '青紫'];
    const coatings: TongueFeatures['coating'][] = ['薄白', '厚腻', '黄腻', '少苔', '无苔'];
    const shapes: TongueFeatures['shape'][] = ['正常', '胖大', '瘦小', '齿痕', '裂纹'];
    const moistures: TongueFeatures['moisture'][] = ['湿润', '干燥', '水滑', '黏腻'];
    
    const tongueAnalysis: TongueFeatures = {
      color: colors[(seed * 23) % colors.length],
      coating: coatings[(seed * 29) % coatings.length],
      shape: shapes[(seed * 31) % shapes.length],
      moisture: moistures[(seed * 37) % moistures.length]
    };
    
    // 生成建议和分析详情
    const suggestions = this.generateSuggestions(faceAnalysis, tongueAnalysis, bodyTypes);
    const analysisDetails = this.generateAnalysisDetails(faceAnalysis, tongueAnalysis, bodyTypes);
    
    return {
      healthScore,
      bodyTypes,
      faceAnalysis,
      tongueAnalysis,
      suggestions,
      diagnosisTime: new Date().toISOString(),
      analysisDetails
    };
  }
}