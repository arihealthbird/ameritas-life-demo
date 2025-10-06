import type { LifeInsurancePlan } from "@/types/plans"

export const mockLifePlans: LifeInsurancePlan[] = [
  {
    id: "ameritas-term-1",
    name: "Ameritas ValueTerm 20",
    carrier: "Ameritas",
    type: "Term",
    deathBenefit: 500000,
    premium: 35,
    termLength: 20,
    cashValueFeature: false,
    guaranteedPremiums: true,
    issueAgeRange: [18, 65],
    rating: 4.5, // Example AM Best rating or similar
    description: "Affordable term life coverage for 20 years. Provides a level death benefit and guaranteed premiums.",
    features: ["Level death benefit", "Guaranteed premiums for 20 years", "Convertible to permanent policy options"],
    matchScore: 92,
    rank: 1,
  },
  {
    id: "ameritas-term-2",
    name: "Ameritas ValueTerm 30",
    carrier: "Ameritas",
    type: "Term",
    deathBenefit: 250000,
    premium: 28,
    termLength: 30,
    cashValueFeature: false,
    guaranteedPremiums: true,
    issueAgeRange: [18, 55],
    rating: 4.5,
    description:
      "Long-term protection with fixed premiums for 30 years. Ideal for mortgage protection or income replacement.",
    features: ["Fixed premiums for 30 years", "Substantial death benefit", "Option to convert"],
    matchScore: 88,
    rank: 2,
  },
  {
    id: "ameritas-whole-1",
    name: "Ameritas Legacy Whole Life",
    carrier: "Ameritas",
    type: "Whole",
    deathBenefit: 100000,
    premium: 120,
    cashValueFeature: true,
    guaranteedPremiums: true,
    issueAgeRange: [0, 85], // Example, check Ameritas specifics
    rating: 4.7,
    description: "Lifelong protection with guaranteed premiums, death benefit, and cash value growth.",
    features: [
      "Guaranteed death benefit",
      "Guaranteed cash value growth",
      "Guaranteed level premiums",
      "Potential for dividends",
    ],
    matchScore: 85,
    rank: 3,
  },
  {
    id: "ameritas-universal-1",
    name: "Ameritas FlexGrowth UL",
    carrier: "Ameritas",
    type: "Universal",
    deathBenefit: 300000,
    premium: 95, // Example initial premium
    cashValueFeature: true,
    guaranteedPremiums: false, // Premiums are flexible
    issueAgeRange: [18, 75],
    rating: 4.6,
    description:
      "Flexible universal life insurance with adjustable premiums and death benefit, plus cash value accumulation.",
    features: [
      "Flexible premiums",
      "Adjustable death benefit",
      "Cash value growth potential",
      "Loan and withdrawal options",
    ],
    matchScore: 80,
    rank: 4,
  },
  {
    id: "ameritas-term-3",
    name: "Ameritas QuickTerm 10",
    carrier: "Ameritas",
    type: "Term",
    deathBenefit: 1000000,
    premium: 70,
    termLength: 10,
    cashValueFeature: false,
    guaranteedPremiums: true,
    issueAgeRange: [20, 70],
    rating: 4.4,
    description: "High coverage for a shorter 10-year term. Good for covering large, short-term financial obligations.",
    features: [
      "High death benefit option",
      "Guaranteed premiums for 10 years",
      "Simplified underwriting available for some",
    ],
    matchScore: 78,
    rank: 5,
  },
]

// If you renamed InsurancePlan to LifeInsurancePlan in types/plans.ts,
// you might need to update the export here or how it's imported elsewhere.
// For now, we assume the type alias in types/plans.ts handles this.
export const mockPlans = mockLifePlans
