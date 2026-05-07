export type AdminUser = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  registrationDate: string;
  ordersCount: number;
  isBlocked: boolean;
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: "USR-001",
    username: "ivan_ivanov",
    email: "ivan@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    registrationDate: "2023-01-15T00:00:00Z",
    ordersCount: 5,
    isBlocked: false
  },
  {
    id: "USR-002",
    username: "anna_smirnova",
    email: "anna@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    registrationDate: "2023-03-22T00:00:00Z",
    ordersCount: 2,
    isBlocked: false
  },
  {
    id: "USR-003",
    username: "alex_petrov",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    registrationDate: "2023-06-10T00:00:00Z",
    ordersCount: 1,
    isBlocked: false
  },
  {
    id: "USR-004",
    username: "maria_kuznetsova",
    email: "maria@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    registrationDate: "2023-08-05T00:00:00Z",
    ordersCount: 8,
    isBlocked: false
  },
  {
    id: "USR-005",
    username: "dmitry_sokolov",
    email: "dmitry@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry",
    registrationDate: "2023-10-12T00:00:00Z",
    ordersCount: 0,
    isBlocked: true
  }
];
