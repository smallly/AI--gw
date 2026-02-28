export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  crm_bound: boolean;
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  industry: string;
  area: string;
  region: string;
  type: string;
  client_name: string;
  client_phone: string;
  stage: string;
  last_contact: string;
  remarks: string;
}

export interface Plan {
  id: number;
  project_id: number;
  user_id: number;
  time: string;
  action: string;
  topic: string;
  goal: string;
  status: 'pending' | 'completed';
}

export interface DrillRecord {
  id: number;
  user_id: number;
  project_id?: number;
  scenario_type: string;
  transcript: string; // JSON string
  score: number;
  feedback: string; // JSON string
  created_at: string;
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'chat' | 'drill' | 'analysis' | 'gtv_binding' | 'transcription';
  metadata?: any;
}
