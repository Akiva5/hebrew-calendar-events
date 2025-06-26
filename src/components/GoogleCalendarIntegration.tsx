
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ExternalLink, RefreshCw, Calendar, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const GoogleCalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [calendarId, setCalendarId] = useState('');

  const handleConnect = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Calendar API key",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would handle OAuth flow
    setIsConnected(true);
    toast({
      title: "Connected to Google Calendar",
      description: "Your Hebrew calendar events can now sync with Google Calendar",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSyncEnabled(false);
    toast({
      title: "Disconnected",
      description: "Google Calendar integration has been disabled",
    });
  };

  const handleSync = () => {
    if (!isConnected) return;
    
    toast({
      title: "Syncing Events",
      description: "Your Hebrew calendar events are being synced to Google Calendar",
    });
    
    // Simulate sync process
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "All events have been successfully synced",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Google Calendar Integration</h2>
        <p className="text-gray-600">
          Connect your Google Calendar to sync Hebrew calendar events and recurring dates.
        </p>
      </div>

      {/* Connection Status */}
      <Card className={`border-l-4 ${isConnected ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Calendar className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="font-medium">
              {isConnected ? 'Connected to Google Calendar' : 'Not Connected'}
            </span>
          </div>
        </CardContent>
      </Card>

      {!isConnected ? (
        /* Setup Form */
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">Setup Google Calendar Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Setup Required</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You'll need to create a Google Calendar API key to enable integration.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="api-key">Google Calendar API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Calendar API key"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from the Google Cloud Console
              </p>
            </div>

            <div>
              <Label htmlFor="calendar-id">Calendar ID (Optional)</Label>
              <Input
                id="calendar-id"
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                placeholder="your-email@gmail.com"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use your primary calendar
              </p>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
                Connect to Google Calendar
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get API Key
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Connected Controls */
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Sync Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-sync">Auto-Sync Events</Label>
                  <p className="text-sm text-gray-500">
                    Automatically sync new Hebrew calendar events to Google Calendar
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={syncEnabled}
                  onCheckedChange={setSyncEnabled}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSync} className="bg-green-600 hover:bg-green-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Sync Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span>Never</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Synced:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calendar:</span>
                  <span>{calendarId || 'Primary Calendar'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sync Hebrew calendar recurring events</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Convert Hebrew dates to Gregorian automatically</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Include Hebrew date information in event descriptions</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sync Jewish holidays and observances</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
