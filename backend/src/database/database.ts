import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.db');

export class DatabaseService {
  private db: Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.initializeTables();
  }

  private initializeTables(): void {
    this.db.serialize(() => {
      // Products table (Refrigerators and Dishwashers)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          model_number TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          brand TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Parts table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS parts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          part_number TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          price DECIMAL(10, 2),
          in_stock BOOLEAN DEFAULT 1,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Compatibility table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS compatibility (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          part_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          FOREIGN KEY (part_id) REFERENCES parts(id),
          FOREIGN KEY (product_id) REFERENCES products(id),
          UNIQUE(part_id, product_id)
        )
      `);

      // Installation guides table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS installation_guides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          part_id INTEGER NOT NULL,
          instructions TEXT NOT NULL,
          difficulty TEXT,
          estimated_time TEXT,
          tools_required TEXT,
          video_url TEXT,
          FOREIGN KEY (part_id) REFERENCES parts(id)
        )
      `);

      // Chat history table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS chat_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          user_message TEXT NOT NULL,
          bot_response TEXT NOT NULL,
          intent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Troubleshooting guides table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS troubleshooting_guides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_type TEXT NOT NULL,
          issue TEXT NOT NULL,
          solution TEXT NOT NULL,
          related_parts TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }

  public getDatabase(): Database {
    return this.db;
  }

  public close(): void {
    this.db.close();
  }
}

export const dbService = new DatabaseService();
