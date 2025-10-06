import { Network, SearchCheck, HeartPulse } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StageMessage {
  title: string
  icon: LucideIcon
  description?: string
}

export const getStageMessages = (zipCode: string): StageMessage[] => [
  {
    title: "Connecting to healthcare network",
    icon: Network,
    description: "Establishing secure connection",
  },
  {
    title: `Finding plans in ${zipCode}`,
    icon: SearchCheck,
    description: "Searching your area",
  },
  {
    title: "Analyzing your best matches",
    icon: HeartPulse,
    description: "Matching your healthcare needs",
  },
]
