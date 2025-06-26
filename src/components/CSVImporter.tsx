
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { toast } from '@/hooks/use-toast';
import { HDate } from '@hebcal/core';

interface CSVImporterProps {
  onClose: () => void;
}

export const CSVImporter = ({ onClose }: CSVImporterProps) => {
  const { addEvent } = useEvents();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getHebrewDate = (date: Date) => {
    try {
      const hDate = new HDate(date);
      return {
        day: hDate.getDate(),
        month: hDate.getMonthName(),
        year: hDate.getFullYear(),
        toString: () => hDate.toString()
      };
    } catch (error) {
      console.error('Error getting Hebrew date:', error);
      return null;
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1);

    return rows.map(row => {
      const values = row.split(',').map(v => v.trim());
      const event: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header.toLowerCase()) {
          case 'title':
            event.title = value;
            break;
          case 'description':
            event.description = value;
            break;
          case 'date (yyyy-mm-dd)':
          case 'date':
            event.date = value;
            break;
          case 'is recurring (true/false)':
          case 'is recurring':
          case 'recurring':
            event.isRecurring = value.toLowerCase() === 'true';
            break;
          case 'hebrew recurrence (true/false)':
          case 'hebrew recurrence':
            event.hebrewRecurrence = value.toLowerCase() === 'true';
            break;
          case 'gregorian recurrence (true/false)':
          case 'gregorian recurrence':
            event.gregorianRecurrence = value.toLowerCase() === 'true';
            break;
          case 'link dates (true/false)':
          case 'link dates':
            event.linkDates = value.toLowerCase() === 'true';
            break;
        }
      });

      return event;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please select a CSV file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
  };

  const processCSV = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const events = parseCSV(text);
      let successCount = 0;
      let errorCount = 0;

      for (const eventData of events) {
        try {
          if (!eventData.title || !eventData.date) {
            errorCount++;
            continue;
          }

          const eventDate = new Date(eventData.date);
          if (isNaN(eventDate.getTime())) {
            errorCount++;
            continue;
          }

          let hebrewDate = null;
          if (eventData.isRecurring && (eventData.hebrewRecurrence || eventData.linkDates)) {
            hebrewDate = getHebrewDate(eventDate);
          }

          const event = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: eventData.title,
            description: eventData.description || '',
            date: eventData.date,
            isRecurring: eventData.isRecurring || false,
            hebrewDate: hebrewDate,
            gregorianRecurrence: eventData.gregorianRecurrence || false,
            hebrewRecurrence: eventData.hebrewRecurrence || false,
            linkDates: eventData.linkDates || false,
            createdAt: new Date().toISOString()
          };

          addEvent(event);
          successCount++;
        } catch (error) {
          console.error('Error processing event:', error);
          errorCount++;
        }
      }

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} events. ${errorCount} errors.`,
      });

      onClose();
    } catch (error) {
      console.error('Error reading CSV file:', error);
      toast({
        title: "Error",
        description: "Failed to read the CSV file",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-900">Import Events from CSV</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-1"
          />
          <p className="text-sm text-gray-600 mt-1">
            Upload a CSV file with your events. Use the "Sample CSV" button to download a template.
          </p>
        </div>

        {file && (
          <div className="p-3 bg-green-50 rounded border">
            <p className="text-sm text-green-800">
              <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={processCSV}
            disabled={!file || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Import Events'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>CSV Format:</strong></p>
          <p>• Title (required)</p>
          <p>• Description (optional)</p>
          <p>• Date in YYYY-MM-DD format (required)</p>
          <p>• Is Recurring: true/false</p>
          <p>• Hebrew Recurrence: true/false</p>
          <p>• Gregorian Recurrence: true/false</p>
          <p>• Link Dates: true/false</p>
        </div>
      </CardContent>
    </Card>
  );
};
