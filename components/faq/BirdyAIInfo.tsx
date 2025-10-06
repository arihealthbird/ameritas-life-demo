"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/LanguageContext"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface BirdyAIInfoProps {
  tabContentVariants: any
  setActiveTab: (tab: "info" | "chat") => void
}

const BirdyAIInfo: React.FC<BirdyAIInfoProps> = ({ tabContentVariants, setActiveTab }) => {
  const { language } = useLanguage()
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const pathname = usePathname()

  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index)
  }

  // Content for header and buttons
  const content = {
    en: {
      title: "Ask Birdy AI",
      explanation: "Get instant answers about health insurance, enrollment process, and coverage options.",
      tips: [
        "Ask about specific health insurance terms",
        "Find out about available subsidies",
        "Learn about the enrollment process",
      ],
      aboutTitle: "About Birdy AI",
      aboutText:
        "Birdy AI is your personal health insurance assistant. I can help you understand insurance terms, find the right plan, and answer your coverage questions.",
      buttonText: "Got it, thanks!",
      faqTitle: "Frequently Asked Questions",
    },
    es: {
      title: "Pregunta a Birdy AI",
      explanation:
        "Obtén respuestas instantáneas sobre seguros de salud, proceso de inscripción y opciones de cobertura.",
      tips: [
        "Pregunta sobre términos específicos de seguros de salud",
        "Infórmate sobre subsidios disponibles",
        "Aprende sobre el proceso de inscripción",
      ],
      aboutTitle: "Acerca de Birdy AI",
      aboutText:
        "Birdy AI es tu asistente personal de seguros de salud. Puedo ayudarte a entender términos de seguros, encontrar el plan adecuado y responder tus preguntas sobre cobertura.",
      buttonText: "¡Entendido, gracias!",
      faqTitle: "Preguntas Frecuentes",
    },
  }

  const translations = language === "en" ? content.en : content.es

  // Define page-specific FAQ subtitles
  const getFaqSubtitle = () => {
    switch (pathname) {
      case "/who-depends-on-you":
        return "Understanding how financial dependents affect your life insurance coverage needs"
      case "/household":
        return "Important details about household size and life insurance coverage calculation"
      case "/healthcare-utilization":
        return "How your health profile may impact life insurance premiums and underwriting"
      case "/provider-medication-search":
        return "Information about medical history requirements for life insurance applications"
      default:
        return "Common questions about life insurance coverage and Ameritas policies"
    }
  }

  // Define the default FAQs
  const defaultFaqs = [
    {
      question: 'What does the term "Beneficiary" refer to?',
      answer: (
        <p className="leading-relaxed text-sm text-gray-700">
          A beneficiary is the person or persons you designate to receive the death benefit from your life insurance
          policy when you pass away. You can name primary beneficiaries (first in line to receive benefits) and
          contingent beneficiaries (who receive benefits if primary beneficiaries are unavailable). You can typically
          change beneficiaries at any time during the life of your policy.
        </p>
      ),
    },
    {
      question: "Who can be named as a beneficiary on my life insurance policy?",
      answer: (
        <>
          <p className="leading-relaxed mb-3 text-sm text-gray-700">
            You can typically name anyone as a beneficiary on your life insurance policy. Here are common beneficiary
            choices:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-700 mb-1">Family Members:</p>
              <p className="text-sm text-gray-700">
                Spouse, children, parents, siblings, or other relatives who depend on your financial support.
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-700 mb-1">Organizations:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Charitable organizations or foundations</li>
                <li>Religious institutions</li>
                <li>Educational institutions</li>
                <li>Trust funds you've established</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-700 mb-1">Business Partners:</p>
              <p className="text-sm text-gray-700">
                Business partners or the business itself in certain arrangements like buy-sell agreements.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      question: "What's the difference between term life and permanent life insurance?",
      answer: (
        <>
          <p className="leading-relaxed mb-3 text-sm text-gray-700">
            There are two main categories of life insurance, each serving different financial needs:
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg mb-3">
            <p className="text-sm font-medium text-purple-700 mb-2">Term Life Insurance:</p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Provides coverage for a specific term (10, 20, or 30 years)</li>
              <li>Lower premiums, especially when you're younger</li>
              <li>No cash value component - purely protection</li>
              <li>Ideal for temporary needs like mortgage protection or income replacement</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-purple-700 mb-2">Permanent Life Insurance (Whole/Universal):</p>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Provides lifelong coverage as long as premiums are paid</li>
              <li>Builds cash value that you can borrow against</li>
              <li>Higher premiums but stable over time</li>
              <li>Can serve as both protection and investment vehicle</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      question: "How much life insurance coverage do I need?",
      answer: (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
          <p className="leading-relaxed text-sm text-gray-700 mb-3">
            The amount of life insurance you need depends on your financial obligations and goals. A common rule of
            thumb is 10-12 times your annual income, but consider these factors:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Outstanding debts (mortgage, loans, credit cards)</li>
            <li>Income replacement needs for your family</li>
            <li>Future expenses (children's education, funeral costs)</li>
            <li>Existing savings and other life insurance coverage</li>
            <li>Your family's lifestyle and financial goals</li>
          </ul>
        </div>
      ),
    },
  ]

  // Define page-specific FAQs
  const getPageFaqs = () => {
    if (pathname === "/who-depends-on-you") {
      return [
        {
          question: "Why is it important to identify who depends on me financially?",
          answer: (
            <>
              <p className="leading-relaxed mb-3 text-sm text-gray-700">
                Identifying your financial dependents helps determine the right amount of life insurance coverage you
                need:
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg mb-3">
                <p className="text-sm font-medium text-purple-700 mb-2">
                  Your dependents directly impact your coverage needs.
                </p>
              </div>
              <p className="leading-relaxed text-sm text-gray-700">
                For example, if you support a spouse, children, and aging parents, you'll likely need more coverage than
                someone with no dependents. This information helps us recommend appropriate death benefit amounts and
                policy types to ensure your loved ones are financially protected.
              </p>
            </>
          ),
        },
        {
          question: "What if my dependency situation changes over time?",
          answer: (
            <p className="leading-relaxed text-sm text-gray-700">
              Life changes, and so do your insurance needs. Most life insurance policies allow you to make adjustments.
              You can often increase coverage (subject to underwriting), add riders for new dependents, or adjust
              beneficiaries. Term policies can sometimes be converted to permanent coverage. We recommend reviewing your
              coverage annually or after major life events like marriage, births, divorce, or significant income
              changes.
            </p>
          ),
        },
        {
          question: "Should I include dependents who live far away or independently?",
          answer: (
            <p className="leading-relaxed text-sm text-gray-700">
              Yes, if you provide financial support to family members regardless of distance. This could include aging
              parents in another state, adult children you help financially, or siblings you support. The key factor is
              financial dependence, not physical proximity or living arrangements. Even occasional but regular financial
              assistance should be considered when determining your life insurance needs.
            </p>
          ),
        },
      ]
    } else if (pathname === "/household") {
      return [
        {
          question: "How does my household size affect my life insurance needs?",
          answer: (
            <>
              <p className="leading-relaxed mb-3 text-sm text-gray-700">
                Your household size directly impacts the amount of life insurance coverage you should consider:
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg mb-3">
                <p className="text-sm font-medium text-purple-700 mb-2">
                  Larger households typically require more coverage for adequate financial protection.
                </p>
              </div>
              <p className="leading-relaxed text-sm text-gray-700">
                Each additional dependent represents ongoing financial obligations like housing, food, education, and
                healthcare costs. Our recommendations will scale based on your household composition to ensure everyone
                is properly protected.
              </p>
            </>
          ),
        },
        {
          question: "How do I calculate the right coverage amount for my family?",
          answer: (
            <p className="leading-relaxed text-sm text-gray-700">
              Start with your annual household income and multiply by 10-12 years. Then add major debts (mortgage,
              loans) and future expenses (college funds, funeral costs). Subtract existing savings and life insurance.
              This gives you a baseline coverage amount. Consider your family's lifestyle, ages of dependents, and how
              long they'll need support. Younger children require longer-term protection than adult dependents.
            </p>
          ),
        },
        {
          question: "What if I'm the sole income provider?",
          answer: (
            <p className="leading-relaxed text-sm text-gray-700">
              As the sole provider, your life insurance needs are typically higher since your family depends entirely on
              your income. Consider coverage that replaces 100% of your income for the number of years your dependents
              will need support. Factor in inflation and your family's complete financial picture including housing,
              education, healthcare, and daily living expenses. Term life insurance often provides the most coverage at
              the lowest cost for sole providers.
            </p>
          ),
        },
      ]
    }
    return defaultFaqs
  }

  const pageFaqs = getPageFaqs()

  return (
    <motion.div
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-y-auto p-6"
    >
      <div className="space-y-8">
        {/* Luxury FAQ Section with Original Text Styling */}
        <div className="relative">
          {/* Premium Header with Gradient Background but Original Text Styling */}
          <div className="bg-gradient-to-br from-purple-700/30 via-purple-600/20 to-pink-600/30 backdrop-blur-sm rounded-t-2xl p-8 shadow-xl border border-purple-200/50 relative overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg mr-3">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  {translations.faqTitle}
                </h3>
              </div>
              <p className="text-sm text-gray-600 italic">{getFaqSubtitle()}</p>
            </div>
          </div>

          {/* Premium FAQ Content Container with Original Text Styling */}
          <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-2xl border-x border-b border-purple-200/50 -mt-1">
            <div className="p-6 space-y-4">
              {/* FAQ items with luxury styling but original text styling */}
              {pageFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-r from-white to-gray-50/50 rounded-xl shadow-md hover:shadow-lg border border-gray-200/60 overflow-hidden transition-all duration-300 hover:border-purple-300/50"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full min-h-[72px] px-5 py-4 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/30 transition-all duration-300"
                  >
                    <h4 className="text-sm font-medium text-gray-900 pr-3">{faq.question}</h4>
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ease-in-out ${
                          expandedQuestion === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedQuestion === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-4 pt-2">
                      <div className="border-t border-gray-100 pt-2">{faq.answer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons with Original Styling */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={() => setActiveTab("chat")}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full py-2.5 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {language === "en" ? "Ask Birdy AI" : "Pregunta a Birdy AI"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="flex-1 rounded-full">
              {translations.buttonText}
            </Button>
          </SheetClose>
        </div>
      </div>
    </motion.div>
  )
}

export default BirdyAIInfo
