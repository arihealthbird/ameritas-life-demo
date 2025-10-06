"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { calculateAge, formatDateOfBirth } from "@/utils/dateUtils"

interface DateInputFieldProps {
  id?: string
  label?: string
  value: Date | undefined | string
  onChange: (date: Date | undefined | string) => void
  showAge?: boolean
  className?: string
  error?: string | null
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  id = "date-input",
  label,
  value,
  onChange,
  showAge = false,
  className = "",
  error = null,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [age, setAge] = useState<number | null>(null)

  useEffect(() => {
    if (value instanceof Date) {
      const month = (value.getMonth() + 1).toString().padStart(2, "0")
      const day = value.getDate().toString().padStart(2, "0")
      const year = value.getFullYear()
      setInputValue(`${month}/${day}/${year}`)

      if (showAge) {
        setAge(calculateAge(value))
      }
    } else if (typeof value === "string" && value) {
      setInputValue(value)

      if (showAge) {
        try {
          const date = new Date(value)
          if (!isNaN(date.getTime())) {
            setAge(calculateAge(date))
          }
        } catch (e) {
          setAge(null)
        }
      }
    } else {
      setInputValue("")
      setAge(null)
    }
  }, [value, showAge])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Format the input as the user types
    const formattedValue = formatDateOfBirth(newValue)
    if (formattedValue !== newValue) {
      setInputValue(formattedValue)
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = formattedValue.match(dateRegex)

    if (match) {
      const month = Number.parseInt(match[1], 10) - 1
      const day = Number.parseInt(match[2], 10)
      const year = Number.parseInt(match[3], 10)

      const date = new Date(year, month, day)
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day &&
        year >= 1900 &&
        year <= new Date().getFullYear()
      ) {
        onChange(date)
        if (showAge) {
          setAge(calculateAge(date))
        }
      } else {
        onChange(undefined)
        setAge(null)
      }
    } else {
      onChange(formattedValue)
      setAge(null)
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="MM/DD/YYYY"
          className={`${className} ${error ? "border-red-500" : ""}`}
        />
        {showAge && age !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{age} years old</div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

// Add default export that points to the same component
export default DateInputField
