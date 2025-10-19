import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, Copy, Check, ExternalLink, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [copied, setCopied] = useState(null);
  const queryClient = useQueryClient();

  const { data: shortenedUrls, isLoading } = useQuery({
    queryKey: ['shortened-urls'],
    queryFn: () => base44.entities.ShortenedUrl.list('-created_date'),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const shortCode = customAlias || Math.random().toString(36).substr(2, 6);
      return base44.entities.ShortenedUrl.create({
        original_url: data.url,
        short_code: shortCode,
        custom_alias: customAlias || null,
        clicks: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortened-urls'] });
      setUrl("");
      setCustomAlias("");
    }
  });

  const handleShorten = () => {
    if (!url.trim()) return;
    createMutation.mutate({ url, customAlias });
  };

  const copyToClipboard = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">URL Shortener</h1>
        </div>
        <p className="text-slate-600 text-lg">Create short links with abcw.xyz domain</p>
      </div>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm mb-8">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg">Shorten a New URL</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Long URL
              </label>
              <Input
                placeholder="https://example.com/very/long/url/here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Custom Alias (Optional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">abcw.xyz/</span>
                <Input
                  placeholder="my-custom-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>
            <Button 
              onClick={handleShorten}
              disabled={!url.trim() || createMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg"
            >
              <Link2 className="w-5 h-5 mr-2" />
              Shorten URL
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200/60">
          <CardTitle className="text-lg">Your Shortened URLs</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-lg p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : shortenedUrls.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No shortened URLs yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shortenedUrls.map((item) => {
                const shortUrl = `https://abcw.xyz/${item.short_code}`;
                return (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <a 
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                          >
                            {shortUrl}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          {item.custom_alias && (
                            <Badge variant="secondary" className="text-xs">Custom</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 truncate">{item.original_url}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {item.clicks} clicks
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(shortUrl, item.id)}
                      >
                        {copied === item.id ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}