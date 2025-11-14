import { Router, Request, Response } from 'express';
import { dbService } from '../database/database';

export const partsRouter = Router();
const db = dbService.getDatabase();

// Get all parts
partsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM parts WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR part_number LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY name';

    db.all(query, params, (err: any, rows: any) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get part by part number
partsRouter.get('/:partNumber', async (req: Request, res: Response) => {
  try {
    const { partNumber } = req.params;

    db.get(
      'SELECT * FROM parts WHERE part_number = ?',
      [partNumber],
      (err: any, row: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(404).json({ error: 'Part not found' });
        }
        res.json(row);
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get part compatibility
partsRouter.get('/:partNumber/compatibility', async (req: Request, res: Response) => {
  try {
    const { partNumber } = req.params;

    db.all(
      `SELECT pr.model_number, pr.name, pr.brand, pr.type
       FROM compatibility c
       JOIN parts p ON c.part_id = p.id
       JOIN products pr ON c.product_id = pr.id
       WHERE p.part_number = ?`,
      [partNumber],
      (err: any, rows: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(rows);
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get installation guide
partsRouter.get('/:partNumber/installation', async (req: Request, res: Response) => {
  try {
    const { partNumber } = req.params;

    db.get(
      `SELECT ig.* 
       FROM installation_guides ig
       JOIN parts p ON ig.part_id = p.id
       WHERE p.part_number = ?`,
      [partNumber],
      (err: any, row: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(404).json({ error: 'Installation guide not found' });
        }
        res.json(row);
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check compatibility with model
partsRouter.post('/check-compatibility', async (req: Request, res: Response) => {
  try {
    const { partNumber, modelNumber } = req.body;

    if (!partNumber || !modelNumber) {
      return res.status(400).json({ error: 'Part number and model number are required' });
    }

    db.get(
      `SELECT COUNT(*) as count
       FROM compatibility c
       JOIN parts p ON c.part_id = p.id
       JOIN products pr ON c.product_id = pr.id
       WHERE p.part_number = ? AND pr.model_number = ?`,
      [partNumber, modelNumber],
      (err: any, row: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          compatible: row.count > 0,
          partNumber,
          modelNumber
        });
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
