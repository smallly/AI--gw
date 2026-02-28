async function callAI(
  messages: Array<{ role: string; content: string }>,
  jsonMode = false,
  systemInstruction?: string
): Promise<string> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, jsonMode, systemInstruction }),
  });
  const data = await response.json();
  return data.content || '';
}

export interface ProjectInfo {
  name: string;
  industry: string;
  area: string;
  region: string;
  type: string;
  clientName: string;
  stage: string;
  remarks?: string;
}

export interface FollowUpPlan {
  time: string;
  action: string;
  topic: string;
  goal: string;
}

export interface AnalysisReport {
  industryAnalysis: string;
  projectAnalysis: string;
  plans: FollowUpPlan[];
  strategy: string;
}

export async function analyzeProject(project: ProjectInfo): Promise<AnalysisReport> {
  const prompt = `你是一个资深的产业地产金牌经纪人。请分析以下项目并制定跟进计划和策略，以JSON格式返回。

项目信息:
名称: ${project.name}
行业: ${project.industry}
需求面积: ${project.area}
意向区域: ${project.region}
载体类型: ${project.type}
当前阶段: ${project.stage}
备注: ${project.remarks || '无'}

请返回如下JSON格式:
{
  "industryAnalysis": "行业选址特征分析",
  "projectAnalysis": "项目具体情况分析",
  "plans": [
    {"time": "第1步/近期", "action": "行动类型", "topic": "话题内容", "goal": "行动目标"},
    {"time": "第2步/中期", "action": "行动类型", "topic": "话题内容", "goal": "行动目标"},
    {"time": "第3步/后续", "action": "行动类型", "topic": "话题内容", "goal": "行动目标"}
  ],
  "strategy": "跟进策略建议"
}`;

  try {
    const content = await callAI([{ role: 'user', content: prompt }], true);
    return JSON.parse(content);
  } catch (error) {
    console.error('Analysis Error:', error);
    throw error;
  }
}

export async function getDrillFeedback(
  transcript: { role: string; content: string }[],
  project?: ProjectInfo
) {
  const prompt = `你是一个资深的产业地产销售教练。请对以下模拟演练对话进行评估，以JSON格式返回评估结果。

${project ? `项目背景: ${JSON.stringify(project)}` : '场景: 通用行业选址演练'}

对话记录:
${transcript.map((t) => `${t.role}: ${t.content}`).join('\n')}

请返回如下JSON格式:
{
  "score": 85,
  "advantages": ["优点1", "优点2"],
  "improvements": ["改进点1", "改进点2"],
  "topicCoverage": [{"topic": "话题", "status": "已覆盖"}],
  "objectionHandling": "异议处理评估",
  "skills": {"questioning": 80, "information": 75, "speed": 70, "push": 85},
  "nextSteps": ["建议1", "建议2"]
}`;

  const content = await callAI([{ role: 'user', content: prompt }], true);
  return JSON.parse(content || '{}');
}

export async function getChatResponse(
  messages: { role: string; content: string }[],
  isDrill = false,
  project?: ProjectInfo
) {
  const systemInstruction = isDrill
    ? `你是一个正在寻找厂房的客户决策人。基于以下项目背景进行模拟演练：${JSON.stringify(project || {})}。你要表现得真实，有疑虑（如价格、配套、周期），并根据经纪人的回答进行追问。如果经纪人表现得好，可以表示满意；如果不好，可以表达不满或犹豫。对话要简洁，像真实沟通一样。`
    : '你是一个资深的产业地产金牌经纪人助手。';

  try {
    const apiMessages = messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));
    return await callAI(apiMessages, false, systemInstruction);
  } catch (error) {
    console.error('Chat AI Error:', error);
    return '抱歉，AI 暂时无法回应，请稍后再试。';
  }
}
