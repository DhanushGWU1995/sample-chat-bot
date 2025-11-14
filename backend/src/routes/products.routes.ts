import { Router, Request, Response } from 'express';
import { dbService } from '../database/database';

export const productsRouter = Router();
const db = dbService.getDatabase();

// Get all products
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { type, brand } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    query += ' ORDER BY brand, name';

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

// Get product by model number
productsRouter.get('/:modelNumber', async (req: Request, res: Response) => {
  try {
    const { modelNumber } = req.params;

    db.get(
      'SELECT * FROM products WHERE model_number = ?',
      [modelNumber],
      (err: any, row: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get compatible parts for a product
productsRouter.get('/:modelNumber/parts', async (req: Request, res: Response) => {
  try {
    const { modelNumber } = req.params;

    db.all(
      `SELECT p.*
       FROM parts p
       JOIN compatibility c ON p.id = c.part_id
       JOIN products pr ON c.product_id = pr.id
       WHERE pr.model_number = ?
       ORDER BY p.category, p.name`,
      [modelNumber],
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

// Get troubleshooting guides
productsRouter.get('/troubleshooting/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { issue } = req.query;

    let query = 'SELECT * FROM troubleshooting_guides WHERE product_type = ?';
    const params: any[] = [type];

    if (issue) {
      query += ' AND (issue LIKE ? OR solution LIKE ?)';
      const searchTerm = `%${issue}%`;
      params.push(searchTerm, searchTerm);
    }

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
