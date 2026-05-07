export type AdminOrder = {
  id: string;
  customerName: string;
  totalPrice: number;
  date: string;
  status: "В обработке" | "Подтвержден" | "Передан курьеру" | "Доставлен";
};

export const mockAdminOrders: AdminOrder[] = [
  {
    id: "ORD-001",
    customerName: "Иван Иванов",
    totalPrice: 649990,
    date: "2023-10-25T14:30:00Z",
    status: "Доставлен"
  },
  {
    id: "ORD-002",
    customerName: "Анна Смирнова",
    totalPrice: 159990,
    date: "2023-10-26T09:15:00Z",
    status: "Передан курьеру"
  },
  {
    id: "ORD-003",
    customerName: "Алексей Петров",
    totalPrice: 899990,
    date: "2023-10-26T16:45:00Z",
    status: "Подтвержден"
  },
  {
    id: "ORD-004",
    customerName: "Мария Кузнецова",
    totalPrice: 69990,
    date: "2023-10-27T10:00:00Z",
    status: "В обработке"
  },
  {
    id: "ORD-005",
    customerName: "Дмитрий Соколов",
    totalPrice: 729990,
    date: "2023-10-27T11:20:00Z",
    status: "В обработке"
  }
];
