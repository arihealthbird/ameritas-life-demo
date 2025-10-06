"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface QuizAnswers {
  goals?: string
  duration?: string
  budget?: string
  cashValue?: string
  dependents?: string
}

interface QuizAnswersStore {
  answers: QuizAnswers
  updateAnswer: (key: keyof QuizAnswers, value: string) => void
  resetAnswers: () => void
}

export const useQuizAnswers = create<QuizAnswersStore>()(
  persist(
    (set) => ({
      answers: {},
      updateAnswer: (key, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [key]: value,
          },
        })),
      resetAnswers: () => set({ answers: {} }),
    }),
    {
      name: "quiz-answers-storage",
    }
  )
)
