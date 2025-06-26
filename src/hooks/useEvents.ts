
import { useState, useEffect } from 'react';

export interface HebrewDate {
  day: number;
  month: string;
  year: number;
  toString: () => string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  isRecurring: boolean;
  hebrewDate?: HebrewDate | null;
  gregorianRecurrence?: boolean;
  hebrewRecurrence?: boolean;
  linkDates?: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'hebrew-calendar-events';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, ...updatedEvent }
          : event
      )
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      if (event.isRecurring && event.hebrewDate) {
        // For Hebrew recurring events, we'd need to check if the date matches the Hebrew date
        // This would require more complex logic to convert dates
        return false; // Simplified for now
      }
      return new Date(event.date).toDateString() === date.toDateString();
    });
  };

  return {
    events,
    addEvent,
    removeEvent,
    updateEvent,
    getEventsForDate
  };
};
