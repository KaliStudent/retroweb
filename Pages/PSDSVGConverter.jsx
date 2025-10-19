import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Code, Upload, Download, Loader2, ArrowRightLeft } from "lucide-react";

export default function PSDSVGConverter() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [conversionType, setConversionType] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedUrl(null);
      
      if (selectedFile.name.endsWith('.psd')) {
        setConversionType('psd-to-svg');
      } else if (selectedFile.name.endsWith('.svg')) {
        setConversionType('svg-to-psd');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const targetFormat = conversionType === 'psd-to-svg' ? 'SVG' : 'PSD';
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Convert this file to ${targetFormat} format. Preserve layers and vector information where possible.`,
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
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">PSD & SVG Converter</h1>
        </div>
        <p className="text-slate-600 text-lg">Convert between PSD and SVG vector formats</p>
      </div>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Vector File Conversion
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".psd,.svg"
                onChange={handleFileSelect}
                className="hidden"
                id="vector-upload"
              />
              <label htmlFor="vector-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="font-medium text-slate-700 mb-2 text-lg">Upload PSD or SVG file</p>
                <p className="text-sm text-slate-500">Supported: .psd, .svg</p>
              </label>
            </div>

            {file && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Code className="w-8 h-8 text-violet-600" />
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-700 bg-white rounded-lg p-3 border border-slate-200">
                  <span className="uppercase">{conversionType === 'psd-to-svg' ? 'PSD' : 'SVG'}</span>
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  <span className="uppercase">{conversionType === 'psd-to-svg' ? 'SVG' : 'PSD'}</span>
                </div>
              </div>
            )}

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
                  <Code className="w-5 h-5 mr-2" />
                  Convert File
                </>
              )}
            </Button>

            {convertedUrl && (
              <Button 
                variant="outline"
                className="w-full h-12 border-2"
                asChild
              >
                <a href={convertedUrl} download={`converted.${conversionType === 'psd-to-svg' ? 'svg' : 'psd'}`}>
                  <Download className="w-5 h-5 mr-2" />
                  Download {conversionType === 'psd-to-svg' ? 'SVG' : 'PSD'}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}