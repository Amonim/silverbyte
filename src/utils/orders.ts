export function createOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
}
