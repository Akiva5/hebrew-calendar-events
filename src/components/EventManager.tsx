
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { HDate } from '@hebcal/core';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';

interface EventManagerProps {
  selectedDate: Date;
}

export const EventManager = ({ selectedDate }: EventManagerProps) => {
  const { events, addEvent, removeEvent } = useEvents();
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    isRecurring: false,
    hebrewRecurrence: false
  });

  const getHebrewDate = (date: Date) => {
    try {
      const hDate = new HDate(date);
      return {
        day: hDate.getDate(),
        month: hDate.getMonthName('h'),
        year: hDate.getFullYear(),
        toString: () => hDate.toString('h')
      };
    } catch (error) {
      console.error('Error getting Hebrew date:', error);
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive"
      });
      return;
    }

    const eventDate = new Date(newEvent.date);
    let hebrewDate = null;
    
    if (newEvent.isRecurring && newEvent.hebrewRecurrence) {
      hebrewDate = getHebrewDate(eventDate);
      if (!hebrewDate) {
        toast({
          title: "Error",
          description: "Could not calculate Hebrew date",
          variant: "destructive"
        });
        return;
      }
    }

    const event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      isRecurring: newEvent.isRecurring,
      hebrewDate: hebrewDate,
      createdAt: new Date().toISOString()
    };

    addEvent(event);
    
    toast({
      title: "Event Created",
      description: `${newEvent.title} has been added to your calendar`,
    });

    setNewEvent({
      title: '',
      description: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      isRecurring: false,
      hebrewRecurrence: false
    });
    setIsCreating(false);
  };

  const handleRemoveEvent = (eventId: string) => {
    removeEvent(eventId);
    toast({
      title: "Event Removed",
      description: "The event has been deleted from your calendar",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Event Management</h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {isCreating && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Dad's Birthday"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Additional details about the event"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="mt-1"
                />
                {newEvent.date && (
                  <p className="text-sm text-blue-600 mt-1">
                    Hebrew Date: {getHebrewDate(new Date(newEvent.date))?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={newEvent.isRecurring}
                    onCheckedChange={(checked) => 
                      setNewEvent({ ...newEvent, isRecurring: checked, hebrewRecurrence: checked ? newEvent.hebrewRecurrence : false })
                    }
                  />
                  <Label htmlFor="recurring">Recurring Event</Label>
                </div>

                {newEvent.isRecurring && (
                  <div className="flex items-center space-x-2 ml-6">
                    <Switch
                      id="hebrew-recurrence"
                      checked={newEvent.hebrewRecurrence}
                      onCheckedChange={(checked) => 
                        setNewEvent({ ...newEvent, hebrewRecurrence: checked })
                      }
                    />
                    <Label htmlFor="hebrew-recurrence">Recur on Hebrew Calendar Date</Label>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Event
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-900">Your Events</h3>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No events created yet. Click "Add Event" to get started!
          </p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      {event.description && (
                        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                        {event.hebrewDate && (
                          <span className="text-blue-600">
                            Hebrew: {event.hebrewDate.day} {event.hebrewDate.month}
                          </span>
                        )}
                        {event.isRecurring && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {event.hebrewDate ? 'Hebrew Recurring' : 'Recurring'}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEvent(event.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
