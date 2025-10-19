import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DomainRegistration() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Domain Registration</h1>
        </div>
        <p className="text-slate-600 text-lg">Register domains through name.com API</p>
      </div>

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <p className="font-semibold mb-2">Backend Integration Required</p>
          <p className="text-sm mb-3">
            Domain registration via the name.com API requires backend functions to be enabled. This ensures secure API key handling and payment processing.
          </p>
          <p className="text-sm">
            <strong>To enable this feature:</strong> Go to Dashboard → Settings → Enable Backend Functions
          </p>
        </AlertDescription>
      </Alert>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm opacity-50 pointer-events-none">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg">Search for Domain</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="example.com"
                disabled
                className="flex-1 h-12 text-lg"
              />
              <Button disabled className="h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.open('https://dashboard.base44.com/settings', '_blank')}
        >
          <Settings className="w-4 h-4" />
          Go to Settings
        </Button>
      </div>
    </div>
  );
}
