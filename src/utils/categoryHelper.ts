export function getCategoryLabel(categoryKey: string): string {
  const map: Record<string, string> = {
    smartphones: "Смартфон",
    laptops: "Ноутбук",
    tablets: "Планшет",
    headphones: "Наушники",
    watches: "Смарт-часы",
    accessories: "Аксессуары",
    computers: "Компьютер",
    periphery: "Периферия",
  };
  return map[categoryKey] || categoryKey;
}
