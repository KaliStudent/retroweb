import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Image as ImageIcon, Upload, Download, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedUrl(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Convert this image to ${outputFormat.toUpperCase()} format. Return the converted image.`,
        file_urls: [file_url]
      });

      setConvertedUrl(file_url);
    } catch (error) {
      console.error("Conversion failed:", error);
    }
    setConverting(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Image Converter</h1>
        </div>
        <p className="text-slate-600 text-lg">Convert between PNG, JPG, GIF, and SVG formats</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="text-lg">Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="font-medium text-slate-700 mb-1">Click to upload image</p>
                  <p className="text-sm text-slate-500">PNG, JPG, GIF, SVG supported</p>
                </label>
              </div>

              {preview && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img src={preview} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="text-lg">Conversion Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Output Format
                </label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleConvert}
                disabled={!file || converting}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg"
              >
                {converting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Convert Image
                  </>
                )}
              </Button>

              {convertedUrl && (
                <Button 
                  variant="outline"
                  className="w-full h-12 border-2"
                  asChild
                >
                  <a href={convertedUrl} download={`converted.${outputFormat}`}>
                    <Download className="w-5 h-5 mr-2" />
                    Download Converted Image
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}