
import { useState, useEffect } from 'react';
import { HDate, HebrewCalendar, Location } from '@hebcal/core';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEvents } from '@/hooks/useEvents';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarView = ({ selectedDate, onDateSelect }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { events } = useEvents();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getHebrewDate = (date: Date) => {
    try {
      const hDate = new HDate(date);
      return {
        hebrew: hDate.toString(),
        day: hDate.getDate(),
        month: hDate.getMonthName(),
        year: hDate.getFullYear()
      };
    } catch (error) {
      console.error('Error getting Hebrew date:', error);
      return {
        hebrew: '',
        day: 0,
        month: '',
        year: 0
      };
    }
  };

  const getJewishHolidays = (date: Date) => {
    try {
      const location = new Location(31.7683, 35.2137, true, 'Asia/Jerusalem');
      const hDate = new HDate(date);
      const holidays = HebrewCalendar.calendar({
        start: hDate,
        end: hDate,
        location,
        il: true,
        sedrot: false,
        candlelighting: false
      });
      return holidays.map(event => event.getDesc());
    } catch (error) {
      console.error('Error getting holidays:', error);
      return [];
    }
  };

  const hasEvents = (date: Date) => {
    return events.some(event => {
      if (event.isRecurring && event.hebrewDate) {
        const hebrewDate = getHebrewDate(date);
        return hebrewDate.day === event.hebrewDate.day && 
               hebrewDate.month === event.hebrewDate.month;
      }
      return isSameDay(new Date(event.date), date);
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousMonth} className="p-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-blue-600">
            {getHebrewDate(currentMonth).month} {getHebrewDate(currentMonth).year}
          </p>
        </div>
        
        <Button variant="outline" onClick={nextMonth} className="p-2">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center font-semibold text-blue-800 bg-blue-50 rounded">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date) => {
          const hebrewDate = getHebrewDate(date);
          const holidays = getJewishHolidays(date);
          const hasEvent = hasEvents(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={cn(
                "p-2 min-h-[80px] text-left border rounded-lg transition-all hover:shadow-md relative",
                isSelected && "ring-2 ring-blue-500 bg-blue-50",
                isToday && "border-blue-500 bg-blue-50",
                !isSameMonth(date, currentMonth) && "opacity-50",
                hasEvent && "border-gold-400 bg-gold-50",
                holidays.length > 0 && "border-purple-400 bg-purple-50"
              )}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-900">
                    {format(date, 'd')}
                  </span>
                  {hasEvent && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="text-xs text-blue-600 font-medium">
                  {hebrewDate.day} {hebrewDate.month.substring(0, 3)}
                </div>
                
                {holidays.length > 0 && (
                  <div className="text-xs text-purple-600 font-medium truncate">
                    {holidays[0]}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Selected Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-blue-700">
            Hebrew Date: {getHebrewDate(selectedDate).hebrew}
          </p>
          {getJewishHolidays(selectedDate).map((holiday, index) => (
            <p key={index} className="text-purple-700 font-medium">
              🎉 {holiday}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
