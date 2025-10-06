"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, MessageSquare, Users, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Particles } from "@/components/ui/particles"
import ReviewsIoBadge from "./ReviewsIoBadge"
import { useLanguage } from "@/contexts/LanguageContext"

interface Review {
  id: number
  customer: string
  content: string
  rating: number
  date: string
}

const reviews: Review[] = [
  {
    id: 1,
    customer: "Sarah M.",
    content:
      "The process was incredibly easy and fast. I was able to find a plan that fit my needs and budget in just a few minutes.",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    id: 2,
    customer: "Michael L.",
    content:
      "HealthBird made it easy to compare plans and find the right coverage for my family. Their AI assistant really helped me understand my options.",
    rating: 5,
    date: "1 month ago",
  },
  {
    id: 3,
    customer: "Jessica K.",
    content:
      "I was able to find a health insurance plan that I could afford and that met my needs. The process was simple and straightforward.",
    rating: 4,
    date: "3 weeks ago",
  },
  {
    id: 4,
    customer: "David R.",
    content:
      "Had no idea where to start with health insurance. HealthBird guided me through everything and made it surprisingly painless!",
    rating: 5,
    date: "1 week ago",
  },
  {
    id: 5,
    customer: "Emma T.",
    content:
      "After hours of trying other websites, I found HealthBird and got enrolled in less than 30 minutes. Wish I'd known about it sooner.",
    rating: 5,
    date: "2 months ago",
  },
  {
    id: 6,
    customer: "James W.",
    content:
      "The subsidy calculator was a game-changer. I had no idea I qualified for so much assistance. Saved me over $200 per month!",
    rating: 5,
    date: "3 weeks ago",
  },
]

const metrics = [
  {
    icon: <Star className="h-8 w-8 text-pink-500" />,
    value: "4.8/5",
    label: "Customer Rating",
  },
  {
    icon: <ThumbsUp className="h-8 w-8 text-purple-600" />,
    value: "93%",
    label: "Would Recommend",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
    value: "$100MM+",
    label: "Saved For Our Customers",
  },
  {
    icon: <Users className="h-8 w-8 text-green-500" />,
    value: "100,000+",
    label: "Enrolled Members",
  },
]

const ReviewCard: React.FC<{ review: Review; index: number }> = ({ review, index }) => {
  const { t } = useLanguage()

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-pink-300/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 flex items-center justify-center mr-3">
          <span className="text-purple-600 font-semibold">{review.customer.charAt(0)}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{review.customer}</h4>
          <p className="text-gray-500 text-sm">{review.date}</p>
        </div>
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn("fill-current", i < review.rating ? "text-yellow-400" : "text-gray-200")}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700">{review.content}</p>
      <div className="mt-4 flex items-center text-gray-500 text-sm">
        <CheckCircle size={14} className="text-green-500 mr-1" />
        <span>Verified Customer</span>
      </div>
    </motion.div>
  )
}

const ReviewsSection: React.FC = () => {
  const { t } = useLanguage()

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      {/* Background particles */}
      <Particles
        className="absolute inset-0 opacity-30"
        quantity={100}
        staticity={60}
        ease={70}
        size={1}
        color="#fc3893"
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Customers
            </span>{" "}
            Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found the perfect health insurance with HealthBird
          </p>
        </motion.div>

        {/* Metrics Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center"
              whileHover={{ y: -5 }}
            >
              <div className="mb-3">{metric.icon}</div>
              <h3 className="text-3xl font-bold mb-1 text-gray-900">{metric.value}</h3>
              <p className="text-gray-600">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Reviews.io Badge directly integrated into the reviews section */}
        <ReviewsIoBadge />
      </div>
    </section>
  )
}

export default ReviewsSection
