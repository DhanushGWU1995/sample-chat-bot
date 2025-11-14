import { Router, Request, Response } from 'express';
import { deepSeekService } from '../services/deepseek.service';
import { v4 as uuidv4 } from 'uuid';

export const chatRouter = Router();

// In-memory session storage (in production, use Redis or similar)
const sessions = new Map<string, any>();

// Create new chat session
chatRouter.post('/session', async (req: Request, res: Response) => {
  try {
    const sessionId = uuidv4();
    sessions.set(sessionId, {
      id: sessionId,
      createdAt: new Date(),
      messages: []
    });
    
    res.json({ 
      sessionId,
      message: 'Welcome to PartSelect Chat! How can I help you with refrigerator or dishwasher parts today?' 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
chatRouter.post('/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        createdAt: new Date(),
        messages: []
      };
      sessions.set(sessionId, session);
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response
    const result = await deepSeekService.chat(message, sessionId, session.messages);

    // Add assistant message to session
    session.messages.push({
      role: 'assistant',
      content: result.response,
      timestamp: new Date()
    });

    res.json({
      response: result.response,
      intent: result.intent,
      suggestedParts: result.suggestedParts,
      sessionId
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

// Get chat history
chatRouter.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId,
      messages: session.messages,
      createdAt: session.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear session
chatRouter.delete('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    sessions.delete(sessionId);
    res.json({ message: 'Session cleared successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
