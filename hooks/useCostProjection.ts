"use client"

import { useState, useMemo } from "react"
import type { CostProjection, UsageLevel, ServiceCost } from "@/types/costProjection"

// This would typically come from an API based on the plan and user profile
const generateCostProjection = (planId: string, usageLevel: UsageLevel): CostProjection => {
  // Sample data that matches the screenshot
  const services: ServiceCost[] = []

  // Primary Care Visits
  if (usageLevel === "A little") {
    services.push({
      count: 1,
      name: "Primary Care Visits",
      stickerPrice: 150,
      insurancePays: 130,
      youPay: 20,
    })
  } else if (usageLevel === "Average") {
    services.push({
      count: 2,
      name: "Primary Care Visits",
      stickerPrice: 300,
      insurancePays: 260,
      youPay: 40,
    })
  } else {
    services.push({
      count: 3,
      name: "Primary Care Visits",
      stickerPrice: 450,
      insurancePays: 390,
      youPay: 60,
    })
  }

  // Specialist Visits
  if (usageLevel === "A little") {
    services.push({
      count: 0,
      name: "Specialist Visits",
      stickerPrice: 0,
      insurancePays: 0,
      youPay: 0,
    })
  } else if (usageLevel === "Average") {
    services.push({
      count: 1,
      name: "Specialist Visits",
      stickerPrice: 200,
      insurancePays: 150,
      youPay: 50,
    })
  } else {
    services.push({
      count: 2,
      name: "Specialist Visits",
      stickerPrice: 400,
      insurancePays: 300,
      youPay: 100,
    })
  }

  // Labs/Tests
  if (usageLevel === "A little") {
    services.push({
      count: 1,
      name: "Labs/Tests",
      stickerPrice: 300,
      insurancePays: 200,
      youPay: 100,
    })
  } else if (usageLevel === "Average") {
    services.push({
      count: 2,
      name: "Labs/Tests",
      stickerPrice: 600,
      insurancePays: 400,
      youPay: 200,
    })
  } else {
    services.push({
      count: 3,
      name: "Labs/Tests",
      stickerPrice: 900,
      insurancePays: 600,
      youPay: 300,
    })
  }

  // Prescriptions
  if (usageLevel === "A little") {
    services.push({
      count: 1,
      name: "Prescriptions",
      stickerPrice: 80,
      insurancePays: 70,
      youPay: 10,
    })
  } else if (usageLevel === "Average") {
    services.push({
      count: 2,
      name: "Prescriptions",
      stickerPrice: 160,
      insurancePays: 140,
      youPay: 20,
    })
  } else {
    services.push({
      count: 3,
      name: "Prescriptions",
      stickerPrice: 240,
      insurancePays: 210,
      youPay: 30,
    })
  }

  // Hospital Visits
  if (usageLevel === "A little") {
    services.push({
      count: 0,
      name: "Hospital Visits",
      stickerPrice: 0,
      insurancePays: 0,
      youPay: 0,
    })
  } else if (usageLevel === "Average") {
    services.push({
      count: 0,
      name: "Hospital Visits",
      stickerPrice: 0,
      insurancePays: 0,
      youPay: 0,
    })
  } else {
    services.push({
      count: 1,
      name: "Hospital Visits",
      stickerPrice: 2000,
      insurancePays: 1800,
      youPay: 200,
    })
  }

  // Emergency Room
  if (usageLevel === "A little") {
    services.push({
      count: 0,
      name: "Emergency Room",
      stickerPrice: 0,
      insurancePays: 0,
      youPay: 0,
    })
  } else if (usageLevel === "Average") {
    services.push({
      count: 0,
      name: "Emergency Room",
      stickerPrice: 0,
      insurancePays: 0,
      youPay: 0,
    })
  } else {
    services.push({
      count: 1,
      name: "Emergency Room",
      stickerPrice: 1000,
      insurancePays: 900,
      youPay: 100,
    })
  }

  // Monthly Premium (always the same regardless of usage level)
  services.push({
    count: 12,
    name: "Monthly Premium",
    stickerPrice: 8208,
    insurancePays: 0,
    youPay: 8208,
  })

  // Calculate totals
  const totalStickerPrice = services.reduce((sum, service) => sum + service.stickerPrice, 0)
  const totalInsurancePays = services.reduce((sum, service) => sum + service.insurancePays, 0)
  const totalYouPay = services.reduce((sum, service) => sum + service.youPay, 0)
  const monthlyYouPay = Math.round(totalYouPay / 12)

  return {
    usageLevel,
    services,
    totalStickerPrice,
    totalInsurancePays,
    totalYouPay,
    monthlyYouPay,
  }
}

export function useCostProjection(planId: string) {
  const [usageLevel, setUsageLevel] = useState<UsageLevel>("A little")

  const costProjection = useMemo(() => {
    return generateCostProjection(planId, usageLevel)
  }, [planId, usageLevel])

  return {
    costProjection,
    usageLevel,
    setUsageLevel,
  }
}
