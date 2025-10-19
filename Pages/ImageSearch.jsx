import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Upload, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImageSearch() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Reverse Image Search</h1>
        </div>
        <p className="text-slate-600 text-lg">Find where images appear across the web</p>
      </div>

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <p className="font-semibold mb-2">Backend Integration Required</p>
          <p className="text-sm mb-3">
            Reverse image search requires backend functions to integrate with services like Google Vision API or TinEye. This ensures proper API authentication and rate limiting.
          </p>
          <p className="text-sm">
            <strong>To enable this feature:</strong> Go to Dashboard → Settings → Enable Backend Functions
          </p>
        </AlertDescription>
      </Alert>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm opacity-50 pointer-events-none">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg">Upload Image to Search</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <p className="font-medium text-slate-700 mb-2 text-lg">Upload an image to search</p>
            <p className="text-sm text-slate-500">Drag and drop or click to browse</p>
          </div>
          <Button disabled className="w-full h-12 mt-4">
            <Search className="w-5 h-5 mr-2" />
            Search for Image
          </Button>
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