import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Globe, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DNSLookup() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleLookup = async () => {
    if (!domain.trim()) return;
    
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get DNS records for domain: ${domain}. Return A, AAAA, MX, TXT, NS, CNAME records if available.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            domain: { type: "string" },
            a_records: { type: "array", items: { type: "string" } },
            aaaa_records: { type: "array", items: { type: "string" } },
            mx_records: { type: "array", items: { type: "string" } },
            txt_records: { type: "array", items: { type: "string" } },
            ns_records: { type: "array", items: { type: "string" } },
            cname_records: { type: "array", items: { type: "string" } }
          }
        }
      });
      setResults(response);
    } catch (error) {
      console.error("DNS lookup failed:", error);
    }
    setLoading(false);
  };

  const renderRecordSection = (title, records, color) => {
    if (!records || records.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <Badge className={`${color} text-white border-0`}>{title}</Badge>
        <div className="space-y-2">
          {records.map((record, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-3 font-mono text-sm text-slate-700">
              {record}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">DNS Lookup</h1>
        </div>
        <p className="text-slate-600 text-lg">Retrieve comprehensive DNS records for any domain</p>
      </div>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm mb-8">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg">Enter Domain Name</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
              className="flex-1 h-12 text-lg border-slate-300 focus:border-indigo-500"
            />
            <Button 
              onClick={handleLookup} 
              disabled={loading || !domain.trim()}
              className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Lookup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="text-xl">DNS Records for {results.domain}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {renderRecordSection("A Records", results.a_records, "bg-blue-600")}
            {renderRecordSection("AAAA Records", results.aaaa_records, "bg-purple-600")}
            {renderRecordSection("MX Records", results.mx_records, "bg-green-600")}
            {renderRecordSection("NS Records", results.ns_records, "bg-orange-600")}
            {renderRecordSection("CNAME Records", results.cname_records, "bg-pink-600")}
            {renderRecordSection("TXT Records", results.txt_records, "bg-cyan-600")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}