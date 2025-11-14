import OpenAI from 'openai';
import { dbService } from '../database/database';
import { mockAIService } from './mock-ai.service';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
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

export class DeepSeekService {
    private client: OpenAI;
    private db = dbService.getDatabase();
    private modelName: string;
    private useMockAI: boolean;

    constructor() {
        // Check if we should use mock AI
        this.useMockAI = process.env.USE_MOCK_AI === 'true';

        const apiKey = process.env.DEEPSEEK_API_KEY;
        const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

        // Determine which model to use based on the base URL
        this.modelName = baseURL.includes('openai.com') ? 'gpt-3.5-turbo' : 'deepseek-chat';

        if (this.useMockAI) {
            console.log('🎭 Using MOCK AI Service (Free - No API calls)');
            console.log('💡 To use real AI, set USE_MOCK_AI=false in .env');
        } else {
            if (!apiKey) {
                console.error('DEEPSEEK_API_KEY is not set in environment variables!');
                console.error('Please check your .env file in the backend directory.');
            } else {
                console.log('API key loaded successfully');
                console.log(`Using base URL: ${baseURL}`);
                console.log(`Using model: ${this.modelName}`);
            }
        }

        this.client = new OpenAI({
            apiKey: apiKey || '',
            baseURL: baseURL,
        });
    }

    async analyzeIntent(userMessage: string): Promise<ChatIntent> {
        // Use mock AI if enabled
        if (this.useMockAI) {
            return mockAIService.analyzeIntent(userMessage);
        }

        const systemPrompt = `You are an intent classifier for PartSelect customer support. Analyze user messages and classify them into one of these categories:
        - installation: User asking about how to install a part
        - compatibility: User asking if a part works with their appliance model
        - troubleshooting: User experiencing an issue with their appliance
        - product_search: User looking for specific parts or products
        - general: General questions about products or orders
        - out_of_scope: Questions not related to refrigerator/dishwasher parts

        Extract entities like part numbers (e.g., PS11752778), model numbers (e.g., WDT780SAEM1), product types (refrigerator/dishwasher), and issues.

        Respond ONLY with valid JSON in this format:
        {
        "type": "category",
        "confidence": 0.95,
        "entities": {
            "partNumber": "PS11752778",
            "modelNumber": "WDT780SAEM1",
            "productType": "refrigerator",
            "issue": "ice maker not working"
        }
        }`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.modelName,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.1,
                max_tokens: 500,
            });

            const content = response.choices[0]?.message?.content || '{}';
            return JSON.parse(content);
        } catch (error) {
            console.error('Intent analysis error:', error);
            return { type: 'general', confidence: 0.5 };
        }
    }

    async generateResponse(userMessage: string, intent: ChatIntent, context: any): Promise<string> {
        // Use mock AI if enabled
        if (this.useMockAI) {
            return mockAIService.generateResponse(userMessage, intent, context);
        }

        const systemPrompt = `You are a helpful PartSelect customer support agent specializing in Refrigerator and Dishwasher parts. 

        CRITICAL RULES:
        1. ONLY answer questions about refrigerator and dishwasher parts and repairs
        2. If asked about other topics, politely redirect to refrigerator/dishwasher parts
        3. Always be specific with part numbers and model compatibility
        4. Provide clear, step-by-step instructions when relevant
        5. Recommend specific parts from the database when appropriate
        6. Be helpful but stay focused on the parts catalog

        You have access to:
        - Parts database with part numbers, prices, and availability
        - Model compatibility information
        - Installation guides
        - Troubleshooting solutions

        Format responses with:
        - Clear sections and bullet points
        - Part numbers in **bold** (e.g., **PS11752778**)
        - Pricing information when relevant
        - Links to installation guides
        - Safety warnings when appropriate`;

        const contextMessage = this.buildContextMessage(intent, context);

        try {
            const response = await this.client.chat.completions.create({
                model: this.modelName,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: contextMessage + '\n\nUser question: ' + userMessage }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });

            return response.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
        } catch (error) {
            console.error('Response generation error:', error);
            return 'I apologize, but I encountered an error processing your request. Please try again.';
        }
    }

    private buildContextMessage(intent: ChatIntent, context: any): string {
        let contextMsg = 'Context information:\n\n';

        if (intent.type === 'out_of_scope') {
            return 'The user is asking about something outside refrigerator/dishwasher parts. Politely redirect them.';
        }

        if (context.parts && context.parts.length > 0) {
            contextMsg += 'Relevant Parts:\n';
            context.parts.forEach((part: any) => {
                contextMsg += `- Part ${part.part_number}: ${part.name} - $${part.price} (${part.in_stock ? 'In Stock' : 'Out of Stock'})\n`;
                contextMsg += `  Category: ${part.category}, Description: ${part.description}\n`;
            });
            contextMsg += '\n';
        }

        if (context.compatibility && context.compatibility.length > 0) {
            contextMsg += 'Compatibility Information:\n';
            contextMsg += `Part ${context.compatibility[0].part_number} is compatible with:\n`;
            context.compatibility.forEach((comp: any) => {
                contextMsg += `- ${comp.model_number} (${comp.product_name})\n`;
            });
            contextMsg += '\n';
        }

        if (context.installationGuide) {
            const guide = context.installationGuide;
            contextMsg += 'Installation Guide:\n';
            contextMsg += `Difficulty: ${guide.difficulty}\n`;
            contextMsg += `Estimated Time: ${guide.estimated_time}\n`;
            contextMsg += `Tools Required: ${guide.tools_required}\n`;
            contextMsg += `Instructions:\n${guide.instructions}\n\n`;
        }

        if (context.troubleshooting && context.troubleshooting.length > 0) {
            contextMsg += 'Troubleshooting Information:\n';
            context.troubleshooting.forEach((ts: any) => {
                contextMsg += `Issue: ${ts.issue}\n`;
                contextMsg += `Solution:\n${ts.solution}\n`;
                if (ts.related_parts) {
                    contextMsg += `Related Parts: ${ts.related_parts}\n`;
                }
                contextMsg += '\n';
            });
        }

        if (context.products && context.products.length > 0) {
            contextMsg += 'Relevant Products:\n';
            context.products.forEach((product: any) => {
                contextMsg += `- ${product.model_number}: ${product.name} (${product.brand} ${product.type})\n`;
            });
            contextMsg += '\n';
        }

        return contextMsg;
    }

    async chat(userMessage: string, sessionId: string, conversationHistory: ChatMessage[] = []): Promise<{
        response: string;
        intent: ChatIntent;
        suggestedParts?: any[];
    }> {
        // Analyze intent
        const intent = await this.analyzeIntent(userMessage);

        // Gather relevant context based on intent
        const context = await this.gatherContext(intent);

        // Generate response
        const response = await this.generateResponse(userMessage, intent, context);

        // Save to chat history
        this.saveChatHistory(sessionId, userMessage, response, intent.type);

        return {
            response,
            intent,
            suggestedParts: context.parts || []
        };
    }

    private async gatherContext(intent: ChatIntent): Promise<any> {
        const context: any = {};

        try {
            // Get parts based on entities
            if (intent.entities?.partNumber) {
                context.parts = await this.getPartByNumber(intent.entities.partNumber);
                if (context.parts.length > 0) {
                    context.compatibility = await this.getCompatibility(context.parts[0].id);
                    context.installationGuide = await this.getInstallationGuide(context.parts[0].id);
                }
            }

            // Get product info
            if (intent.entities?.modelNumber) {
                context.products = await this.getProductByModel(intent.entities.modelNumber);
                if (context.products.length > 0) {
                    context.compatibleParts = await this.getCompatibleParts(context.products[0].id);
                }
            }

            // Get troubleshooting info
            if (intent.type === 'troubleshooting' && intent.entities?.issue) {
                context.troubleshooting = await this.getTroubleshootingGuides(
                    intent.entities.productType || 'refrigerator',
                    intent.entities.issue
                );
            }

            // Get parts by category for general searches
            if (intent.type === 'product_search' && intent.entities?.productType) {
                context.parts = await this.searchPartsByType(intent.entities.productType);
            }

        } catch (error) {
            console.error('Error gathering context:', error);
        }

        return context;
    }

    private getPartByNumber(partNumber: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM parts WHERE part_number LIKE ?`,
                [`%${partNumber}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    private getProductByModel(modelNumber: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM products WHERE model_number LIKE ?`,
                [`%${modelNumber}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    private getCompatibility(partId: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT p.part_number, pr.model_number, pr.name as product_name, pr.brand
         FROM compatibility c
         JOIN parts p ON c.part_id = p.id
         JOIN products pr ON c.product_id = pr.id
         WHERE c.part_id = ?`,
                [partId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    private getCompatibleParts(productId: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT p.* FROM parts p
         JOIN compatibility c ON p.id = c.part_id
         WHERE c.product_id = ?`,
                [productId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    private getInstallationGuide(partId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM installation_guides WHERE part_id = ?`,
                [partId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row || null);
                }
            );
        });
    }

    private getTroubleshootingGuides(productType: string, issue: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM troubleshooting_guides 
         WHERE product_type LIKE ? AND (issue LIKE ? OR solution LIKE ?)`,
                [`%${productType}%`, `%${issue}%`, `%${issue}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    private searchPartsByType(productType: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT DISTINCT p.* FROM parts p
         JOIN compatibility c ON p.id = c.part_id
         JOIN products pr ON c.product_id = pr.id
         WHERE pr.type LIKE ?
         LIMIT 10`,
                [`%${productType}%`],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });
    }

    private saveChatHistory(sessionId: string, userMessage: string, botResponse: string, intent: string): void {
        this.db.run(
            `INSERT INTO chat_history (session_id, user_message, bot_response, intent) VALUES (?, ?, ?, ?)`,
            [sessionId, userMessage, botResponse, intent],
            (err) => {
                if (err) console.error('Error saving chat history:', err);
            }
        );
    }
}

export const deepSeekService = new DeepSeekService();
