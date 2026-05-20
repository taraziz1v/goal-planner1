export interface ApiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  provider: 'openai' | 'openrouter';
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
  apiKey: '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  provider: 'openai',
  mockMode: true,
};

// Load configurations
export function getApiConfig(): ApiConfig {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
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
  
  const healthKeywords = ['run', 'fit', 'gym', 'workout', 'diet', 'weight', 'lose', 'muscle', 'marathon', 'swim', 'health', 'train', 'walk', 'yoga'];
  if (healthKeywords.some(keyword => lowerGoal.includes(keyword))) {
    return 'health';
  }

  const learningKeywords = ['learn', 'code', 'study', 'read', 'speak', 'language', 'python', 'javascript', 'react', 'course', 'degree', 'book', 'write', 'paint', 'guitar', 'piano', 'typescript'];
  if (learningKeywords.some(keyword => lowerGoal.includes(keyword))) {
    return 'learning';
  }

  const businessKeywords = ['business', 'start', 'launch', 'marketing', 'sell', 'product', 'company', 'website', 'app', 'money', 'revenue', 'hustle', 'invest', 'store', 'shop'];
  if (businessKeywords.some(keyword => lowerGoal.includes(keyword))) {
    return 'business';
  }

  return 'general';
}

// High-fidelity Mock Questions
export function getMockQuestions(goal: string, _timeframe: string): Question[] {
  const category = analyzeGoal(goal);

  const list: Question[] = [];

  // Question 1: Experience / Baseline
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

  // Question 2: Weekly Time Commitment
  list.push({
    id: 'q2',
    text: 'How many hours per week can you realistically dedicate to this goal?',
    choices: [
      'Light Commitment: 2-4 hours per week',
      'Medium Commitment: 5-8 hours per week',
      'Deep Focus: 10+ hours per week'
    ]
  });

  // Question 3: CRITICAL REQUIREMENT - Scheduling and missed tasks preference
  list.push({
    id: 'q3',
    text: 'How would you prefer to structure your schedule and handle potential missed tasks?',
    choices: [
      'Strict & Consistent: Daily tasks, weekends off, double up if missed',
      'Flexible Flow: Weekly task lists, buffer days built-in for catchups',
      'Intense Sprint: High-intensity weekdays, active weekends, no buffer'
    ]
  });

  // Question 4: Primary Motivator / Goal Style
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

  return list;
}

// High-fidelity Mock Roadmap Generator
export function getMockPlan(goal: string, timeframe: string, qa: Array<{ question: string, answer: string }>): GoalPlan {
  const category = analyzeGoal(goal);
  
  // Extract details from answers
  const commitment = qa.find(item => item.question.includes('hours per week'))?.answer || 'Medium Commitment';
  const scheduleType = qa.find(item => item.question.includes('schedule'))?.answer || 'Flexible Flow';

  let summary = `This tailored roadmap has been generated for your goal: **"${goal}"** over **${timeframe}**. Based on your preferences (**${scheduleType}** and a **${commitment}** profile), we have structured a high-efficiency timeline designed to maximize retention and prevent burnout.`;
  
  let milestones: Milestone[] = [];

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

  // Adjust tasks based on user time commitment answer
  if (commitment.toLowerCase().includes('light')) {
    summary += ' This is configured as a **Light Commitment** plan, spacing tasks out and prioritizing low fatigue to encourage high habit-forming retention.';
    milestones.forEach(m => {
      m.tasks = m.tasks.slice(0, 2); // remove last task to reduce workload
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

  return {
    title: `AI Roadmap: ${goal.charAt(0).toUpperCase() + goal.slice(1)}`,
    timeframe,
    summary,
    milestones
  };
}

// Call live OpenAI or OpenRouter APIs
export async function fetchAIQuestions(goal: string, timeframe: string, config: ApiConfig): Promise<Question[]> {
  if (config.mockMode || !config.apiKey) {
    // Delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockQuestions(goal, timeframe);
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
Do not write anything except the pure JSON. Do not include markdown code block syntax (like \`\`\`json) in the raw response, just output the valid JSON. Make the questions specific, mature, and deeply tailored to the goal (avoid generic template answers).`;

  try {
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
    const rawContent = data.choices[0].message.content.trim();
    const parsed = JSON.parse(rawContent);
    
    if (parsed && Array.isArray(parsed.questions)) {
      return parsed.questions.map((q: any, index: number) => ({
        id: q.id || `q_${index}`,
        text: q.text,
        choices: [q.choices[0], q.choices[1], q.choices[2]]
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
  config: ApiConfig
): Promise<GoalPlan> {
  if (config.mockMode || !config.apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockPlan(goal, timeframe, qa);
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
4. Output ONLY the JSON. Do not include markdown code block syntax. Do not output conversational filler. The response must be a single parseable JSON object.`;

  try {
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
    const rawContent = data.choices[0].message.content.trim();
    const parsed = JSON.parse(rawContent);

    // Schema Validation & Correction
    if (parsed && typeof parsed.title === 'string' && Array.isArray(parsed.milestones)) {
      return {
        title: parsed.title,
        timeframe: parsed.timeframe || timeframe,
        summary: parsed.summary || 'Your custom roadmap is ready.',
        milestones: parsed.milestones.map((m: any, mIdx: number) => ({
          id: m.id || `m_${mIdx}`,
          title: m.title || `Phase ${mIdx + 1}`,
          duration: m.duration || `Phase ${mIdx + 1}`,
          tasks: Array.isArray(m.tasks) ? m.tasks.map((t: any, tIdx: number) => ({
            id: t.id || `t_${mIdx}_${tIdx}`,
            text: t.text || 'Action step',
            description: t.description || 'Instructions to complete.',
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
