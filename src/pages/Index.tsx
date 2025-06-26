
import { useState } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { EventManager } from '@/components/EventManager';
import { GoogleCalendarIntegration } from '@/components/GoogleCalendarIntegration';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Settings } from 'lucide-react';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
            <Calendar className="h-8 w-8" />
            לוח שנה עברי
          </h1>
          <p className="text-lg text-blue-700">Hebrew Calendar with Recurring Events</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <Card className="p-6 shadow-lg">
                <CalendarView 
                  selectedDate={selectedDate} 
                  onDateSelect={setSelectedDate}
                />
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card className="p-6 shadow-lg">
                <EventManager selectedDate={selectedDate} />
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6 shadow-lg">
                <GoogleCalendarIntegration />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
