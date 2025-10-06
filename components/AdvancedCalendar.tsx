"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { eachMonthOfInterval, eachYearOfInterval, endOfYear, format, isAfter, isBefore, startOfYear } from "date-fns"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { CaptionProps } from "react-day-picker"

function AdvancedCalendar({
  date,
  setDate,
  startYear = 1940,
  endYear = 2030,
}: {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  startYear?: number
  endYear?: number
}) {
  const today = new Date()
  const [month, setMonth] = useState(date || today)
  const [isYearView, setIsYearView] = useState(false)
  const startDate = new Date(startYear, 0)
  const endDate = new Date(endYear, 11)

  const years = eachYearOfInterval({
    start: startOfYear(startDate),
    end: endOfYear(endDate),
  })

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      month={month}
      onMonthChange={setMonth}
      defaultMonth={date || new Date()}
      fromMonth={startDate}
      toMonth={endDate}
      className="overflow-hidden rounded-xl border border-border p-2 bg-white shadow-lg"
      classNames={{
        caption: "ms-2.5 me-20 justify-start",
        nav: "justify-end",
      }}
      components={{
        Caption: (props) => <CustomCaption isYearView={isYearView} setIsYearView={setIsYearView} {...props} />,
      }}
      footer={
        isYearView ? (
          <CustomYearView
            isYearView={isYearView}
            setIsYearView={setIsYearView}
            startDate={startDate}
            endDate={endDate}
            years={years}
            currentYear={month.getFullYear()}
            currentMonth={month.getMonth()}
            onMonthSelect={(selectedMonth: Date) => {
              setMonth(selectedMonth)
              setIsYearView(false)
            }}
          />
        ) : null
      }
    />
  )
}

function CustomYearView({
  isYearView,
  setIsYearView,
  startDate,
  endDate,
  years,
  currentYear,
  currentMonth,
  onMonthSelect,
}: {
  isYearView: boolean
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>
  startDate: Date
  endDate: Date
  years: Date[]
  currentYear: number
  currentMonth: number
  onMonthSelect: (date: Date) => void
}) {
  const currentYearRef = useRef<HTMLDivElement>(null)
  const currentMonthButtonRef = useRef<HTMLButtonElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isYearView && currentYearRef.current && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
      if (viewport) {
        const yearTop = currentYearRef.current.offsetTop
        viewport.scrollTop = yearTop
      }
      setTimeout(() => {
        currentMonthButtonRef.current?.focus()
      }, 100)
    }
  }, [isYearView])

  return (
    <div className="absolute inset-0 z-20 -mx-2 -mb-2 bg-white">
      <ScrollArea ref={scrollAreaRef} className="h-full">
        {years.map((year) => {
          const months = eachMonthOfInterval({
            start: startOfYear(year),
            end: endOfYear(year),
          })
          const isCurrentYear = year.getFullYear() === currentYear

          return (
            <div key={year.getFullYear()} ref={isCurrentYear ? currentYearRef : undefined}>
              <CollapsibleYear title={year.getFullYear().toString()} open={isCurrentYear}>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((month) => {
                    const isDisabled = isBefore(month, startDate) || isAfter(month, endDate)
                    const isCurrentMonth = month.getMonth() === currentMonth && year.getFullYear() === currentYear

                    return (
                      <Button
                        key={month.getTime()}
                        ref={isCurrentMonth ? currentMonthButtonRef : undefined}
                        variant={isCurrentMonth ? "default" : "outline"}
                        size="sm"
                        className="h-7"
                        disabled={isDisabled}
                        onClick={() => onMonthSelect(month)}
                      >
                        {format(month, "MMM")}
                      </Button>
                    )
                  })}
                </div>
              </CollapsibleYear>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}

function CustomCaption({
  displayMonth,
  isYearView,
  setIsYearView,
  ...props
}: CaptionProps & {
  isYearView: boolean
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="flex items-center justify-center">
      <Button
        className="-ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent data-[state=open]:text-muted-foreground/80 [&[data-state=open]>svg]:rotate-180"
        variant="ghost"
        size="sm"
        onClick={() => setIsYearView((prev) => !prev)}
        data-state={isYearView ? "open" : "closed"}
      >
        {format(displayMonth, "MMMM yyyy")}
        <ChevronDown
          size={16}
          strokeWidth={2}
          className="shrink-0 text-muted-foreground/80 transition-transform duration-200"
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}

function CollapsibleYear({
  title,
  children,
  open,
}: {
  title: string
  children: React.ReactNode
  open?: boolean
}) {
  return (
    <Collapsible className="border-t border-border px-2 py-1.5" defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button
          className="flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
          variant="ghost"
          size="sm"
        >
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="shrink-0 text-muted-foreground/80 transition-transform duration-200"
            aria-hidden="true"
          />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden px-3 py-1 text-sm transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export { AdvancedCalendar }
