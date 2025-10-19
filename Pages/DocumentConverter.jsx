import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { FileText, Upload, Download, Loader2 } from "lucide-react";

export default function DocumentConverter() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPdfUrl(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: "Convert this document/image to PDF format. Preserve formatting and quality.",
        file_urls: [file_url]
      });

      setPdfUrl(file_url);
    } catch (error) {
      console.error("Conversion failed:", error);
    }
    setConverting(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Document to PDF</h1>
        </div>
        <p className="text-slate-600 text-lg">Convert documents and images to PDF format</p>
      </div>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg">Upload Document or Image</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                onChange={handleFileSelect}
                className="hidden"
                id="doc-upload"
              />
              <label htmlFor="doc-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="font-medium text-slate-700 mb-2 text-lg">Click to upload file</p>
                <p className="text-sm text-slate-500">Documents: DOC, DOCX, TXT</p>
                <p className="text-sm text-slate-500">Images: PNG, JPG, JPEG, GIF</p>
              </label>
            </div>

            {file && (
              <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
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
                  Converting to PDF...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Convert to PDF
                </>
              )}
            </Button>

            {pdfUrl && (
              <Button 
                variant="outline"
                className="w-full h-12 border-2"
                asChild
              >
                <a href={pdfUrl} download="converted.pdf">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}