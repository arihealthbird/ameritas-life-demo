"use client"
import { Button } from "@/components/ui/button"

interface AgreementStatementProps {
  statement: string
  id: string
  onChange: (id: string, value: string) => void
  value: string
}

export default function AgreementStatement({ statement, id, onChange, value }: AgreementStatementProps) {
  const handleChange = (selectedValue: string) => {
    onChange(id, selectedValue)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="mb-6">
        <p className="text-gray-800 text-lg">{statement}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant={value === "agree" ? "default" : "outline"}
          className={`w-full py-6 text-base ${
            value === "agree"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
              : "border-2 hover:border-purple-300 hover:bg-purple-50"
          }`}
          onClick={() => handleChange("agree")}
        >
          Agree
        </Button>
        <Button
          type="button"
          variant={value === "disagree" ? "default" : "outline"}
          className={`w-full py-6 text-base ${
            value === "disagree"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
              : "border-2 hover:border-purple-300 hover:bg-purple-50"
          }`}
          onClick={() => handleChange("disagree")}
        >
          Disagree
        </Button>
      </div>
    </div>
  )
}
