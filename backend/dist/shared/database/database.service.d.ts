import { OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
export declare class DatabaseService implements OnModuleInit {
    private db;
    onModuleInit(): void;
    private initializeDatabase;
    query<T = unknown>(sql: string, params?: unknown[]): T[];
    queryOne<T = unknown>(sql: string, params?: unknown[]): T | null;
    execute(sql: string, params?: unknown[]): Database.RunResult;
    getDatabase(): Database.Database;
}
