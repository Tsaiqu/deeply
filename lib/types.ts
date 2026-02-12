export interface Question {
  id: string;
  content: string;
  category_id: string;
  is_premium: boolean;
  created_at: string;
}

export type GameSessionState = {
  currentQuestionIndex: number;
  totalQuestions: number;
  isSafeMode: boolean;
};
