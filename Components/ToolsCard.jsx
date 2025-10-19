import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ToolCard({ title, description, icon: Icon, url, gradient }) {
  return (
    <Link to={url}>
      <Card className="group h-full border-slate-200/60 hover:border-indigo-300/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
            <span>Use Tool</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
