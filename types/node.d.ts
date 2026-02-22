// Temporary type declaration until @types/node is installed
// This file will be replaced when you run: npm install

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
