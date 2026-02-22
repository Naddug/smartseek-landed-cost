// Temporary type declaration until Prisma Client is generated
// This file will be replaced when you run: npx prisma generate

declare module '@prisma/client' {
  export class PrismaClient {
    constructor(options?: {
      log?: Array<'query' | 'info' | 'warn' | 'error'>;
    });
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(event: string, callback: (e: any) => void): void;
    [key: string]: any;
  }
}
