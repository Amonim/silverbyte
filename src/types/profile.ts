export interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  total: number;
  reward: number;
}

export interface ProfileStats {
  points: number;
  level: number;
  progressToNext: number;
  nextLevelPoints: number;
  achievements: Achievement[];
  prefix: string;
  discount: number;
}
