import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Table, Upload, Download, Loader2, ArrowRightLeft } from "lucide-react";

export default function ExcelCSVConverter() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [convertedData, setConvertedData] = useState(null);
  const [conversionType, setConversionType] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedData(null);
      
      if (selectedFile.name.endsWith('.csv')) {
        setConversionType('csv-to-excel');
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setConversionType('excel-to-csv');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const targetFormat = conversionType === 'csv-to-excel' ? 'Excel' : 'CSV';
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Convert this file to ${targetFormat} format. Preserve all data and formatting.`,
        file_urls: [file_url]
      });

      setConvertedData({ url: file_url, format: targetFormat });
    } catch (error) {
      console.error("Conversion failed:", error);
    }
    setConverting(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Table className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Excel & CSV Converter</h1>
        </div>
        <p className="text-slate-600 text-lg">Convert between Excel and CSV formats seamlessly</p>
      </div>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            File Conversion
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="table-upload"
              />
              <label htmlFor="table-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="font-medium text-slate-700 mb-2 text-lg">Upload Excel or CSV file</p>
                <p className="text-sm text-slate-500">Supported: .xlsx, .xls, .csv</p>
              </label>
            </div>

            {file && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Table className="w-8 h-8 text-teal-600" />
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-700 bg-white rounded-lg p-3 border border-slate-200">
                  <span>{conversionType === 'csv-to-excel' ? 'CSV' : 'Excel'}</span>
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  <span>{conversionType === 'csv-to-excel' ? 'Excel' : 'CSV'}</span>
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
                  <Table className="w-5 h-5 mr-2" />
                  Convert File
                </>
              )}
            </Button>

            {convertedData && (
              <Button 
                variant="outline"
                className="w-full h-12 border-2"
                asChild
              >
                <a href={convertedData.url} download={`converted.${conversionType === 'csv-to-excel' ? 'xlsx' : 'csv'}`}>
                  <Download className="w-5 h-5 mr-2" />
                  Download {convertedData.format}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}