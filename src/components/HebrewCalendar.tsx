import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Languages } from 'lucide-react';
import { HDate } from '@hebcal/core';
import { getHebrewDateInfo } from '@/utils/hebrewFormatting';

interface HebrewCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  showHebrewText?: boolean;
  onToggleLanguage?: () => void;
}

export const HebrewCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  showHebrewText = false,
  onToggleLanguage 
}: HebrewCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of the month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Create array of dates for the calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const isSelected = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const formatMonthYear = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (showHebrewText) {
      // Show Hebrew month and year for the current Gregorian month
      const midMonth = new Date(year, month, 15);
      const hebrewInfo = getHebrewDateInfo(midMonth);
      return hebrewInfo ? `${hebrewInfo.hebrewMonth} ${hebrewInfo.hebrewYear}` : `${monthNames[month]} ${year}`;
    }
    
    return `${monthNames[month]} ${year}`;
  };
  
  const dayNames = showHebrewText 
    ? ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle className={`text-sm font-medium ${showHebrewText ? 'text-right' : ''}`} dir={showHebrewText ? 'rtl' : 'ltr'}>
            {formatMonthYear()}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            {onToggleLanguage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLanguage}
                className="h-8 w-8 p-0"
                title="Toggle Hebrew/English"
              >
                <Languages className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2">
        {/* Day names header */}
        <div className={`grid grid-cols-7 gap-1 mb-2 ${showHebrewText ? 'text-right' : ''}`} dir={showHebrewText ? 'rtl' : 'ltr'}>
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className={`grid grid-cols-7 gap-1 ${showHebrewText ? 'text-right' : ''}`} dir={showHebrewText ? 'rtl' : 'ltr'}>
          {calendarDays.map((date, index) => (
            <div key={index} className="aspect-square">
              {date && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDateSelect(date)}
                  className={`
                    h-full w-full text-xs p-1 relative
                    ${isSelected(date) ? 'bg-primary text-primary-foreground' : ''}
                    ${isToday(date) ? 'bg-accent text-accent-foreground font-bold' : ''}
                    hover:bg-muted
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-xs">
                      {showHebrewText ? getHebrewDateInfo(date)?.hebrewDay || date.getDate() : date.getDate()}
                    </span>
                    {showHebrewText && (
                      <span className="text-[10px] text-muted-foreground">
                        {date.getDate()}
                      </span>
                    )}
                  </div>
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {selectedDate && (
          <div className={`mt-3 p-2 bg-muted rounded text-xs ${showHebrewText ? 'text-right' : ''}`} dir={showHebrewText ? 'rtl' : 'ltr'}>
            <div className="font-medium">Selected Date:</div>
            <div>{selectedDate.toLocaleDateString()}</div>
            <div className="text-primary">
              {showHebrewText 
                ? getHebrewDateInfo(selectedDate)?.renderHebrew() 
                : getHebrewDateInfo(selectedDate)?.toString()
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};