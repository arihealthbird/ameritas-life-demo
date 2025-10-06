"use client"

import type React from "react"
import { Calendar, Building, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Particles } from "@/components/ui/particles"
import { cn } from "@/lib/utils"

interface WorkflowSectionProps {
  onGetStartedClick: () => void
}

const workflowSteps = [
  {
    icon: <Calendar className="text-pink-500" size={28} />,
    title: "Assess Your Needs",
    description: "Answer a few questions to determine your life insurance coverage needs.",
    color: "#fc3893",
  },
  {
    icon: <Building className="text-purple-600" size={28} />,
    title: "Compare Ameritas Plans",
    description: "Explore Term, Whole, and Universal life options from Ameritas.",
    color: "#70309f",
  },
  {
    icon: <CheckCircle className="text-green-500" size={28} />,
    title: "Apply & Get Covered",
    description: "Complete your application online and secure your policy with Ameritas.",
    color: "#10b981",
  },
]

const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onGetStartedClick }) => {
  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            How Ameritas Life Insurance Works with HealthBird
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            We've simplified the life insurance process to make it quick and clear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workflowSteps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "relative p-10 rounded-3xl transition-all duration-500",
                "bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl hover:shadow-2xl",
                "flex flex-col items-center text-center",
                "group hover:translate-y-[-8px]",
              )}
            >
              <Particles
                className="absolute inset-0"
                quantity={20}
                staticity={60}
                ease={80}
                size={0.6}
                color={step.color}
              />

              <div className="relative h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
                <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-gray-100/50 transition-opacity duration-300 blur-md"></div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-lg text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Button
            onClick={onGetStartedClick}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-10 py-8 h-auto text-lg font-medium shadow-xl hover:shadow-pink-500/30 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span className="text-lg">Explore Ameritas Plans</span>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default WorkflowSection
