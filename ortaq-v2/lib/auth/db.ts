export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
