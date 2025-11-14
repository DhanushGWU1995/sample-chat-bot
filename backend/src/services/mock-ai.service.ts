import { ChatIntent } from '../services/deepseek.service';

/**
 * Mock AI Service - Pre-written responses for demo/development
 * No API calls needed - completely free!
 */
export class MockAIService {
  
  /**
   * Analyze user intent (mock version)
   */
  analyzeIntent(userMessage: string): ChatIntent {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for part numbers
    const partNumberMatch = userMessage.match(/PS\d{8}/i);
    const modelNumberMatch = userMessage.match(/[A-Z]{3}\d{6}[A-Z]{2,4}\d?/i);
    
    // Check if message is related to our scope (refrigerator/dishwasher parts)
    const inScopeKeywords = [
      'refrigerator', 'fridge', 'dishwasher', 'appliance',
      'ice maker', 'water valve', 'pump', 'filter', 'door seal',
      'install', 'installation', 'compatible', 'compatibility', 'part',
      'fix', 'repair', 'broken', 'not working', 'troubleshoot',
      'whirlpool', 'ge', 'lg', 'samsung', 'maytag', 'frigidaire',
      'not draining', 'not cooling', 'leaking', 'noisy', 'not cleaning'
    ];
    
    const hasInScopeKeyword = inScopeKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasPartNumber = partNumberMatch !== null;
    const hasModelNumber = modelNumberMatch !== null;
    
    // If no in-scope indicators found, mark as out of scope
    if (!hasInScopeKeyword && !hasPartNumber && !hasModelNumber) {
      return {
        type: 'out_of_scope',
        confidence: 0.95,
        entities: {}
      };
    }
    
    // Installation intent
    if (lowerMessage.includes('install') || lowerMessage.includes('installation')) {
      return {
        type: 'installation',
        confidence: 0.95,
        entities: {
          partNumber: partNumberMatch ? partNumberMatch[0] : undefined
        }
      };
    }
    
    // Compatibility intent
    if (lowerMessage.includes('compatible') || lowerMessage.includes('compatibility') || 
        lowerMessage.includes('work with') || lowerMessage.includes('fit')) {
      return {
        type: 'compatibility',
        confidence: 0.95,
        entities: {
          partNumber: partNumberMatch ? partNumberMatch[0] : undefined,
          modelNumber: modelNumberMatch ? modelNumberMatch[0] : undefined
        }
      };
    }
    
    // Troubleshooting intent
    if (lowerMessage.includes('not working') || lowerMessage.includes('broken') || 
        lowerMessage.includes('fix') || lowerMessage.includes('repair') ||
        lowerMessage.includes('problem') || lowerMessage.includes('issue') ||
        lowerMessage.includes('not draining') || lowerMessage.includes('not cooling')) {
      
      let issue = '';
      let productType = '';
      
      if (lowerMessage.includes('ice maker')) issue = 'ice maker not working';
      if (lowerMessage.includes('not draining')) issue = 'not draining';
      if (lowerMessage.includes('not cooling')) issue = 'not cooling';
      if (lowerMessage.includes('not cleaning')) issue = 'poor cleaning performance';
      
      if (lowerMessage.includes('refrigerator') || lowerMessage.includes('fridge')) {
        productType = 'refrigerator';
      } else if (lowerMessage.includes('dishwasher')) {
        productType = 'dishwasher';
      }
      
      return {
        type: 'troubleshooting',
        confidence: 0.90,
        entities: {
          issue: issue || 'general issue',
          productType: productType || 'refrigerator'
        }
      };
    }
    
    // Product search
    if (lowerMessage.includes('show me') || lowerMessage.includes('find') || 
        lowerMessage.includes('looking for') || lowerMessage.includes('need')) {
      
      let productType = '';
      if (lowerMessage.includes('dishwasher')) productType = 'dishwasher';
      if (lowerMessage.includes('refrigerator') || lowerMessage.includes('fridge')) productType = 'refrigerator';
      
      return {
        type: 'product_search',
        confidence: 0.85,
        entities: {
          productType
        }
      };
    }
    
    // Default to general (if in scope but no specific intent matched)
    return {
      type: 'general',
      confidence: 0.70,
      entities: {}
    };
  }
  
  /**
   * Generate response based on intent and context (mock version)
   */
  generateResponse(userMessage: string, intent: ChatIntent, context: any): string {
    // Out of scope responses
    if (intent.type === 'out_of_scope') {
      return `I appreciate your question, but I'm specifically designed to help with refrigerator and dishwasher parts. I can assist you with:

- Finding the right parts for your appliance
- Installation instructions
- Compatibility checks
- Troubleshooting common issues

How can I help you with refrigerator or dishwasher parts today?`;
    }
    
    // Installation responses
    if (intent.type === 'installation') {
      if (context.installationGuide) {
        const guide = context.installationGuide;
        const part = context.parts && context.parts[0];
        
        return `I'll help you install ${part ? `**${part.part_number}** - ${part.name}` : 'this part'}.

**Installation Details:**
- **Difficulty:** ${guide.difficulty}
- **Estimated Time:** ${guide.estimated_time}
- **Tools Required:** ${guide.tools_required}

**Step-by-Step Instructions:**

${guide.instructions}

**Safety Tips:**
- Always unplug the appliance before starting
- Turn off water supply if applicable
- Have towels ready for any water spillage
- Don't overtighten screws

${part && part.in_stock ? `This part is currently **in stock** for **$${part.price.toFixed(2)}**.` : ''}

Need any clarification on specific steps? Feel free to ask!`;
      }
      
      return `I can help you with installation instructions! To provide specific guidance, I need:

1. The part number (e.g., PS11752778)
2. Your appliance model number (optional but helpful)

Could you provide the part number you'd like to install?`;
    }
    
    // Compatibility responses
    if (intent.type === 'compatibility') {
      if (context.parts && context.parts.length > 0 && context.compatibility) {
        const part = context.parts[0];
        const compatibleModels = context.compatibility;
        
        return `**Compatibility Check for ${part.part_number}**

✅ **${part.name}** is compatible with the following models:

${compatibleModels.map((c: any) => `- **${c.model_number}** - ${c.product_name} (${c.brand})`).join('\n')}

**Part Details:**
- **Category:** ${part.category}
- **Price:** $${part.price.toFixed(2)}
- **Status:** ${part.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
- **Description:** ${part.description}

${intent.entities?.modelNumber ? `\nYour model **${intent.entities.modelNumber}** ${compatibleModels.some((c: any) => c.model_number === intent.entities?.modelNumber) ? '**is compatible** with this part! ✅' : 'may not be in our compatibility list. Please verify your model number.'}` : ''}

Would you like installation instructions for this part?`;
      }
      
      return `I can check part compatibility for you! Please provide:

1. **Part number** (e.g., PS11752778)
2. **Your appliance model number** (e.g., WDT780SAEM1)

This will help me verify if the part fits your appliance.`;
    }
    
    // Troubleshooting responses
    if (intent.type === 'troubleshooting') {
      if (context.troubleshooting && context.troubleshooting.length > 0) {
        const guide = context.troubleshooting[0];
        
        return `I can help you troubleshoot this issue with your ${intent.entities?.productType || 'appliance'}!

**Issue: ${guide.issue}**

${guide.solution}

${guide.related_parts ? `\n**Recommended Parts:**\n${guide.related_parts.split(',').map((p: string) => `- Part ${p.trim()}`).join('\n')}` : ''}

${context.parts && context.parts.length > 0 ? `\n**Available Parts:**\n${context.parts.map((p: any) => `- **${p.part_number}** - ${p.name} ($${p.price.toFixed(2)}) - ${p.in_stock ? 'In Stock' : 'Out of Stock'}`).join('\n')}` : ''}

Have you tried these steps? Let me know if you need more specific guidance!`;
      }
      
      return `I understand you're experiencing an issue. To help you better, could you provide more details?

- What appliance? (Refrigerator or Dishwasher)
- What's the specific problem?
- Your model number (if available)

Common issues I can help with:
- Ice maker not working
- Not cooling properly
- Not draining
- Poor cleaning performance`;
    }
    
    // Product search responses
    if (intent.type === 'product_search') {
      if (context.parts && context.parts.length > 0) {
        return `Here are the ${intent.entities?.productType || ''} parts I found:

${context.parts.map((p: any) => `**${p.part_number}** - ${p.name}
- Category: ${p.category}
- Price: $${p.price.toFixed(2)}
- Status: ${p.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
- Description: ${p.description}
`).join('\n')}

Would you like more information about any of these parts, such as:
- Installation instructions
- Compatibility with your model
- Detailed specifications`;
      }
      
      return `I can help you find parts! What are you looking for?

Popular categories:
- Ice Maker parts
- Water valves and filters
- Dishwasher spray arms
- Pumps and motors
- Door gaskets and seals
- Temperature controls

Let me know what you need!`;
    }
    
    // General responses
    return `Hello! I'm your PartSelect assistant specializing in refrigerator and dishwasher parts.

I can help you with:
✅ **Installation Instructions** - Step-by-step guides for installing parts
✅ **Compatibility Checks** - Verify if parts work with your appliance model
✅ **Troubleshooting** - Diagnose and fix common issues
✅ **Part Search** - Find the right parts for your needs

**Example questions:**
- "How do I install part number PS11752778?"
- "Is PS11754026 compatible with my WDT780SAEM1?"
- "My ice maker is not working. How can I fix it?"
- "Show me dishwasher spray arms"

How can I assist you today?`;
  }
}

export const mockAIService = new MockAIService();
