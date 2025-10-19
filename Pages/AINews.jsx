import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, RefreshCw, Loader2, ExternalLink, Search, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AINews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchingNews, setFetchingNews] = useState(false);
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['news-articles'],
    queryFn: () => base44.entities.NewsArticle.filter({ is_archived: false }, '-published_date', 50),
    initialData: []
  });

  // Auto-fetch news on initial load if no articles exist
  useEffect(() => {
    if (!isLoading && articles.length === 0) {
      fetchLatestNews();
    }
  }, [isLoading, articles.length]);

  const fetchLatestNews = async () => {
    setFetchingNews(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find the top 10 most important and trending AI news stories from the past 7 days. Include stories about AI models, products, research breakthroughs, industry news, and ethics. For each story provide: title, summary (2-3 sentences), source, and publish date.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  url: { type: "string" },
                  published_date: { type: "string" },
                  category: { type: "string", enum: ["ai-models", "products", "research", "industry", "ethics", "other"] }
                }
              }
            }
          }
        }
      });

      for (const article of result.articles) {
        await base44.entities.NewsArticle.create({
          title: article.title,
          summary: article.summary,
          source: article.source,
          url: article.url,
          published_date: article.published_date,
          category: article.category
        });
      }

      queryClient.invalidateQueries({ queryKey: ['news-articles'] });
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
    setFetchingNews(false);
  };

  const filteredArticles = articles.filter(article => 
    searchTerm === "" || 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryColors = {
    "ai-models": "bg-blue-100 text-blue-800",
    "products": "bg-green-100 text-green-800",
    "research": "bg-purple-100 text-purple-800",
    "industry": "bg-orange-100 text-orange-800",
    "ethics": "bg-pink-100 text-pink-800",
    "other": "bg-gray-100 text-gray-800"
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">AI News Hub</h1>
        </div>
        <p className="text-slate-600 text-lg">Latest AI industry news updated regularly</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button 
          onClick={fetchLatestNews}
          disabled={fetchingNews}
          className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg"
        >
          {fetchingNews ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh News
            </>
          )}
        </Button>
      </div>

      {(isLoading || fetchingNews) && articles.length === 0 ? (
        <div className="space-y-6">
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-indigo-600 animate-spin" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Fetching Latest AI News</h3>
            <p className="text-slate-500">Please wait while we gather the latest articles...</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-slate-200/60 animate-pulse">
                <CardHeader className="border-b border-slate-200/60">
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <Card 
              key={article.id}
              className="border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group"
            >
              <CardHeader className="border-b border-slate-200/60">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <CardTitle className="text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge className={`${categoryColors[article.category]} border-0`}>
                    {article.category}
                  </Badge>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(article.published_date), 'MMM d, yyyy')}
                  </span>
                  {article.source && (
                    <span className="text-slate-500">• {article.source}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600 mb-4 line-clamp-3">{article.summary}</p>
                {article.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full group-hover:border-indigo-300 group-hover:text-indigo-600"
                  >
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Full Article
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !fetchingNews && filteredArticles.length === 0 && articles.length > 0 && (
        <Card className="border-slate-200/60 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Results Found</h3>
            <p className="text-slate-500">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}