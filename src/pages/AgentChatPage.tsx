import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DiagnosisContext } from '../App';

// 对话历史上下文接口
interface ConversationContext {
  diagnosis?: {
    score: number;
    bodyTypes: string[];
    faceAnalysis: any;
    tongueAnalysis: any;
  };
  symptoms?: string[];
  recentTopics?: string[];
  lastMessage?: string;
}

// 中医知识库类型定义
interface BodyTypeInfo {
  characteristics: string;
  recommendations: string;
  foods?: string;
}

interface ConditionInfo {
  description: string;
  recommendations: string[];
  foods: string;
}

interface ChineseMedicineKnowledgeBase {
  bodyTypes: Record<string, BodyTypeInfo>;
  commonConditions: Record<string, ConditionInfo>;
  theories: Record<string, string>;
}

// 中医知识库 - 扩充版
const chineseMedicineKnowledgeBase: ChineseMedicineKnowledgeBase = {
  // 体质类型详细信息
  bodyTypes: {
    '平和质': {
      characteristics: '阴阳气血调和，体态适中，面色红润，精力充沛，食欲良好，睡眠正常，二便调和，舌色淡红，苔薄白。',
      recommendations: '保持均衡饮食，规律作息，适量运动，保持心情舒畅，定期体检。'
    },
    '气虚质': {
      characteristics: '元气不足，容易疲劳，气短懒言，精神不振，易出汗，舌淡苔白，脉弱。',
      recommendations: '补气健脾，可食用黄芪、党参、山药、大枣等补气食物。避免过度劳累，适量运动如散步、太极拳等。',
      foods: '黄芪鸡汤、山药粥、大枣茶、莲子百合粥、牛肉汤'
    },
    '湿热质': {
      characteristics: '湿热内蕴，面垢油光，口苦口干，身重困倦，大便黏滞，小便短黄，舌红苔黄腻。',
      recommendations: '清热利湿，可食用绿豆、冬瓜、黄瓜、薏米等清热利湿食物。减少辛辣、油腻、甜食摄入，增加运动量。',
      foods: '绿豆汤、冬瓜排骨汤、薏米粥、凉拌黄瓜、菊花茶'
    },
    '阴虚质': {
      characteristics: '阴液亏少，手足心热，口燥咽干，失眠多梦，大便干结，舌红少苔或无苔。',
      recommendations: '滋阴润燥，可食用银耳、百合、雪梨、枸杞、桑椹等滋阴食物。避免熬夜和过度劳累，保持心情平和。',
      foods: '银耳百合羹、雪梨炖川贝、枸杞菊花茶、桑椹粥、莲子羹'
    },
    '阳虚质': {
      characteristics: '阳气不足，畏寒怕冷，四肢不温，精神不振，大便稀溏，小便清长，舌淡胖嫩。',
      recommendations: '温补阳气，可食用羊肉、桂圆、生姜、肉桂等温补食物。注意保暖，增加户外运动，避免生冷食物。',
      foods: '羊肉汤、桂圆红枣茶、生姜红糖水、当归生姜羊肉汤、栗子粥'
    },
    '痰湿质': {
      characteristics: '痰湿凝聚，形体肥胖，腹部肥满，口黏苔腻，大便黏滞，容易困倦。',
      recommendations: '健脾利湿，可食用薏米、山药、冬瓜、赤小豆等健脾利湿食物。增加运动量，减少油腻、甜食摄入。',
      foods: '薏米红豆粥、山药冬瓜汤、荷叶茶、陈皮茶、白萝卜汤'
    },
    '血瘀质': {
      characteristics: '血行不畅，肤色晦黯，舌质紫黯，有瘀斑，女性可能出现痛经、经色紫暗有块。',
      recommendations: '活血化瘀，可食用黑木耳、红枣、桃仁、红花等活血化瘀食物。保持心情舒畅，增加有氧运动。',
      foods: '黑木耳红枣汤、桃仁粥、红花茶、山楂茶、当归鸡汤'
    },
    '气郁质': {
      characteristics: '气机郁滞，情绪低落，胸闷，胁胀，容易叹息，舌淡红，苔薄白。',
      recommendations: '疏肝解郁，可食用玫瑰花、茉莉花、陈皮、薄荷等疏肝解郁食物。保持心情舒畅，适当户外活动。',
      foods: '玫瑰茶、茉莉花茶、陈皮粥、薄荷茶、合欢花粥'
    }
  },
  
  // 常见病症及其调理方法
  commonConditions: {
    '失眠': {
      description: '中医认为失眠多与心脾肝肾及阴血不足有关，常见证型有心脾两虚、阴虚火旺、肝郁化火、痰热内扰等。',
      recommendations: [
        '保持规律作息，睡前避免使用电子设备，创造安静舒适的睡眠环境。',
        '晚餐宜清淡，避免过饱，睡前2小时不要进食。',
        '可尝试睡前泡脚15-20分钟，水温以40-45℃为宜。',
        '适度食用莲子、百合、酸枣仁、桂圆等养心安神的食物。',
        '睡前可进行深呼吸、冥想等放松练习，帮助缓解压力和焦虑。',
        '避免咖啡、茶、酒精等刺激性饮品，特别是下午和晚上。'
      ],
      foods: '莲子百合粥、酸枣仁汤、桂圆红枣茶、小米粥、桑椹膏'
    },
    '脾胃不好': {
      description: '脾胃为后天之本，脾胃不好主要表现为食欲不振、消化不良、腹胀、腹泻或便秘等症状。',
      recommendations: [
        '饮食规律，定时定量，避免暴饮暴食或过度饥饿。',
        '减少生冷、油腻、辛辣、刺激性食物的摄入，避免过度饮酒。',
        '饭后适当散步，避免立即躺下或剧烈运动。',
        '可食用山药、薏米、茯苓、莲子、红枣等健脾益胃的食物。',
        '保持心情舒畅，避免过度思虑和情绪波动。',
        '注意腹部保暖，避免受凉。'
      ],
      foods: '山药粥、薏米莲子粥、茯苓糕、红枣桂圆汤、小米南瓜粥'
    },
    '湿气重': {
      description: '湿气重多因脾胃运化失常所致，主要表现为头身困重、肢体倦怠、口中黏腻、大便黏滞、舌苔厚腻等症状。',
      recommendations: [
        '减少甜食、油腻、生冷食物的摄入，这些食物容易加重湿气。',
        '增加运动，如快走、慢跑、瑜伽等，促进湿气排出。',
        '可食用红豆、薏米、冬瓜、玉米须、荷叶等利湿食物。',
        '保持居住环境干燥，避免潮湿，适当通风。',
        '避免过度贪凉，特别是夏季不要长时间待在空调房间。',
        '保证充足的睡眠，避免熬夜。'
      ],
      foods: '红豆薏米粥、冬瓜排骨汤、玉米须茶、荷叶茶、白萝卜汤'
    },
    '气血不足': {
      description: '气血不足是中医常见的证候，主要表现为面色苍白或萎黄、头晕乏力、心悸气短、失眠多梦、月经量少等症状。',
      recommendations: [
        '饮食上可多食用红枣、桂圆、阿胶、瘦肉、动物肝脏等补气血的食物。',
        '保持充足的睡眠，避免过度劳累和熬夜。',
        '适度运动，如散步、太极拳、瑜伽等，但避免过度消耗。',
        '保持心情舒畅，避免过度思虑和情绪波动。',
        '可在中医师指导下使用补气养血的中药调理。',
        '注意保暖，避免受凉。'
      ],
      foods: '红枣桂圆汤、阿胶固元膏、当归鸡汤、黑芝麻糊、红糖鸡蛋'
    },
    '上火': {
      description: '上火是中医术语，分为实火和虚火，主要表现为口干舌燥、咽喉肿痛、口腔溃疡、便秘、目赤肿痛等症状。',
      recommendations: [
        '减少辛辣、油腻、刺激性食物的摄入，避免饮酒和吸烟。',
        '增加水分摄入，多喝温水，可适当饮用清热降火的茶。',
        '多吃清热降火的食物，如绿豆、莲子、银耳、梨、西瓜等。',
        '保持充足的睡眠，避免熬夜和过度劳累。',
        '保持心情平和，避免情绪激动和紧张。',
        '注意口腔卫生，保持大便通畅。'
      ],
      foods: '绿豆汤、莲子银耳羹、冰糖雪梨、菊花茶、金银花茶'
    },
    '便秘': {
      description: '便秘是常见的消化系统问题，中医认为多与肠热津亏、气机郁滞、气血不足等有关。',
      recommendations: [
        '增加膳食纤维的摄入，多吃蔬菜、水果、全谷物等。',
        '保证充足的水分摄入，每天饮水量不少于1500ml。',
        '养成定时排便的习惯，即使没有便意也可定时去厕所尝试。',
        '适当增加运动，促进肠道蠕动。',
        '避免久坐不动，每隔一段时间起身活动。',
        '可食用蜂蜜、香蕉、火龙果、酸奶等有助于通便的食物。'
      ],
      foods: '蜂蜜水、香蕉、火龙果、酸奶、燕麦粥、红薯'
    },
    '月经不调': {
      description: '月经不调是女性常见的妇科问题，中医认为多与气血失调、肝郁气滞、肾虚等有关。',
      recommendations: [
        '保持心情舒畅，避免过度紧张和情绪波动。',
        '注意保暖，特别是腹部和脚部，避免受凉。',
        '避免过度劳累和熬夜，保证充足的睡眠。',
        '饮食规律，避免生冷、辛辣、刺激性食物。',
        '适当食用红枣、桂圆、枸杞、当归等补气血的食物。',
        '经期避免剧烈运动和性生活。'
      ],
      foods: '红枣桂圆汤、当归鸡汤、枸杞红枣茶、红糖姜水、黑豆粥'
    }
  },
  
  // 中医理论知识
  theories: {
    '阴阳五行': '阴阳五行学说是中医理论的基础，认为宇宙万物都是由阴阳两种对立统一的物质组成，五行（木、火、土、金、水）是构成世界的基本元素，它们之间相互滋生、相互制约。中医通过调整阴阳平衡、五行生克来治疗疾病。',
    '脏腑功能': '中医的脏腑概念不仅指解剖学上的器官，更强调其生理功能。五脏（心、肝、脾、肺、肾）主藏精气，六腑（胆、胃、小肠、大肠、膀胱、三焦）主传化物。脏腑之间通过经络相互联系，形成一个有机的整体。',
    '气血津液': '气血津液是构成人体和维持人体生命活动的基本物质。气具有推动、温煦、防御、固摄、气化等作用；血具有濡养、滋润等作用；津液具有滋润、濡养、化生血液等作用。气血津液的生成、运行和代谢与脏腑功能密切相关。',
    '经络学说': '经络是人体运行气血、联络脏腑、沟通内外、贯穿上下的通道。经络系统包括十二经脉、奇经八脉、十五络脉以及经筋、皮部等。经络学说在中医诊断和治疗中具有重要地位，特别是针灸、推拿等治疗方法都基于经络学说。',
    '辨证施治': '辨证施治是中医诊疗的基本原则，通过望、闻、问、切四诊收集患者的症状和体征，进行综合分析，辨别证型，然后制定相应的治疗方案。同病异治、异病同治是辨证施治的具体体现。'
  }
};

// 意图分类器 - 更智能的意图识别
const intentClassifier = {
  // 实体识别
  extractEntities(text: string): {[key: string]: string[]} {
    const entities: {[key: string]: string[]} = {
      symptoms: [],
      bodyTypes: [],
      conditions: [],
      foods: []
    };
    
    // 提取症状实体
    const symptomKeywords = ['失眠', '头痛', '胃痛', '腹泻', '便秘', '疲劳', '乏力', '发热', '咳嗽', '咽痛'];
    symptomKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        entities.symptoms.push(keyword);
      }
    });
    
    // 提取体质类型实体
    const bodyTypeKeywords = Object.keys(chineseMedicineKnowledgeBase.bodyTypes);
    bodyTypeKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        entities.bodyTypes.push(keyword);
      }
    });
    
    // 提取病症实体
    const conditionKeywords = Object.keys(chineseMedicineKnowledgeBase.commonConditions);
    conditionKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        entities.conditions.push(keyword);
      }
    });
    
    // 提取食物实体
    const foodKeywords = ['红枣', '桂圆', '枸杞', '山药', '薏米', '莲子', '百合', '银耳', '黄芪', '党参'];
    foodKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        entities.foods.push(keyword);
      }
    });
    
    return entities;
  },
  
  // 意图识别
  classifyIntent(text: string, entities: {[key: string]: string[]}): string {
    const lowerText = text.toLowerCase();
    
    // 诊断结果相关意图
    if (lowerText.includes('诊断') || lowerText.includes('结果') || lowerText.includes('分析') || lowerText.includes('报告')) {
      return 'diagnosis_inquiry';
    }
    
    // 体质相关意图
    if (entities.bodyTypes.length > 0 || lowerText.includes('体质') || lowerText.includes('类型')) {
      return 'body_type_inquiry';
    }
    
    // 症状相关意图
    if (entities.symptoms.length > 0 || entities.conditions.length > 0) {
      return 'symptom_inquiry';
    }
    
    // 中医理论相关意图
    if (lowerText.includes('中医') || lowerText.includes('理论') || lowerText.includes('原理') || lowerText.includes('知识')) {
      return 'theory_inquiry';
    }
    
    // 食物调理相关意图
    if (lowerText.includes('吃') || lowerText.includes('饮食') || lowerText.includes('食物') || entities.foods.length > 0) {
      return 'diet_inquiry';
    }
    
    // 默认意图
    return 'general_inquiry';
  }
};

export default function AgentChatPage() {
  const navigate = useNavigate();
  const { diagnosisResult } = React.useContext(DiagnosisContext);
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 对话上下文
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  
  // 上次用户问题，用于处理重复问题
  const [lastUserQuestion, setLastUserQuestion] = useState('');
  const [repeatCount, setRepeatCount] = useState(0);

  // 初始欢迎消息
  useEffect(() => {
    const welcomeMessages = [
      {
        id: 'welcome-1',
        text: '您好！我是中医智能助手，很高兴为您提供健康咨询服务。我可以回答关于中医理论、体质调理、常见病症、饮食建议等方面的问题。请问有什么健康问题需要帮助吗？',
        isUser: false,
        timestamp: new Date()
      }
    ];
    
    // 如果有诊断结果，添加相关提示
    if (diagnosisResult) {
      welcomeMessages.push({
        id: 'welcome-2',
        text: `我注意到您刚刚完成了一次面诊舌诊分析，您的健康评分为${diagnosisResult.healthScore}分，体质类型为${diagnosisResult.bodyTypes.join('、')}。您可以询问关于诊断结果的问题，或者咨询其他健康相关的话题。`,
        isUser: false,
        timestamp: new Date(Date.now() + 1000)
      });
      
      // 更新对话上下文
      setConversationContext(prev => ({
        ...prev,
        diagnosis: {
          score: diagnosisResult.healthScore,
          bodyTypes: diagnosisResult.bodyTypes,
          faceAnalysis: diagnosisResult.faceAnalysis,
          tongueAnalysis: diagnosisResult.tongueAnalysis
        }
      }));
    }
    
    setMessages(welcomeMessages);
  }, [diagnosisResult]);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 更新对话上下文
  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1].isUser) {
      const lastMessage = messages[messages.length - 1].text;
      
      // 提取最近讨论的话题
      const newTopics = [...(conversationContext.recentTopics || [])];
      if (newTopics.length >= 5) newTopics.shift();
      
      // 简单的话题提取逻辑
      if (lastMessage.includes('体质')) {
        newTopics.push('体质');
      } else if (lastMessage.includes('症状')) {
        newTopics.push('症状');
      } else if (lastMessage.includes('中医理论')) {
        newTopics.push('中医理论');
      } else if (lastMessage.includes('饮食')) {
        newTopics.push('饮食');
      }
      
      setConversationContext(prev => ({
        ...prev,
        lastMessage,
        recentTopics: newTopics
      }));
    }
  }, [messages]);

  // 生成更智能的回复 - 大模型风格
  const generateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // 检查是否重复提问
    if (userMessage === lastUserQuestion) {
      setRepeatCount(prev => prev + 1);
      if (repeatCount >= 2) {
        // 三次重复同一问题，给出提示
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: `bot-${Date.now()}`,
              text: '看起来您对这个问题很关心。为了给您提供更全面的信息，我建议您可以提供更多细节，或者换个角度提问，我会尽力为您解答。',
              isUser: false,
              timestamp: new Date()
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }
    } else {
      setLastUserQuestion(userMessage);
      setRepeatCount(0);
    }
    
    // 提取实体和意图
    const entities = intentClassifier.extractEntities(userMessage);
    const intent = intentClassifier.classifyIntent(userMessage, entities);
    
    // 更新症状信息到上下文
    if (entities.symptoms.length > 0) {
      setConversationContext(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), ...entities.symptoms]
      }));
    }
    
    // 根据意图生成回复
    let response = '';
    
    // 诊断结果相关问题
    if (intent === 'diagnosis_inquiry') {
      if (diagnosisResult) {
        response = generateDiagnosisRelatedResponse(userMessage, entities);
      } else {
        response = '建议您先完成一次面诊舌诊分析，这样我可以基于您的具体情况提供更准确的建议。您可以点击上方导航栏中的"返回首页"开始诊断。';
      }
    } 
    // 体质类型相关问题
    else if (intent === 'body_type_inquiry') {
      response = generateBodyTypeResponse(userMessage, entities);
    }
    // 症状相关问题
    else if (intent === 'symptom_inquiry') {
      response = generateSymptomResponse(userMessage, entities);
    }
    // 中医理论相关问题
    else if (intent === 'theory_inquiry') {
      response = generateTheoryResponse(userMessage);
    }
    // 饮食调理相关问题
    else if (intent === 'diet_inquiry') {
      response = generateDietResponse(userMessage, entities);
    }
    // 综合或一般性问题
    else {
      response = generateGeneralResponse(userMessage);
    }
    
    // 模拟思考时间，根据回复长度动态调整
    const thinkingTime = 1000 + Math.min(response.length * 5, 3000);
    
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `bot-${Date.now()}`,
          text: response,
          isUser: false,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, thinkingTime);
  };

  // 生成与诊断结果相关的回复
  const generateDiagnosisRelatedResponse = (userMessage: string, entities: {[key: string]: string[]}) => {
    if (!diagnosisResult) return '';
    
    // 基于诊断结果和用户问题生成回复
    let response = '';
    
    // 健康评分相关
    if (userMessage.includes('评分') || userMessage.includes('分数')) {
      response = `您的健康评分为${diagnosisResult.healthScore}分，这是基于您的面部和舌头特征综合评估得出的。`;
      
      if (diagnosisResult.healthScore >= 80) {
        response += ' 您的健康状况良好，这表明您的气血调和、脏腑功能协调。建议保持现有的健康生活方式，包括均衡饮食、适量运动和充足睡眠。';
      } else if (diagnosisResult.healthScore >= 60) {
        response += ' 您的健康状况基本良好，但仍有一些需要注意的地方。根据您的体质特点，建议调整饮食结构，增加适当的运动，并保持良好的心态。';
      } else {
        response += ' 您的健康状况需要关注。建议您调整生活方式和饮食习惯，保持充足的休息，并考虑咨询专业中医师进行进一步诊断和调理。';
      }
      
      // 添加具体的调理建议
      if (diagnosisResult.suggestions && diagnosisResult.suggestions.length > 0) {
        response += '\n\n以下是针对您的具体情况的调理建议：\n';
        const selectedSuggestions = diagnosisResult.suggestions.slice(0, 3);
        response += selectedSuggestions.join('\n');
      }
    } 
    // 体质类型相关
    else if (userMessage.includes('体质') || userMessage.includes('类型')) {
      const bodyTypeResponse = generateBodyTypeResponse(userMessage, entities);
      response = `根据面诊舌诊分析，您的体质类型为${diagnosisResult.bodyTypes.join('、')}。${bodyTypeResponse}`;
    } 
    // 面部分析相关
    else if (userMessage.includes('面部') || userMessage.includes('面色')) {
      response = `您的面部分析显示：面色${diagnosisResult.faceAnalysis.complexion}，眼睛${diagnosisResult.faceAnalysis.eyes}，嘴唇${diagnosisResult.faceAnalysis.lips}，整体色调${diagnosisResult.faceAnalysis.overallColor}。`;
      
      // 根据面部特征提供详细解释
      if (diagnosisResult.faceAnalysis.complexion === '红润') {
        response += ' 红润的面色通常是健康的表现，提示气血充足，脏腑功能协调。这是中医理论中"有诸内必形诸外"的体现，说明您的内在脏腑功能良好。';
      } else if (diagnosisResult.faceAnalysis.complexion === '苍白') {
        response += ' 苍白的面色可能提示气血不足或阳虚寒凝。中医认为，面色苍白多与心、脾、肺功能失调有关，心主血脉，脾主运化，肺主气，这些脏腑功能失调会导致气血不能上荣于面。';
      } else if (diagnosisResult.faceAnalysis.complexion === '潮红') {
        response += ' 潮红的面色可能提示热证或阴虚内热。中医认为，面红多与热证有关，实热证表现为满面通红，阴虚内热则表现为两颧潮红。';
      } else if (diagnosisResult.faceAnalysis.complexion === '萎黄') {
        response += ' 萎黄的面色可能提示脾胃虚弱、气血生化不足。中医认为，脾胃为气血生化之源，脾胃虚弱则气血生成不足，不能上荣于面，导致面色萎黄无华。';
      } else if (diagnosisResult.faceAnalysis.complexion === '暗黄') {
        response += ' 暗黄的面色可能提示湿热内蕴或肝胆功能失调。中医认为，黄色与脾相关，而暗则多与瘀或湿有关，因此暗黄面色多与脾虚湿困或肝胆湿热有关。';
      }
      
      // 添加相关建议
      response += '\n\n建议您根据面部特征的提示，结合整体体质情况，调整饮食和生活习惯，必要时咨询专业中医师进行调理。';
    } 
    // 舌诊分析相关
    else if (userMessage.includes('舌头') || userMessage.includes('舌诊')) {
      response = `您的舌诊分析显示：舌质颜色${diagnosisResult.tongueAnalysis.color}，舌苔${diagnosisResult.tongueAnalysis.coating}，舌形${diagnosisResult.tongueAnalysis.shape}，舌面湿度${diagnosisResult.tongueAnalysis.moisture}。`;
      
      // 根据舌象特征提供详细解释
      let tongueExplanations = [];
      
      if (diagnosisResult.tongueAnalysis.color === '淡红') {
        tongueExplanations.push('淡红的舌质是正常的表现，提示气血调和，身体状态良好。');
      } else if (diagnosisResult.tongueAnalysis.color === '红') {
        tongueExplanations.push('红色的舌质可能提示热证或阴虚，需要注意清热降火或滋阴润燥。');
      } else if (diagnosisResult.tongueAnalysis.color === '暗红') {
        tongueExplanations.push('暗红色的舌质可能提示热盛血瘀或阴虚内热，需要注意清热凉血或滋阴降火。');
      } else if (diagnosisResult.tongueAnalysis.color === '淡白') {
        tongueExplanations.push('淡白的舌质可能提示气血不足或阳虚，需要注意补气养血或温补阳气。');
      } else if (diagnosisResult.tongueAnalysis.color === '青紫') {
        tongueExplanations.push('青紫的舌质可能提示寒凝血瘀或气滞血瘀，需要注意温阳散寒或活血化瘀。');
      }
      
      if (diagnosisResult.tongueAnalysis.coating === '薄白') {
        tongueExplanations.push('薄白的舌苔是正常的表现，提示胃气充足，消化功能良好。');
      } else if (diagnosisResult.tongueAnalysis.coating === '厚腻') {
        tongueExplanations.push('厚腻的舌苔可能提示痰湿或食积，需要注意健脾利湿或消食导滞。');
      } else if (diagnosisResult.tongueAnalysis.coating === '黄腻') {
        tongueExplanations.push('黄腻的舌苔可能提示湿热内蕴，需要注意清热利湿。');
      } else if (diagnosisResult.tongueAnalysis.coating === '少苔') {
        tongueExplanations.push('少苔的舌苔可能提示阴虚或气阴两虚，需要注意滋阴润燥或益气养阴。');
      } else if (diagnosisResult.tongueAnalysis.coating === '无苔') {
        tongueExplanations.push('无苔的舌苔可能提示阴虚重症或胃气衰败，需要及时就医调理。');
      }
      
      if (diagnosisResult.tongueAnalysis.shape === '正常') {
        tongueExplanations.push('正常的舌形提示气血调和，身体状态良好。');
      } else if (diagnosisResult.tongueAnalysis.shape === '胖大') {
        tongueExplanations.push('胖大的舌形可能提示水湿内停或脾虚湿盛，需要注意健脾利湿。');
      } else if (diagnosisResult.tongueAnalysis.shape === '瘦小') {
        tongueExplanations.push('瘦小的舌形可能提示气血亏虚或阴虚，需要注意补气养血或滋阴润燥。');
      } else if (diagnosisResult.tongueAnalysis.shape === '齿痕') {
        tongueExplanations.push('齿痕舌可能提示脾虚或水湿内停，需要注意健脾利湿。');
      } else if (diagnosisResult.tongueAnalysis.shape === '裂纹') {
        tongueExplanations.push('裂纹舌可能提示阴虚或气阴两虚，需要注意滋阴润燥或益气养阴。');
      }
      
      response += ' ' + tongueExplanations.join(' ');
      
      // 添加舌诊的中医意义
      response += '\n\n舌诊是中医诊断的重要方法之一，中医认为"舌为心之苗"、"舌为脾胃之外候"，舌头的变化可以直接反映出内脏的功能状态。通过观察舌象的变化，可以了解气血阴阳的盛衰和脏腑功能的强弱。';
      
      // 添加相关建议
      response += '\n\n建议您根据舌象特征的提示，结合整体体质情况，调整饮食和生活习惯，必要时咨询专业中医师进行调理。';
    } 
    // 建议相关
    else if (userMessage.includes('建议') || userMessage.includes('调理')) {
      response = '根据您的诊断结果和体质特点，我为您提供以下个性化的调理建议：\n\n';
      
      // 从诊断结果的建议中选择，并补充更详细的内容
      if (diagnosisResult.suggestions && diagnosisResult.suggestions.length > 0) {
        const selectedSuggestions = diagnosisResult.suggestions.slice(0, 5);
        response += selectedSuggestions.join('\n\n');
      }
      
      // 添加体质相关的建议
      if (diagnosisResult.bodyTypes && diagnosisResult.bodyTypes.length > 0) {
        response += '\n\n此外，针对您的体质特点，建议：\n';
        
        diagnosisResult.bodyTypes.forEach((type: string) => {
          const bodyTypeInfo = chineseMedicineKnowledgeBase.bodyTypes[type];
          if (bodyTypeInfo) {
            response += `- ${bodyTypeInfo.recommendations}\n`;
          }
        });
      }
      
      response += '\n\n以上建议仅供参考，每个人的体质和健康状况都有所不同，如有不适症状，建议及时咨询专业中医师进行辨证施治。';
    } 
    // 默认诊断相关回复
    else {
      response = '您的诊断结果已生成，包含健康评分、体质类型、面部和舌诊特征分析等内容。诊断结果显示您的健康状况属于中等偏上水平，但仍有一些需要注意的地方。\n\n您可以针对报告中的具体内容提问，比如"我的体质该如何调理？"、"面部特征反映了什么健康问题？"、"针对我的情况有什么饮食建议？"等，我会为您详细解答。';
      
      // 添加一些引导性问题
      response += '\n\n您也可以继续咨询其他健康相关的问题，比如常见病症的调理方法、中医理论知识等，我会尽力为您提供专业的解答。';
    }
    
    return response;
  };

  // 生成体质类型相关的回复
  const generateBodyTypeResponse = (_userMessage: string, entities: {[key: string]: string[]}) => {
    let response = '';
    
    // 如果有具体的体质类型实体，针对该体质类型提供详细信息
    if (entities.bodyTypes.length > 0) {
      const bodyType = entities.bodyTypes[0];
      const bodyTypeInfo = chineseMedicineKnowledgeBase.bodyTypes[bodyType];
      
      if (bodyTypeInfo) {
        response = `${bodyType}是中医体质分类中的一种类型。${bodyTypeInfo.characteristics}\n\n针对${bodyType}的调理建议：${bodyTypeInfo.recommendations}${bodyTypeInfo.foods ? `\n\n适合的食物有：${bodyTypeInfo.foods}` : ''}`;
      }
      
      // 添加体质与季节的关系
      response += '\n\n中医调理还应顺应季节变化：春季宜养肝，夏季宜养心，长夏宜养脾，秋季宜养肺，冬季宜养肾。您可以根据不同季节调整养生方法。';
    } 
    // 如果没有具体的体质类型，但提到了体质
    else if (_userMessage.includes('体质')) {
      response = '中医体质分类主要包括平和质、气虚质、湿热质、阴虚质、阳虚质、痰湿质、血瘀质、气郁质等九种类型。每种体质类型都有其独特的特征和调理方法。\n\n您可以告诉我您想了解哪种体质类型，或者描述您的症状，我可以帮您初步判断体质类型并提供相应的调理建议。';
    }
    
    // 如果用户是在询问自己的体质，并且有诊断结果
    if (diagnosisResult && (_userMessage.includes('我的') || _userMessage.includes('我属于'))) {
      response = `根据您的面诊舌诊结果，您的体质类型为${diagnosisResult.bodyTypes.join('、')}。${response}`;
    }
    
    return response;
  };

  // 生成症状相关的回复
  const generateSymptomResponse = (_userMessage: string, entities: {[key: string]: string[]}) => {
    let response = '';
    
    // 如果有具体的病症实体，针对该病症提供详细信息
    if (entities.conditions.length > 0) {
      const condition = entities.conditions[0];
      const conditionInfo = chineseMedicineKnowledgeBase.commonConditions[condition];
        
        if (conditionInfo) {
        response = `${conditionInfo.description}\n\n针对${condition}的调理建议：\n`;
        
        // 添加详细的建议
        conditionInfo.recommendations.forEach((rec: string, index: number) => {
          response += `${index + 1}. ${rec}\n`;
        });
        
        response += `\n适合的食物有：${conditionInfo.foods}`;
      }
    } 
    // 如果有症状实体，但没有具体的病症
    else if (entities.symptoms.length > 0) {
      const symptom = entities.symptoms[0];
      response = `您提到的${symptom}症状在中医中可能与多种因素有关。例如，${symptom}可能与气血不足、肝郁气滞、湿热内蕴等有关。\n\n为了给您提供更准确的建议，建议您描述更多的症状，比如是否伴有其他不适，饮食、睡眠、二便情况如何，这样我可以帮您进行更全面的分析。`;
    }
    
    // 添加一般性建议
    if (!response.includes('建议')) {
      response += '\n\n中医强调辨证施治，建议您咨询专业中医师进行面诊，以便制定个性化的治疗方案。同时，保持良好的生活习惯和心态对改善症状也非常重要。';
    }
    
    return response;
  };

  // 生成中医理论相关的回复
  const generateTheoryResponse = (userMessage: string) => {
    let response = '';
    
    // 检查是否有具体的理论关键词
    const theoryKeywords = Object.keys(chineseMedicineKnowledgeBase.theories);
    for (const keyword of theoryKeywords) {
      if (userMessage.includes(keyword)) {
        response = chineseMedicineKnowledgeBase.theories[keyword];
        break;
      }
    }
    
    // 如果没有找到具体的理论，提供中医理论的概述
    if (!response) {
      response = '中医理论是中华民族在长期的医疗实践中形成和发展起来的医学理论体系，包括阴阳五行学说、脏腑经络学说、气血津液学说等核心内容。中医强调"整体观念"和"辨证施治"，认为人体是一个有机的整体，人与自然环境密切相关。\n\n您可以具体询问关于中医理论的某个方面，比如"阴阳五行"、"脏腑功能"、"气血津液"、"经络学说"、"辨证施治"等，我会为您详细解答。';
    }
    
    return response;
  };

  // 生成饮食调理相关的回复
  const generateDietResponse = (userMessage: string, entities: {[key: string]: string[]}) => {
    let response = '';
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // 如果有具体的食物实体，提供该食物的功效和食用建议
    if (entities.foods.length > 0) {
      const food = entities.foods[0];
      const foodEffects: {[key: string]: string} = {
        '红枣': '红枣具有补中益气、养血安神的功效，适合气血不足、脾胃虚弱的人群食用。但湿热内蕴、痰火内盛者不宜多食。',
        '桂圆': '桂圆具有补益心脾、养血安神的功效，适合心脾两虚、气血不足的人群食用。但阴虚火旺、湿热内蕴者不宜多食。',
        '枸杞': '枸杞具有滋补肝肾、益精明目的功效，适合肝肾阴虚、头晕目眩的人群食用。但外有表邪、内有实热者不宜食用。',
        '山药': '山药具有健脾益胃、滋肾益精的功效，适合脾胃虚弱、肾虚遗精的人群食用。一般人群均可食用，无明显禁忌。',
        '薏米': '薏米具有利水渗湿、健脾止泻的功效，适合脾虚湿盛、水肿脚气的人群食用。但孕妇、脾胃虚寒者不宜多食。',
        '莲子': '莲子具有补脾止泻、益肾涩精、养心安神的功效，适合脾虚泄泻、心悸失眠的人群食用。一般人群均可食用。',
        '百合': '百合具有养阴润肺、清心安神的功效，适合阴虚燥咳、失眠多梦的人群食用。但风寒咳嗽、脾胃虚寒者不宜食用。',
        '银耳': '银耳具有滋阴润肺、养胃生津的功效，适合阴虚肺燥、干咳无痰的人群食用。一般人群均可食用。',
        '黄芪': '黄芪具有补气升阳、固表止汗的功效，适合气虚乏力、表虚自汗的人群食用。但实证、热证者不宜食用。',
        '党参': '党参具有补中益气、健脾益肺的功效，适合脾肺气虚、气短乏力的人群食用。但实证、热证者不宜食用。'
      };
      
      if (foodEffects[food]) {
        response = `${food}的功效与食用建议：${foodEffects[food]}`;
      } else {
        response = `关于${food}的详细信息，建议您咨询专业中医师或营养师，他们可以根据您的具体情况提供更准确的建议。`;
      }
    } 
    // 如果提到了特定体质的饮食
    else if (lowerCaseMessage.includes('体质') && lowerCaseMessage.includes('吃')) {
      response = '中医强调"药食同源"，不同体质的人适合的食物也不同。例如：\n\n- 气虚质：适合食用补气的食物，如黄芪、党参、山药、大枣等。\n- 湿热质：适合食用清热利湿的食物，如绿豆、冬瓜、黄瓜、薏米等。\n- 阴虚质：适合食用滋阴润燥的食物，如银耳、百合、雪梨、枸杞等。\n- 阳虚质：适合食用温补阳气的食物，如羊肉、桂圆、生姜、肉桂等。\n\n您可以告诉我您的体质类型，我可以为您提供更具体的饮食建议。';
    } 
    // 如果提到了特定病症的饮食
    else if (lowerCaseMessage.includes('症状') || lowerCaseMessage.includes('病症')) {
      response = '中医食疗是中医治疗的重要组成部分，不同病症适合的食物也不同。例如：\n\n- 失眠：适合食用莲子、百合、酸枣仁、桂圆等养心安神的食物。\n- 脾胃不好：适合食用山药、薏米、茯苓、莲子等健脾益胃的食物。\n- 湿气重：适合食用红豆、薏米、冬瓜、玉米须等利湿的食物。\n\n您可以告诉我您想了解哪种病症的饮食建议，我可以为您详细解答。';
    } 
    // 一般性饮食建议
    else {
      response = '中医饮食调理强调"食养"和"食疗"，根据食物的四气五味（寒热温凉、酸苦甘辛咸）和功效，结合个人的体质和健康状况，选择适合的食物。\n\n中医饮食调理的基本原则包括：饮食有节、饮食多样、饮食卫生、辨证施食等。您可以告诉我您的具体情况，比如体质类型、健康问题等，我可以为您提供更个性化的饮食建议。';
    }
    
    return response;
  };

  // 生成一般性回复
  const generateGeneralResponse = (userMessage: string) => {
    // 检查是否有问候语
    const greetings = ['你好', '您好', '早上好', '晚上好', '晚安', '嗨', '嗨喽'];
    for (const greeting of greetings) {
      if (userMessage.includes(greeting)) {
        return `您好！很高兴为您提供中医健康咨询服务。我可以回答关于中医理论、体质调理、常见病症、饮食建议等方面的问题。请问有什么健康问题需要帮助吗？`;
      }
    }
    
    // 检查是否有感谢语
    const thanks = ['谢谢', '感谢', '非常感谢', '太感谢了'];
    for (const thank of thanks) {
      if (userMessage.includes(thank)) {
        return `不客气！这是我应该做的。如果您还有其他健康问题，随时都可以问我。`;
      }
    }
    
    // 检查是否有再见语
    const goodbyes = ['再见', '拜拜', '下次见'];
    for (const goodbye of goodbyes) {
      if (userMessage.includes(goodbye)) {
        return `再见！祝您身体健康，生活愉快！如有需要，随时欢迎再来咨询。`;
      }
    }
    
    // 如果用户询问系统功能
    if (userMessage.includes('功能') || userMessage.includes('能做什么') || userMessage.includes('可以帮我')) {
      return `我是中医智能助手，可以为您提供以下服务：\n\n1. 中医理论知识解答：阴阳五行、脏腑功能、气血津液、经络学说等。\n2. 体质类型分析与调理：根据您的症状或诊断结果，提供个性化的体质调理建议。\n3. 常见病症咨询：失眠、脾胃不好、湿气重、气血不足等常见病症的中医调理方法。\n4. 饮食调理建议：药食同源，根据体质和健康状况推荐适合的食物。\n5. 诊断结果解读：如果您已完成面诊舌诊，可以询问关于诊断结果的问题。\n\n您可以告诉我您想咨询哪方面的问题，我会尽力为您解答。`;
    }
    
    // 如果用户询问如何使用系统
    if (userMessage.includes('怎么用') || userMessage.includes('如何使用')) {
      return `使用中医智能助手非常简单：\n\n1. 您可以直接输入您的健康问题，比如"失眠怎么办？"、"脾胃不好怎么调理？"、"气虚质应该吃什么？"等。\n2. 如果您已经完成了面诊舌诊分析，可以询问关于诊断结果的问题，比如"我的体质该如何调理？"、"健康评分是什么意思？"等。\n3. 您也可以咨询中医理论知识，比如"什么是阴阳五行？"、"中医的脏腑功能指什么？"等。\n\n您可以随时开始提问，我会尽力为您提供专业的解答。`;
    }
    
    // 其他情况下的默认回复
    const defaultResponses = [
      '感谢您的提问！根据中医理论，我为您提供以下建议...',
      '这个问题在中医中是比较常见的，让我为您详细解答...',
      '中医对这个问题有丰富的理论和实践经验，以下是我的建议...',
      '根据您的描述，结合中医理论，我认为可能与以下因素有关...',
      '中医强调辨证施治，针对您的情况，建议...',
      '您的问题很有针对性，这涉及到中医的多个方面，让我为您系统解答...'
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    // 结合上下文生成更个性化的回复
    if (conversationContext.recentTopics && conversationContext.recentTopics.length > 0) {
      const recentTopic = conversationContext.recentTopics[conversationContext.recentTopics.length - 1];
      
      if (recentTopic === '体质') {
        return `${randomResponse}\n\n我们之前讨论了体质相关的问题，您是否想进一步了解某种体质的调理方法，或者想了解其他体质类型的特点？`;
      } else if (recentTopic === '症状') {
        return `${randomResponse}\n\n我们之前讨论了症状相关的问题，您可以提供更多的症状细节，或者想了解其他常见病症的调理方法？`;
      } else if (recentTopic === '中医理论') {
        return `${randomResponse}\n\n我们之前讨论了中医理论相关的问题，您是否想了解中医的其他理论知识，或者想将理论应用到实际的健康调理中？`;
      } else if (recentTopic === '饮食') {
        return `${randomResponse}\n\n我们之前讨论了饮食调理相关的问题，您是否想了解某种食物的功效，或者想根据自己的体质制定个性化的饮食方案？`;
      }
    }
    
    // 如果有诊断结果，引导用户咨询诊断相关问题
    if (diagnosisResult) {
      return `${randomResponse}\n\n对了，我注意到您之前完成了面诊舌诊分析，您可以随时询问关于诊断结果的问题，比如"我的体质该如何调理？"、"健康评分是什么意思？"等，我会为您详细解答。`;
    }
    
    return `${randomResponse}\n\n如果您有更具体的健康问题，或者想了解中医的某个方面，欢迎随时告诉我，我会尽力为您提供专业的解答。`;
  };

  // 发送消息
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // 生成智能回复
    generateResponse(inputText.trim());
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* 导航栏 */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-amber-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-heart-pulse text-white text-xl"></i>
            </div><h1 className="text-2xl font-bold text-red-800 dark:text-amber-400">中医智能诊断</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <i className="fa-solid fa-arrow-left"></i>
            返回首页
          </button>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <motion.div
          className="max-w-3xl mx-auto w-full flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-amber-200 dark:border-slate-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 聊天头部 */}
          <div className="bg-red-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="fa-solid fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-semibold">中医智能助手</h2>
                <p className="text-sm text-white/80">基于中医理论的智能健康顾问</p>
              </div>
            </div>
          </div>

          {/* 聊天内容区域 */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-amber-50 dark:from-slate-800 dark:to-slate-900" style={{ minHeight: '500px' }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-red-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none border border-amber-200 dark:border-slate-600'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <div className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 order-0 flex-shrink-0">
                      <i className="fa-solid fa-robot text-red-600 dark:text-red-400 text-xs"></i>
                    </div>
                  )}
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ml-2 order-3 flex-shrink-0">
                      <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-xs"></i>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* 正在输入提示 - 更生动的动画 */}
              {isTyping && (
                <motion.div
                  className="flex mb-4 justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-2 flex-shrink-0">
                    <i className="fa-solid fa-robot text-red-600 dark:text-red-400 text-xs"></i>
                  </div>
                  <div className="max-w-[80%]">
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg rounded-bl-none border border-amber-200 dark:border-slate-600">
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        ></motion.div>
                        <motion.div 
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        ></motion.div>
                        <motion.div 
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 - 增强版 */}
          <div className="p-5 border-t border-amber-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入您的健康问题..."
                className="flex-1 p-4 text-lg rounded-lg border border-amber-200 dark:border-slate-600 bg-amber-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none max-h-40"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputText.trim() === ''}
                className={`p-4 text-xl rounded-lg flex-shrink-0 min-w-14 ${inputText.trim() === '' ? 'bg-slate-300 text-white/70 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 transition-colors'}`}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
            
            {/* 动态推荐问题 */}
            {inputText.trim() === '' && (
              <div className="mt-4">
                <h4 className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  推荐问题:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    '我的体质该如何调理？',
                    '失眠怎么办？',
                    '脾胃不好怎么调理？',
                    '湿气重有什么改善方法？',
                    '气血不足吃什么好？',
                    '什么是阴阳五行？',
                    '中医如何看待养生？'
                  ].map((question, index) => (
                    <button
                    key={index}
                    onClick={() => {
                      setInputText(question);
                      // 自动聚焦到输入框
                      const textarea = document.querySelector('textarea');
                      textarea?.focus();
                    }}
                    className="text-sm bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 py-3 px-4 rounded-full border border-amber-200 dark:border-amber-700/30 hover:bg-amber-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    {question}
                  </button>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 text-center">
              提示：您可以询问关于中医健康、诊断结果、体质调理等问题
            </p>
          </div>
        </motion.div>
        
        {/* 智能助手功能介绍 */}
        <div className="max-w-3xl mx-auto w-full mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
            <h3 className="text-base font-medium text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-1">
              <i className="fa-solid fa-lightbulb text-lg"></i>
              智能助手功能
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white/50 dark:bg-white/10 p-3 rounded border border-blue-200 dark:border-blue-800/30 flex items-center gap-2">
                <i className="fa-solid fa-person text-blue-600 dark:text-blue-400 text-lg"></i>
                <span className="text-blue-700 dark:text-blue-300">体质分析</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-3 rounded border border-blue-200 dark:border-blue-800/30 flex items-center gap-2">
                <i className="fa-solid fa-stethoscope text-blue-600 dark:text-blue-400 text-lg"></i>
                <span className="text-blue-700 dark:text-blue-300">症状咨询</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-3 rounded border border-blue-200 dark:border-blue-800/30 flex items-center gap-2">
                <i className="fa-solid fa-utensils text-blue-600 dark:text-blue-400 text-lg"></i>
                <span className="text-blue-700 dark:text-blue-300">饮食调理</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-3 rounded border border-blue-200 dark:border-blue-800/30 flex items-center gap-2">
                <i className="fa-solid fa-book-medical text-blue-600 dark:text-blue-400 text-lg"></i>
                <span className="text-blue-700 dark:text-blue-300">中医理论</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-3 rounded border border-blue-200 dark:border-blue-800/30 flex items-center gap-2">
                <i className="fa-solid fa-file-medical text-blue-600 dark:text-blue-400 text-lg"></i>
                <span className="text-blue-700 dark:text-blue-300">报告解读</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-3 rounded border border-blue-200 dark:border-blue-800/30 flex items-center gap-2">
                <i className="fa-solid fa-heart-pulse text-blue-600 dark:text-blue-400 text-lg"></i>
                <span className="text-blue-700 dark:text-blue-300">健康养生</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-red-800 dark:bg-slate-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-red-200 dark:text-slate-400">
            免责声明：本智能助手提供的信息仅供参考，不能替代专业医生的诊断和治疗
          </p>
        </div>
      </footer>
    </div>
  );
}