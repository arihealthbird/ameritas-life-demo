import QuizPageWrapper from "@/components/quiz/QuizPageWrapper"
import type { ReactNode } from "react"

interface QuizLayoutProps {
  children: ReactNode
}

export default function QuizLayout({ children }: QuizLayoutProps) {
  return <QuizPageWrapper className="bg-white">{children}</QuizPageWrapper>
}
