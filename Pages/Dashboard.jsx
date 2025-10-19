import React from "react";
import ToolCard from "../components/ToolCard";
import { createPageUrl } from "@/utils";
import {
  Globe,
  Key,
  Image,
  FileText,
  Table,
  Code,
  Sparkles,
  Link2,
  Newspaper,
  Search,
  Zap,
  Palette // Added Palette icon
} from "lucide-react";

const tools = [
  {
    title: "DNS Lookup",
    description: "Retrieve comprehensive DNS records for any domain instantly",
    icon: Globe,
    url: createPageUrl("DNSLookup"),
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Password Generator",
    description: "Create ultra-secure passwords with customizable options",
    icon: Key,
    url: createPageUrl("PasswordGenerator"),
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Color Picker",
    description: "Professional color selection and format conversion",
    icon: Palette,
    url: createPageUrl("ColorPicker"),
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Image Converter",
    description: "Convert between PNG, JPG, GIF, and SVG formats seamlessly",
    icon: Image,
    url: createPageUrl("ImageConverter"),
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Document to PDF",
    description: "Transform documents and images into professional PDFs",
    icon: FileText,
    url: createPageUrl("DocumentConverter"),
    gradient: "from-orange-500 to-red-500"
  },
  {
    title: "Excel & CSV Tools",
    description: "Seamlessly convert between Excel and CSV formats",
    icon: Table,
    url: createPageUrl("ExcelCSVConverter"),
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    title: "PSD & SVG Converter",
    description: "Convert between PSD and SVG vector formats",
    icon: Code,
    url: createPageUrl("PSDSVGConverter"),
    gradient: "from-violet-500 to-purple-500"
  },
  {
    title: "Base64 Tools",
    description: "Encode and decode Base64 strings effortlessly",
    icon: Code,
    url: createPageUrl("Base64Tool"),
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    title: "JSON Tools",
    description: "Convert JSON to XML and format JSON beautifully",
    icon: Code,
    url: createPageUrl("JSONTools"),
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    title: "Landing Page Generator",
    description: "Create stunning HTML landing pages from templates",
    icon: Sparkles,
    url: createPageUrl("LandingPageGenerator"),
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Word Counter",
    description: "Analyze text with detailed word and character counts",
    icon: FileText,
    url: createPageUrl("WordCounter"),
    gradient: "from-lime-500 to-green-500"
  },
  {
    title: "Domain Registration",
    description: "Register domains through name.com API integration",
    icon: Search,
    url: createPageUrl("DomainRegistration"),
    gradient: "from-sky-500 to-blue-500"
  },
  {
    title: "Image Search",
    description: "Find where images appear across the web",
    icon: Search,
    url: createPageUrl("ImageSearch"),
    gradient: "from-fuchsia-500 to-purple-500"
  },
  {
    title: "AI News Hub",
    description: "Latest AI industry news updated every 12 hours",
    icon: Newspaper,
    url: createPageUrl("AINews"),
    gradient: "from-cyan-500 to-teal-500"
  },
  {
    title: "URL Shortener",
    description: "Create short links with abcw.xyz domain",
    icon: Link2,
    url: createPageUrl("URLShortener"),
    gradient: "from-rose-500 to-pink-500"
  }
];

export default function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Network Tools Suite
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Professional-grade utilities for developers and creators
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
}
