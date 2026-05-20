export interface ApiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  provider: 'openai' | 'openrouter' | 'gemini';
  mockMode: boolean;
}

export interface Question {
  id: string;
  text: string;
  choices: [string, string, string]; // exactly 3 choices, 4th is custom text input in UI
}

export interface Task {
  id: string;
  text: string;
  description: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  duration: string;
  tasks: Task[];
}

export interface GoalPlan {
  title: string;
  timeframe: string;
  summary: string;
  milestones: Milestone[];
}

const STORAGE_KEY = 'goal_planner_api_config';

const DEFAULT_CONFIG: ApiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  model: 'gemini-2.5-flash',
  provider: 'gemini',
  mockMode: false,
};

// Load configurations
export function getApiConfig(): ApiConfig {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey === 'AIzaSyBsKw2PjylFKpO5_BIkpRHlWBUoMqICMGU') {
        parsed.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      }
      return { ...DEFAULT_CONFIG, ...parsed };
    } catch {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

// Save configurations
export function saveApiConfig(config: ApiConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// Helper to determine keyword matches in goal
function analyzeGoal(goal: string): 'health' | 'learning' | 'business' | 'general' {
  const lowerGoal = goal.toLowerCase();
  
  const healthKeywords = ['run', 'fit', 'gym', 'workout', 'diet', 'weight', 'lose', 'muscle', 'marathon', 'swim', 'health', 'train', 'walk', 'yoga', 'رياضة', 'جيم', 'وزن', 'نحافة', 'تخسيس', 'جري', 'صحة'];
  if (healthKeywords.some(keyword => lowerGoal.includes(keyword))) {
    return 'health';
  }

  const learningKeywords = ['learn', 'code', 'study', 'read', 'speak', 'language', 'python', 'javascript', 'react', 'course', 'degree', 'book', 'write', 'paint', 'guitar', 'piano', 'typescript', 'تعلم', 'دراسة', 'برمجة', 'لغة', 'كتاب', 'كورس', 'قراءة'];
  if (learningKeywords.some(keyword => lowerGoal.includes(keyword))) {
    return 'learning';
  }

  const businessKeywords = ['business', 'start', 'launch', 'marketing', 'sell', 'product', 'company', 'website', 'app', 'money', 'revenue', 'hustle', 'invest', 'store', 'shop', 'تجارة', 'مشروع', 'شركة', 'موقع', 'تسويق', 'بيع', 'متجر'];
  if (businessKeywords.some(keyword => lowerGoal.includes(keyword))) {
    return 'business';
  }

  return 'general';
}

// High-fidelity Mock Questions (Bilingual)
export function getMockQuestions(goal: string, _timeframe: string, lang: 'en' | 'ar' = 'en'): Question[] {
  const category = analyzeGoal(goal);
  const list: Question[] = [];

  if (lang === 'ar') {
    // Q1: Experience level in Arabic
    if (category === 'health') {
      list.push({
        id: 'q1',
        text: 'ما هو مستواك الحالي في النشاط البدني واللياقة؟',
        choices: [
          'خامل / مبتدئ تماماً (أمارس الرياضة نادراً)',
          'نشط متوسط (أمارس الرياضة 1-2 مرات في الأسبوع)',
          'نشط جداً (أتدرب بانتظام وأريد تحدي حدودي)'
        ]
      });
    } else if (category === 'learning') {
      list.push({
        id: 'q1',
        text: 'ما هو مستواك الحالي من الخبرة في هذا المجال؟',
        choices: [
          'مبتدئ تماماً (لا أملك أي معرفة سابقة)',
          'مبتدئ ذاتي (أعرف بعض الأساسيات وأريد خطة منظمة)',
          'متوسط (قمت ببناء مشاريع صغيرة وأريد خبرة أعمق)'
        ]
      });
    } else if (category === 'business') {
      list.push({
        id: 'q1',
        text: 'ما مدى خبرتك في إطلاق المشاريع أو التسويق؟',
        choices: [
          'مبتدئ تماماً (هذا مشروعي الأول)',
          'متوسط (على دراية بالأساسيات مثل النطاقات وصفحات الهبوط)',
          'خبير (قمت بإطلاق أو بيع مشاريع سابقة)'
        ]
      });
    } else {
      list.push({
        id: 'q1',
        text: 'ما هو مستواك البدائي لتحقيق هذا الهدف؟',
        choices: [
          'مبتدئ تماماً (أبدأ من الصفر)',
          'مطلع (أملك خلفية بسيطة وجاهز للالتزام)',
          'ممارس (عملت على هذا مسبقاً وأريد التقدم)'
        ]
      });
    }

    // Q2: Time Commitment in Arabic
    list.push({
      id: 'q2',
      text: 'كم ساعة يمكنك تخصيصها واقعياً لهذا الهدف أسبوعياً؟',
      choices: [
        'التزام خفيف: 2-4 ساعات أسبوعياً',
        'التزام متوسط: 5-8 ساعات أسبوعياً',
        'تركيز عميق: 10+ ساعات أسبوعياً'
      ]
    });

    // Q3: Schedule structure in Arabic
    list.push({
      id: 'q3',
      text: 'كيف تفضل هيكلة جدولك والتعامل مع المهام الفائتة؟',
      choices: [
        'صارم ومنتظم: مهام يومية، عطلة نهاية الأسبوع راحة، مضاعفة الجهد عند الفوات',
        'تدفق مرن: قوائم مهام أسبوعية، مع أيام تعويض مرنة مدمجة',
        'سبرينت مكثف: أيام عمل بتركيز عالٍ، عطلة نشطة، دون أيام تعويض'
      ]
    });

    // Q4: Motivation/Style in Arabic
    if (category === 'health') {
      list.push({
        id: 'q4',
        text: 'ما هو تركيزك الأساسي في هذا التحول البدني؟',
        choices: [
          'بناء اللياقة الأساسية وتجنب الإصابات',
          'تحسين السرعة والأداء الرياضي الأقصى',
          'الاستمرارية وبناء عادة صحية طويلة المدى'
        ]
      });
    } else if (category === 'learning') {
      list.push({
        id: 'q4',
        text: 'كيف تفضل أسلوب التعلم الأنسب لك؟',
        choices: [
          'قائم على المشاريع (البناء والتطبيق العملي فوراً)',
          'نظري ومفاهيمي (قراءة الوثائق ومتابعة الشروحات خطوة بخطوة)',
          'سبرينت هجين (دمج سريع بين النظري والتطبيق العملي المباشر)'
        ]
      });
    } else if (category === 'business') {
      list.push({
        id: 'q4',
        text: 'ما هي الأولوية الكبرى في استراتيجية الإطلاق الخاصة بك؟',
        choices: [
          'تمويل ذاتي وعضوي (التركيز على شبكات التواصل والمحتوى المجاني)',
          'سرعة دخول السوق (إطلاق منتج أولي MVP في أيام لجمع الملاحظات)',
          'جودة استثنائية (تركيز هائل على التصميم الفاخر، البراند، والاحترافية)'
        ]
      });
    } else {
      list.push({
        id: 'q4',
        text: 'ما هو أكبر عائق تواجهه عادة عند البدء في أهداف كبيرة؟',
        choices: [
          'فقدان الحماس والدافع بعد عدة أسابيع من البداية',
          'كثرة وتشتت المعلومات وعدم معرفة الخطوة القادمة بوضوح',
          'إدارة الوقت وموازنة الهدف الجديد مع الالتزامات اليومية'
        ]
      });
    }
  } else {
    // English defaults
    if (category === 'health') {
      list.push({
        id: 'q1',
        text: 'What is your current baseline level of physical fitness?',
        choices: [
          'Sedentary / Complete Beginner (rarely exercise)',
          'Moderately Active (exercise 1-2 times a week)',
          'Very Active (exercise regularly, looking to push limits)'
        ]
      });
    } else if (category === 'learning') {
      list.push({
        id: 'q1',
        text: 'What is your current level of experience in this topic?',
        choices: [
          'Absolute Beginner (no prior knowledge at all)',
          'Self-taught / Beginner (know some basics, need structure)',
          'Intermediate (have built small things, want deep expertise)'
        ]
      });
    } else if (category === 'business') {
      list.push({
        id: 'q1',
        text: 'How much experience do you have with launching businesses or marketing?',
        choices: [
          'None (this is my first venture)',
          'Some (familiar with basics like domains, landing pages)',
          'Experienced (have launched or sold products before)'
        ]
      });
    } else {
      list.push({
        id: 'q1',
        text: 'What is your starting level for this goal?',
        choices: [
          'Complete novice (starting from zero)',
          'Familiar (some background knowledge, ready to commit)',
          'Practitioner (have worked on this, looking to advance)'
        ]
      });
    }

    list.push({
      id: 'q2',
      text: 'How many hours per week can you realistically dedicate to this goal?',
      choices: [
        'Light Commitment: 2-4 hours per week',
        'Medium Commitment: 5-8 hours per week',
        'Deep Focus: 10+ hours per week'
      ]
    });

    list.push({
      id: 'q3',
      text: 'How would you prefer to structure your schedule and handle potential missed tasks?',
      choices: [
        'Strict & Consistent: Daily tasks, weekends off, double up if missed',
        'Flexible Flow: Weekly task lists, buffer days built-in for catchups',
        'Intense Sprint: High-intensity weekdays, active weekends, no buffer'
      ]
    });

    if (category === 'health') {
      list.push({
        id: 'q4',
        text: 'What is your primary focus for this transformation?',
        choices: [
          'Building core stamina & injury prevention',
          'Speed & optimization of peak performance',
          'Consistency and building a long-term habit'
        ]
      });
    } else if (category === 'learning') {
      list.push({
        id: 'q4',
        text: 'How do you learn best?',
        choices: [
          'Project-Based (hands-on building immediately)',
          'Conceptual / Theoretical (reading docs, watching step-by-step)',
          'Hybrid Sprint (alternating brief theory and rapid code/work)'
        ]
      });
    } else if (category === 'business') {
      list.push({
        id: 'q4',
        text: 'What is your launch strategy priority?',
        choices: [
          'Bootstrapped & Organic (focus on free social outreach & content)',
          'Speed to Market (launch an MVP in days to collect feedback)',
          'Premium Quality (focus heavily on design, brand, and polish)'
        ]
      });
    } else {
      list.push({
        id: 'q4',
        text: 'What is the biggest blocker you usually face with major goals?',
        choices: [
          'Losing momentum or interest after a few weeks',
          'Information overload & not knowing the next step',
          'Time management & balancing with other commitments'
        ]
      });
    }
  }

  return list;
}

// High-fidelity Mock Roadmap Generator (Bilingual)
export function getMockPlan(goal: string, timeframe: string, qa: Array<{ question: string, answer: string }>, lang: 'en' | 'ar' = 'en'): GoalPlan {
  const category = analyzeGoal(goal);
  
  const commitment = qa.find(item => item.question.includes('hours per week') || item.question.includes('ساعة'))?.answer || 'Medium Commitment';
  const scheduleType = qa.find(item => item.question.includes('schedule') || item.question.includes('جدولك'))?.answer || 'Flexible Flow';

  let summary = '';
  let milestones: Milestone[] = [];

  if (lang === 'ar') {
    summary = `تم إعداد مخطط العمل المخصص هذا لتحقيق هدفك: **"${goal}"** على مدى **${timeframe}**. بناءً على تفضيلاتك (**${scheduleType}** ونمط الالتزام **${commitment}**)، قمنا بهيكلة خطة عمل عالية الكفاءة مصممة لتحقيق أقصى قدر من الاستفادة وتجنب الاحتراق الفكري أو الإرهاق البدني.`;

    if (category === 'health') {
      milestones = [
        {
          id: 'm1',
          title: 'المرحلة الأولى: التأسيس والتجهيز البدني',
          duration: `أول 20% من المدة (${timeframe})`,
          tasks: [
            { id: 't1_1', text: 'التقييم الأولي للبداية', description: 'قم بقياس وتسجيل وزنك، قياساتك البدنية، أو سرعة جريك لتحديد خط الأساس.', completed: false },
            { id: 't1_2', text: 'تجهيز المعدات والجدول اليومي', description: 'جهز الملابس الرياضية المناسبة، مطرة المياه، وحدد مواعيد التنبيه اليومية في تقويمك.', completed: false },
            { id: 't1_3', text: 'بناء اللياقة والتحمل الأولي', description: 'نفذ 3 تمارين خفيفة منخفضة الشدة مع التركيز الكامل على الأداء السليم وحركة المفاصل.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'المرحلة الثانية: التدرج في الحمل وزيادة القدرة الاستيعابية',
          duration: `الـ 50% المتوسطة من المدة (${timeframe})`,
          tasks: [
            { id: 't2_1', text: 'زيادة حجم التمارين وشدتها', description: 'أضف 10-15% زيادة على شدة التمارين، الأوزان، أو مسافة الجري المعتادة بشكل تدريجي.', completed: false },
            { id: 't2_2', text: 'تنظيم التغذية لدعم المجهود', description: 'سجل السعرات والمغذيات الأساسية لضمان كفاية البروتين والماء لتعويض المجهود العضلي.', completed: false },
            { id: 't2_3', text: 'تحسين الاستشفاء وتقليل الإرهاق', description: 'مارس تمارين الإطالة العضلية الثابتة وجدول أيام المشي الهادئ للاستشفاء.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'المرحلة الثالثة: الأداء الأقصى وتثبيت العادة الصحية',
          duration: `الـ 30% الأخيرة من المدة (${timeframe})`,
          tasks: [
            { id: 't3_1', text: 'الاختبار الحقيقي والقياس النهائي', description: 'قم بإجراء اختبار نهائي و dry-run لقياس هدفك الأقصى (مثل الجري لمسافة 5 كم دون توقف).', completed: false },
            { id: 't3_2', text: 'تعزيز الاستمرارية وثبات العادة', description: 'التزم بتمارينك حتى في الأيام المزدحمة لترسيخ سلوك الرياضة كعادة يومية.', completed: false },
            { id: 't3_3', text: 'مراجعة الإنجاز وتخطيط الهدف القادم', description: 'قارن الأرقام الحالية بأرقام اليوم الأول، احتفل بنجاحك، وصِغ هدفك الرياضي التالي.', completed: false }
          ]
        }
      ];
    } else if (category === 'learning') {
      milestones = [
        {
          id: 'm1',
          title: 'المرحلة الأولى: فهم الآليات وتأسيس الهيكل المعرفي',
          duration: `أول 20% من المدة (${timeframe})`,
          tasks: [
            { id: 't1_1', text: 'تجهيز بيئة العمل والمصادر', description: 'ثبت البرامج والأدوات المطلوبة، واختر كتابين أو دورتين أساسيتين لبدء الدراسة.', completed: false },
            { id: 't1_2', text: 'إتقان المفاهيم والأساسيات الكبرى', description: 'اقض ساعات من التركيز الهادئ في فهم الميكانيكية الأساسية والقواعد العامة للمجال.', completed: false },
            { id: 't1_3', text: 'إجراء تجارب صغيرة جداً', description: 'قم ببناء 3 أمثلة تجريبية بالغة البساطة لاختبار مدى فهمك النظري الأولي.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'المرحلة الثانية: البناء الفعلي وتطوير المشاريع الواقعية',
          duration: `الـ 50% المتوسطة من المدة (${timeframe})`,
          tasks: [
            { id: 't2_1', text: 'تطوير مشروع تطبيقي متكامل', description: 'ابدأ ببناء الهيكل الأساسي لمشروعك التعليمي الرئيسي الذي يطبق كافة المفاهيم.', completed: false },
            { id: 't2_2', text: 'سبرينت حل المشكلات والتنقيح', description: 'واجه المشاكل والأخطاء وحاول حلها ذاتياً بالبحث في المستندات الرسمية دون دروس جاهزة.', completed: false },
            { id: 't2_3', text: 'مراجعة وتعديل نقاط الضعف', description: 'أعد دراسة الأقسام أو المهارات التي واجهت فيها صعوبة أثناء مرحلة البناء الفعلي.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'المرحلة الثالثة: الصقل، الإنهاء، وعرض المهارات المكتسبة',
          duration: `الـ 30% الأخيرة من المدة (${timeframe})`,
          tasks: [
            { id: 't3_1', text: 'تحسين المظهر والأداء النهائي', description: 'قم بتنسيق الواجهات، مراجعة النصوص، وصقل التفاصيل لجعل مخرجك يبدو احترافياً.', completed: false },
            { id: 't3_2', text: 'النشر الفعلي أو العرض العملي', description: 'قم برفع مشروعك على الإنترنت، أو سجل فيديو تعريفي، أو قم بإجراء اختبار مباشر.', completed: false },
            { id: 't3_3', text: 'توثيق المخرجات والاحتفال بالرحلة', description: 'اكتب تدوينة قصيرة أو ملف توضيحي يوثق المهارات التي أتقنتها وتفاصيل إنجازك.', completed: false }
          ]
        }
      ];
    } else if (category === 'business') {
      milestones = [
        {
          id: 'm1',
          title: 'المرحلة الأولى: التحقق من الفكرة وتهيئة البنية التحتية',
          duration: `أول 20% من المدة (${timeframe})`,
          tasks: [
            { id: 't1_1', text: 'مقابلات العملاء المحتملين والتحقق', description: 'تحدث مع 3 أشخاص من شريحتك المستهدفة للتحقق من المشكلة وصلاحية الحل.', completed: false },
            { id: 't1_2', text: 'صفحة الهبوط وبناء الهوية البصرية', description: 'اشترِ النطاق (Domain)، جهز شعاراً بسيطاً، وابنِ صفحة هبوط لجمع العملاء المهتمين.', completed: false },
            { id: 't1_3', text: 'تحديد عرض القيمة والتسعير', description: 'حدد بوضوح سعر الخدمة أو المنتج، الفائدة الكبرى المقدمة للعميل، واستراتيجية العروض.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'المرحلة الثانية: التجهيز للإطلاق وتفعيل قنوات التسويق',
          duration: `الـ 50% المتوسطة من المدة (${timeframe})`,
          tasks: [
            { id: 't2_1', text: 'إعداد مغناطيس جذب العملاء', description: 'صمم دليلاً أو أداة مجانية مفيدة لتبدأ في جمع البريد الإلكتروني للعملاء المستهدفين.', completed: false },
            { id: 't2_2', text: 'سبرينت التواصل المباشر والمبيعات', description: 'تواصل مباشرة مع 30-50 عميلاً محتملاً عبر الرسائل المباشرة أو شبكات التواصل.', completed: false },
            { id: 't2_3', text: 'تجهيز النموذج الأولي الفعلي MVP', description: 'قم بصياغة النسخة المبسطة الجاهزة للتقديم من خدمتك، متجرك، أو منتجك.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'المرحلة الثالثة: فتح باب الطلبات، التحليل وهيكلة التوسع',
          duration: `الـ 30% الأخيرة من المدة (${timeframe})`,
          tasks: [
            { id: 't3_1', text: 'إطلاق البيع والإعلان الرسمي', description: 'أعلن رسمياً عن فتح باب الشراء لجميع المسجلين والمهتمين على شبكات التواصل وقائمتك.', completed: false },
            { id: 't3_2', text: 'جمع الملاحظات وتحسين التجربة', description: 'تلق ملاحظات المشترين الأوائل، حل مشاكل الدعم الفني، وقم بصقل العملية الإجمالية.', completed: false },
            { id: 't3_3', text: 'وضع خطة التوسع ونمو المبيعات', description: 'حلل معدلات التحويل وهوامش الربح، وحدد القنوات الإعلانية الأفضل للتوسع مستقبلاً.', completed: false }
          ]
        }
      ];
    } else {
      milestones = [
        {
          id: 'm1',
          title: 'المرحلة الأولى: تخطيط وتهيئة العادات الأساسية للهدف',
          duration: `أول 20% من المدة (${timeframe})`,
          tasks: [
            { id: 't1_1', text: 'تحديد الحدود والنجاح الفعلي', description: 'حدد بدقة متناهية ما يعنيه إنجاز هذا الهدف، وضع شروطاً واضحة للنجاح.', completed: false },
            { id: 't1_2', text: 'تنظيم المساحة والوقت المخصص', description: 'قم بتهيئة مساحتك الرقمية أو الجسدية للدراسة أو العمل، واكتشف الأوقات الأنسب.', completed: false },
            { id: 't1_3', text: 'إطلاق سبرينت العادات الصغير', description: 'ابدأ بخطوات يومية صغيرة جداً لبناء الالتزام والزخم السلوكي دون مقاومة ذهنية.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'المرحلة الثانية: تعميق التنفيذ ومواجهة تحديات الالتزام',
          duration: `الـ 50% المتوسطة من المدة (${timeframe})`,
          tasks: [
            { id: 't2_1', text: 'تحليل منتصف الطريق وتصحيح المسار', description: 'راجع التحديات التي واجهتك وقم بإجراء تعديلات تكتيكية سريعة لتجاوزها.', completed: false },
            { id: 't2_2', text: 'مضاعفة الجهد في الأنشطة الأساسية', description: 'كرس الجزء الأكبر من وقتك الإنتاجي المتاح للأنشطة التي تحقق 80% من النتائج.', completed: false },
            { id: 't2_3', text: 'تفعيل نظام المساءلة الشخصية', description: 'ثبت نظام متابعة مرئي أو شارك التزامك مع صديق لضمان عدم التراجع.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'المرحلة الثالثة: الدفع النهائي وترسيخ إنجاز الهدف',
          duration: `الـ 30% الأخيرة من المدة (${timeframe})`,
          tasks: [
            { id: 't3_1', text: 'الصقل الأخير والتشطيب الممتاز', description: 'ابذل طاقة قصوى لتشطيب كافة الجوانب المعلقة وتقديم مخرجات ممتازة.', completed: false },
            { id: 't3_2', text: 'مأسسة الهدف في نمط حياتك', description: 'ضع قواعد سلوكية مبسطة لضمان بقاء مكتسبات هذا الهدف متجذرة في حياتك اليومية.', completed: false },
            { id: 't3_3', text: 'التقييم الشامل والاحتفال بالإنجاز', description: 'راجع تقدمك الإجمالي، سجل الدروس العميقة التي تعلمتها، وكافئ نفسك على التزامك.', completed: false }
          ]
        }
      ];
    }

    if (commitment.includes('خفيف')) {
      summary += ' تم ضبط هذه الخطة كخطة **التزام خفيف** لتسهيل تنظيم المهام وتقليل الجهد البدني أو الفكري لترسيخ الاستمرار التراكمي.';
      milestones.forEach(m => {
        m.tasks = m.tasks.slice(0, 2);
      });
    } else if (commitment.includes('عميق')) {
      summary += ' تم تنظيم هذه الخطة في **مسار التركيز المكثف**، لتوفر مهام إضافية وتدريبات متطورة ومسرعة لتحقيق نتائج استثنائية متسارعة.';
      milestones.forEach((m, idx) => {
        m.tasks.push({
          id: `t${idx+1}_extra`,
          text: 'مسرع الأداء النخبوية',
          description: 'قم بإضافة ساعة تدريبية إضافية للبحث المتقدم أو التطبيق العملي لتجاوز المستويات العادية.',
          completed: false
        });
      });
    }
  } else {
    // English defaults
    summary = `This tailored roadmap has been generated for your goal: **"${goal}"** over **${timeframe}**. Based on your preferences (**${scheduleType}** and a **${commitment}** profile), we have structured a high-efficiency timeline designed to maximize retention and prevent burnout.`;

    if (category === 'health') {
      milestones = [
        {
          id: 'm1',
          title: 'Phase 1: Foundation & Conditioning',
          duration: `First 20% of ${timeframe}`,
          tasks: [
            { id: 't1_1', text: 'Baseline Assessment', description: 'Log your starting weights, measurements, or run pacing.', completed: false },
            { id: 't1_2', text: 'Gear & Schedule Setup', description: 'Prepare fitness tracking tools, meal prep containers, and calendar alarms.', completed: false },
            { id: 't1_3', text: 'Stamina Building', description: 'Complete 3 low-intensity workouts focusing entirely on form and posture.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'Phase 2: Progressive Overload & Capacity Expansion',
          duration: `Middle 50% of ${timeframe}`,
          tasks: [
            { id: 't2_1', text: 'Increase Volume', description: 'Add 10-15% intensity, weight, or distance depending on targets.', completed: false },
            { id: 't2_2', text: 'Nutrition Alignment', description: 'Log macro intakes to ensure protein and hydration levels match exertion.', completed: false },
            { id: 't2_3', text: 'Recovery Optimization', description: 'Perform static stretching and schedule active recovery walk days.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'Phase 3: Peak Performance & Habit Stabilization',
          duration: `Final 30% of ${timeframe}`,
          tasks: [
            { id: 't3_1', text: 'Tapering & Testing', description: 'Do a dry-run test of your ultimate metric (e.g. 5K distance run).', completed: false },
            { id: 't3_2', text: 'Consistency Reinforcement', description: 'Maintain your workouts even on highly busy days to anchor the habit.', completed: false },
            { id: 't3_3', text: 'Goal Achievement Review', description: 'Compare final status to Day 1 logs and formulate your next goal.', completed: false }
          ]
        }
      ];
    } else if (category === 'learning') {
      milestones = [
        {
          id: 'm1',
          title: 'Phase 1: Core Mechanics & Conceptual Blueprinting',
          duration: `First 20% of ${timeframe}`,
          tasks: [
            { id: 't1_1', text: 'Environment Prep', description: 'Set up software, configure VSCode/tools, and select 2 primary books or tutorials.', completed: false },
            { id: 't1_2', text: 'Syntactical Core & Fundamentals', description: 'Spend active focus hours mastering core concepts, grammar, or syntax.', completed: false },
            { id: 't1_3', text: 'Micro-experiments', description: 'Build 3 tiny sandbox tests or translate simple sentences to verify retention.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'Phase 2: Active Construction & Synthesizing Projects',
          duration: `Middle 50% of ${timeframe}`,
          tasks: [
            { id: 't2_1', text: 'The Core Project MVP', description: 'Draft the functional structure of your primary learning product/project.', completed: false },
            { id: 't2_2', text: 'Independent Debugging Sprint', description: 'Tackle core issues and research problems without following step-by-step guides.', completed: false },
            { id: 't2_3', text: 'Review and Refine Loop', description: 'Refactor sloppy components or re-read chapters based on friction points in testing.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'Phase 3: Integration, Mastery, & Porting Assets',
          duration: `Final 30% of ${timeframe}`,
          tasks: [
            { id: 't3_1', text: 'Feature Polishing', description: 'Style your UI, proofread scripts, or finalize core performance optimizations.', completed: false },
            { id: 't3_2', text: 'Practical Deployment / Demonstration', description: 'Host your project online, record a demo, or have a 10-minute speech/test.', completed: false },
            { id: 't3_3', text: 'Self-Documentation', description: 'Write a brief blog post, readme, or summary detailing what you mastered.', completed: false }
          ]
        }
      ];
    } else if (category === 'business') {
      milestones = [
        {
          id: 'm1',
          title: 'Phase 1: Validation & Infrastructure Configuration',
          duration: `First 20% of ${timeframe}`,
          tasks: [
            { id: 't1_1', text: 'Target Demographic Interviews', description: 'Speak with 3 potential customers to validate the primary pain point.', completed: false },
            { id: 't1_2', text: 'Landing Page & Brand Identity', description: 'Purchase domain, create a clean logo, and build a glassmorphic sign-up page.', completed: false },
            { id: 't1_3', text: 'Offer & Pricing Definition', description: 'Firmly declare pricing models, discount curves, and core value props.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'Phase 2: Launch Prep & Outreach Engine Activation',
          duration: `Middle 50% of ${timeframe}`,
          tasks: [
            { id: 't2_1', text: 'Lead Magnet Creation', description: 'Publish a useful checklist or tool to start capturing initial emails.', completed: false },
            { id: 't2_2', text: 'Outreach Sprint', description: 'Contact 30-50 high-potential leads directly via cold message, DM, or organic channels.', completed: false },
            { id: 't2_3', text: 'MVP Assembly', description: 'Launch a simplified version of your core service, product, or shop layout.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'Phase 3: Open Cart, Analysis, & Scale Heuristics',
          duration: `Final 30% of ${timeframe}`,
          tasks: [
            { id: 't3_1', text: 'Public Launch Trigger', description: 'Announce open sales to your complete email list and social pipeline.', completed: false },
            { id: 't3_2', text: 'Feedback & Iterate loop', description: 'Compile product issues, handle support inquiries, and polish core flows.', completed: false },
            { id: 't3_3', text: 'Growth Blueprinting', description: 'Analyze conversions, calculate margins, and define marketing channels for scale.', completed: false }
          ]
        }
      ];
    } else {
      milestones = [
        {
          id: 'm1',
          title: 'Phase 1: Mapping & Scaffolding Baseline Habits',
          duration: `First 20% of ${timeframe}`,
          tasks: [
            { id: 't1_1', text: 'Define Core Goals & Boundaries', description: 'Clarify precisely what completion looks like and set specific limits.', completed: false },
            { id: 't1_2', text: 'Workspace Organization', description: 'Prepare physical/digital setups and schedule specific blocks.', completed: false },
            { id: 't1_3', text: 'Inception Sprint', description: 'Initiate small daily efforts to build the behavioral momentum.', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'Phase 2: Execution Depth & Overcoming Friction',
          duration: `Middle 50% of ${timeframe}`,
          tasks: [
            { id: 't2_1', text: 'Midway Checkpoint Analysis', description: 'Review obstacles encountered and make quick tactical changes.', completed: false },
            { id: 't2_2', text: 'Double Down on Core Activities', description: 'Dedicate the bulk of your productive hours directly to primary outputs.', completed: false },
            { id: 't2_3', text: 'Accountability Routine', description: 'Establish progress trackers or check-ins to prevent slippage.', completed: false }
          ]
        },
        {
          id: 'm3',
          title: 'Phase 3: Final Execution & Habit Anchor',
          duration: `Final 30% of ${timeframe}`,
          tasks: [
            { id: 't3_1', text: 'The Ultimate Polish', description: 'Put in high effort to push past standard completions.', completed: false },
            { id: 't3_2', text: 'Systematize the Habit', description: 'Create simple rules to keep this goal integrated into your lifestyle.', completed: false },
            { id: 't3_3', text: 'Retrospective & Celebration', description: 'Review your total log, record key learnings, and award yourself.', completed: false }
          ]
        }
      ];
    }

    if (commitment.toLowerCase().includes('light')) {
      summary += ' This is configured as a **Light Commitment** plan, spacing tasks out and prioritizing low fatigue to encourage high habit-forming retention.';
      milestones.forEach(m => {
        m.tasks = m.tasks.slice(0, 2);
      });
    } else if (commitment.toLowerCase().includes('deep')) {
      summary += ' This is structured as an **Intense Focus** track, providing deeper high-impact exercises and advanced micro-tasks for rapid acceleration.';
      milestones.forEach((m, idx) => {
        m.tasks.push({
          id: `t${idx+1}_extra`,
          text: 'Elite Focus Accelerator',
          description: 'Complete one bonus hour of advanced research or practical training to consolidate details.',
          completed: false
        });
      });
    }
  }

  return {
    title: lang === 'ar' ? `خطة العمل: ${goal}` : `AI Roadmap: ${goal.charAt(0).toUpperCase() + goal.slice(1)}`,
    timeframe,
    summary,
    milestones
  };
}

// Call live APIs (Gemini, OpenAI, or OpenRouter) (Bilingual)
export async function fetchAIQuestions(goal: string, timeframe: string, config: ApiConfig, lang: 'en' | 'ar' = 'en'): Promise<Question[]> {
  if (config.mockMode || !config.apiKey) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockQuestions(goal, timeframe, lang);
  }

  const systemMessage = `You are a professional AI Goal Coach. The user wants to achieve this goal: "${goal}" in "${timeframe}".
You need to generate 3 to 5 highly relevant, specific follow-up questions to refine their goal into a perfect actionable plan.

CRITICAL REQUIREMENTS:
1. One of the questions MUST ask the user about their scheduling preferences (e.g., weekends off, buffer days, time commitment per day, handling missed tasks).
2. Each question MUST have exactly 3 predefined options (Choices 1, 2, and 3) that are highly context-aware and specific to the goal.
3. The response MUST be a valid JSON object containing an array of questions. Follow this exact typescript structure:
{
  "questions": [
    {
      "id": "q1",
      "text": "The question content here?",
      "choices": ["Option 1", "Option 2", "Option 3"]
    }
  ]
}
4. LANGUAGE INSTRUCTION:
${lang === 'ar' 
  ? 'CRITICAL: You MUST write the JSON response fully in ARABIC (all question texts, and all option choices must be in fluent, clear Arabic). Do not output English.' 
  : 'Write the JSON response in fluent English.'}

Do not write anything except the pure JSON. Do not include markdown code block syntax (like \`\`\`json) in the raw response, just output the valid JSON. Make the questions specific, mature, and deeply tailored to the goal (avoid generic template answers).`;

  try {
    let rawContent = '';

    if (config.provider === 'gemini') {
      const response = await fetch(`${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemMessage }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: `Generate follow-up questions for: Goal: "${goal}", Timeframe: "${timeframe}". Output pure JSON object.` }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API returned error ${response.status}: ${errText}`);
      }

      const resJson = await response.json();
      if (resJson.candidates && resJson.candidates[0]?.content?.parts[0]?.text) {
        rawContent = resJson.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error("Empty response from Gemini API");
      }
    } else {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      };

      if (config.provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.href;
        headers['X-Title'] = 'AI Goal Planner';
      }

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `Generate follow-up questions for: Goal: "${goal}", Timeframe: "${timeframe}". Output pure JSON object.` }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API returned error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      rawContent = data.choices[0].message.content.trim();
    }

    const cleanJsonString = rawContent.replace(/```json/i, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonString);
    
    if (parsed && Array.isArray(parsed.questions)) {
      return parsed.questions.map((q: any, index: number) => ({
        id: q.id || `q_${index}`,
        text: q.text,
        choices: [q.choices[0] || '', q.choices[1] || '', q.choices[2] || '']
      }));
    }
    throw new Error("Invalid JSON structure returned by AI");
  } catch (error) {
    console.error("Error in live API questions fetch:", error);
    throw error;
  }
}

export async function fetchGoalPlan(
  goal: string, 
  timeframe: string, 
  qa: Array<{ question: string, answer: string }>, 
  config: ApiConfig,
  lang: 'en' | 'ar' = 'en'
): Promise<GoalPlan> {
  if (config.mockMode || !config.apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockPlan(goal, timeframe, qa, lang);
  }

  const qaSummary = qa.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');

  const systemMessage = `You are a master planner and goal coach. You break down ambitious goals into realistic, beautiful, milestone-driven roadmaps.
The user wants to achieve: "${goal}" in the timeframe "${timeframe}".
They have answered the clarifying questions as follows:
${qaSummary}

You must create a highly customized plan structured as a JSON object matching this TypeScript interface:
interface Task {
  id: string;
  text: string;
  description: string;
  completed: boolean; // default to false
}
interface Milestone {
  id: string;
  title: string;
  duration: string; // e.g., "Days 1-7", "Week 1", etc.
  tasks: Task[];
}
interface GoalPlan {
  title: string;
  timeframe: string;
  summary: string; // A high-level description outlining how this custom plan handles their constraints and schedules
  milestones: Milestone[];
}

CRITICAL RULES:
1. Ensure the timeline matches the timeframe provided. Break the milestones down logically (e.g. 3-4 distinct milestone phases).
2. Ensure you respect their scheduling preferences (such as weekends off, flexible buffers, or strict routines) described in the answers. Reflect these customization details clearly in the task descriptions and the summary.
3. Every milestone must have 2-4 concrete, highly action-oriented tasks. Each task needs a "text" (under 8 words) and a "description" (under 25 words) that explains exactly *how* to do it.
4. LANGUAGE INSTRUCTION:
${lang === 'ar' 
  ? 'CRITICAL: You MUST write the JSON response fully in ARABIC (including title, timeframe, summary, milestone titles, task texts, and task descriptions). Do not output English.' 
  : 'Write the JSON response fully in English.'}

5. Output ONLY the JSON. Do not include markdown code block syntax. Do not output conversational filler. The response must be a single parseable JSON object.`;

  try {
    let rawContent = '';

    if (config.provider === 'gemini') {
      const response = await fetch(`${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemMessage }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: `Generate the complete, customized roadmap JSON.` }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.5
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API returned error ${response.status}: ${errText}`);
      }

      const resJson = await response.json();
      if (resJson.candidates && resJson.candidates[0]?.content?.parts[0]?.text) {
        rawContent = resJson.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error("Empty response from Gemini API");
      }
    } else {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      };

      if (config.provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.href;
        headers['X-Title'] = 'AI Goal Planner';
      }

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `Generate the complete, customized roadmap JSON.` }
          ],
          temperature: 0.5,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API returned error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      rawContent = data.choices[0].message.content.trim();
    }

    const cleanJsonString = rawContent.replace(/```json/i, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonString);

    if (parsed && typeof parsed.title === 'string' && Array.isArray(parsed.milestones)) {
      return {
        title: parsed.title,
        timeframe: parsed.timeframe || timeframe,
        summary: parsed.summary || (lang === 'ar' ? 'مخططك المخصص جاهز الآن.' : 'Your custom roadmap is ready.'),
        milestones: parsed.milestones.map((m: any, mIdx: number) => ({
          id: m.id || `m_${mIdx}`,
          title: m.title || (lang === 'ar' ? `المرحلة ${mIdx + 1}` : `Phase ${mIdx + 1}`),
          duration: m.duration || (lang === 'ar' ? `القسم ${mIdx + 1}` : `Phase ${mIdx + 1}`),
          tasks: Array.isArray(m.tasks) ? m.tasks.map((t: any, tIdx: number) => ({
            id: t.id || `t_${mIdx}_${tIdx}`,
            text: t.text || (lang === 'ar' ? 'خطوة عمل' : 'Action step'),
            description: t.description || (lang === 'ar' ? 'تعليمات للتنفيذ.' : 'Instructions to complete.'),
            completed: false
          })) : []
        }))
      };
    }
    throw new Error("Invalid plan schema returned by AI");
  } catch (error) {
    console.error("Error in live API plan fetch:", error);
    throw error;
  }
}
