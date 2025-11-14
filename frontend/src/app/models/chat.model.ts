export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedParts?: Part[];
}

export interface Part {
  id: number;
  part_number: string;
  name: string;
  description: string;
  category: string;
  price: number;
  in_stock: boolean;
  image_url: string;
}

export interface Product {
  id: number;
  model_number: string;
  name: string;
  type: string;
  brand: string;
  description: string;
}

export interface ChatIntent {
  type: 'installation' | 'compatibility' | 'troubleshooting' | 'product_search' | 'general' | 'out_of_scope';
  confidence: number;
  entities?: {
    partNumber?: string;
    modelNumber?: string;
    productType?: string;
    issue?: string;
  };
}

export interface ChatResponse {
  response: string;
  intent: ChatIntent;
  suggestedParts?: Part[];
  sessionId: string;
}

export interface InstallationGuide {
  id: number;
  part_id: number;
  instructions: string;
  difficulty: string;
  estimated_time: string;
  tools_required: string;
  video_url?: string;
}

export interface CompatibilityInfo {
  model_number: string;
  name: string;
  brand: string;
  type: string;
}
