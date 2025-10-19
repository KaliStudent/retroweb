import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JSONTools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("format");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setOutput("Error: Invalid JSON");
    }
  };

  const handleToXML = () => {
    try {
      const parsed = JSON.parse(input);
      const xml = jsonToXml(parsed);
      setOutput(xml);
    } catch (error) {
      setOutput("Error: Invalid JSON");
    }
  };

  const jsonToXml = (obj, rootName = "root") => {
    const convertValue = (key, value) => {
      if (value === null) return `<${key}/>`;
      if (typeof value === "object" && !Array.isArray(value)) {
        return `<${key}>${Object.entries(value).map(([k, v]) => convertValue(k, v)).join("")}</${key}>`;
      }
      if (Array.isArray(value)) {
        return value.map(item => convertValue(key, item)).join("");
      }
      return `<${key}>${value}</${key}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${Object.entries(obj).map(([k, v]) => convertValue(k, v)).join("")}</${rootName}>`;
  };

  const handleConvert = () => {
    if (mode === "format") {
      handleFormat();
    } else {
      handleToXML();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">JSON Tools</h1>
        </div>
        <p className="text-slate-600 text-lg">Format JSON and convert to XML</p>
      </div>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200/60">
          <Tabs value={mode} onValueChange={setMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="format" className="text-base">Format JSON</TabsTrigger>
              <TabsTrigger value="xml" className="text-base">JSON to XML</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Input JSON
              </label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"key": "value", "array": [1, 2, 3]}'
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handleConvert}
              disabled={!input.trim()}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg"
            >
              <Code className="w-5 h-5 mr-2" />
              {mode === "format" ? "Format JSON" : "Convert to XML"}
            </Button>

            {output && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {mode === "format" ? "Formatted JSON" : "XML Output"}
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
 