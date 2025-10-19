import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Upload, Loader2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const templates = [
  {
    id: "startup",
    name: "Startup Launch",
    description: "Modern startup landing page with hero section and features",
    preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    color: "from-blue-500 to-cyan-500",
    colorPalettes: [
      { name: "Ocean Blue", primary: "#0EA5E9", secondary: "#06B6D4", accent: "#3B82F6" },
      { name: "Vibrant Purple", primary: "#A855F7", secondary: "#EC4899", accent: "#8B5CF6" },
      { name: "Fresh Green", primary: "#10B981", secondary: "#059669", accent: "#14B8A6" }
    ]
  },
  {
    id: "saas",
    name: "SaaS Product",
    description: "Software as a service template with pricing and testimonials",
    preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    color: "from-purple-500 to-pink-500",
    colorPalettes: [
      { name: "Royal Purple", primary: "#9333EA", secondary: "#C026D3", accent: "#7C3AED" },
      { name: "Tech Blue", primary: "#2563EB", secondary: "#3B82F6", accent: "#1D4ED8" },
      { name: "Sunset Orange", primary: "#F97316", secondary: "#EA580C", accent: "#FB923C" }
    ]
  },
  {
    id: "agency",
    name: "Agency Portfolio",
    description: "Creative agency showcase with project gallery",
    preview: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    color: "from-green-500 to-emerald-500",
    colorPalettes: [
      { name: "Emerald Green", primary: "#059669", secondary: "#10B981", accent: "#14B8A6" },
      { name: "Slate Gray", primary: "#475569", secondary: "#64748B", accent: "#334155" },
      { name: "Rose Pink", primary: "#F43F5E", secondary: "#FB7185", accent: "#E11D48" }
    ]
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Online store landing with product showcase",
    preview: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop",
    color: "from-orange-500 to-red-500",
    colorPalettes: [
      { name: "Warm Red", primary: "#DC2626", secondary: "#EF4444", accent: "#F87171" },
      { name: "Gold", primary: "#D97706", secondary: "#F59E0B", accent: "#FBBF24" },
      { name: "Teal", primary: "#0D9488", secondary: "#14B8A6", accent: "#2DD4BF" }
    ]
  },
  {
    id: "app",
    name: "App Download",
    description: "Mobile app promotion page with download buttons",
    preview: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    color: "from-indigo-500 to-purple-500",
    colorPalettes: [
      { name: "Indigo", primary: "#4F46E5", secondary: "#6366F1", accent: "#818CF8" },
      { name: "Cyan", primary: "#0891B2", secondary: "#06B6D4", accent: "#22D3EE" },
      { name: "Violet", primary: "#7C3AED", secondary: "#8B5CF6", accent: "#A78BFA" }
    ]
  },
  {
    id: "portfolio",
    name: "Personal Portfolio",
    description: "Showcase your work with projects and resume",
    preview: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=300&fit=crop",
    color: "from-teal-500 to-cyan-500",
    colorPalettes: [
      { name: "Professional Blue", primary: "#1E40AF", secondary: "#3B82F6", accent: "#60A5FA" },
      { name: "Creative Purple", primary: "#6D28D9", secondary: "#8B5CF6", accent: "#A78BFA" },
      { name: "Modern Gray", primary: "#374151", secondary: "#4B5563", accent: "#6B7280" }
    ]
  }
];

const fonts = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" }
];

export default function LandingPageGenerator() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  const [config, setConfig] = useState({
    siteTitle: "",
    font: fonts[0].value,
    colorPalette: null,
    favicon: null,
    logo: null,
    banner: null,
    background: null,
    portfolioFiles: []
  });

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setConfig(prev => ({ ...prev, [type]: file_url }));
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handlePortfolioUpload = async (files) => {
    const uploadedFiles = [];
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedFiles.push({ url: file_url, name: file.name, type: file.type });
      } catch (error) {
        console.error("Portfolio file upload failed:", error);
      }
    }
    setConfig(prev => ({ ...prev, portfolioFiles: [...prev.portfolioFiles, ...uploadedFiles] }));
  };

  const generateLandingPage = async () => {
    setGenerating(true);
    try {
      const palette = config.colorPalette || selectedTemplate.colorPalettes[0];
      
      const prompt = `Create a complete, production-ready HTML landing page for "${selectedTemplate.name}" template.

Requirements:
- Site Title: ${config.siteTitle || "My Site"}
- Font: ${config.font}
- Color Palette: Primary ${palette.primary}, Secondary ${palette.secondary}, Accent ${palette.accent}
- Use Tailwind CSS (include CDN link)
- Use Lucide icons (include CDN link)
- Include modern navigation bar with logo placeholder
- Make it fully responsive
- Add smooth animations and transitions
- Include a footer that says "Made with <a href="https://mspmcp.dev">mspmcp.dev</a> landing page generator"
${config.banner ? `- Use banner image: ${config.banner}` : ''}
${config.background ? `- Use background: ${config.background}` : ''}
${selectedTemplate.id === 'portfolio' && config.portfolioFiles.length > 0 ? `- Include portfolio items for these files: ${config.portfolioFiles.map(f => f.name).join(', ')}` : ''}

Template Description: ${selectedTemplate.description}

Return ONLY the complete HTML code, no explanations.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            html: { type: "string" },
            css: { type: "string" }
          }
        }
      });

      // Create a complete HTML with proper structure
      let finalHtml = result.html;
      
      // Add favicon link if provided
      if (config.favicon) {
        finalHtml = finalHtml.replace('</head>', `  <link rel="icon" href="favicon.ico" type="image/x-icon">\n</head>`);
      }
      
      // Replace logo placeholder if provided
      if (config.logo) {
        finalHtml = finalHtml.replace(/logo-placeholder|logo\.png|logo\.svg/gi, 'logo.png');
      }

      // Generate ZIP file
      const zipContent = await generateZipFile(finalHtml);
      const blob = new Blob([zipContent], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

    } catch (error) {
      console.error("Generation failed:", error);
    }
    setGenerating(false);
  };

  const generateZipFile = async (html) => {
    // Import JSZip dynamically
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add HTML file
    zip.file("index.html", html);

    // Add README
    zip.file("README.txt", `Landing Page Generated by mspmcp.dev

To use this landing page:
1. Extract all files to your web server
2. Open index.html in your browser
3. Customize as needed

All images are referenced from their URLs. If you want to use local images:
1. Download the images
2. Update the src attributes in index.html

Made with ❤️ by mspmcp.dev`);

    // Download and add files if provided
    if (config.favicon) {
      const faviconBlob = await fetchFileAsBlob(config.favicon);
      zip.file("favicon.ico", faviconBlob);
    }

    if (config.logo) {
      const logoBlob = await fetchFileAsBlob(config.logo);
      zip.file("logo.png", logoBlob);
    }

    if (config.banner) {
      const bannerBlob = await fetchFileAsBlob(config.banner);
      zip.file("banner.jpg", bannerBlob);
    }

    if (config.background) {
      const bgBlob = await fetchFileAsBlob(config.background);
      zip.file("background.jpg", bgBlob);
    }

    // Add portfolio files
    if (config.portfolioFiles.length > 0) {
      const portfolioFolder = zip.folder("portfolio");
      for (const file of config.portfolioFiles) {
        const fileBlob = await fetchFileAsBlob(file.url);
        portfolioFolder.file(file.name, fileBlob);
      }
    }

    return await zip.generateAsync({ type: "blob" });
  };

  const fetchFileAsBlob = async (url) => {
    try {
      const response = await fetch(url);
      return await response.blob();
    } catch (error) {
      console.error("Failed to fetch file:", error);
      return new Blob();
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Landing Page Generator</h1>
        </div>
        <p className="text-slate-600 text-lg">Create professional landing pages with full customization</p>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Template</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className="border-slate-200/60 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm overflow-hidden"
                onClick={() => {
                  setSelectedTemplate(template);
                  setConfig(prev => ({ ...prev, colorPalette: template.colorPalettes[0] }));
                  setStep(2);
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                </div>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3 shadow-md`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-slate-100">
                    Select Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedTemplate && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Customize Your Page</h2>
            <Button variant="outline" onClick={() => setStep(1)}>
              Change Template
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200/60 shadow-xl bg-white/90">
                <CardHeader className="border-b border-slate-200/60">
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Site Title</Label>
                    <Input
                      placeholder="My Awesome Website"
                      value={config.siteTitle}
                      onChange={(e) => setConfig(prev => ({ ...prev, siteTitle: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Font Family</Label>
                    <Select 
                      value={config.font} 
                      onValueChange={(value) => setConfig(prev => ({ ...prev, font: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Color Palette</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {selectedTemplate.colorPalettes.map(palette => (
                        <button
                          key={palette.name}
                          onClick={() => setConfig(prev => ({ ...prev, colorPalette: palette }))}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            config.colorPalette?.name === palette.name 
                              ? 'border-indigo-600 ring-2 ring-indigo-200' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex gap-1 mb-2">
                            <div className="w-full h-8 rounded" style={{ backgroundColor: palette.primary }} />
                            <div className="w-full h-8 rounded" style={{ backgroundColor: palette.secondary }} />
                            <div className="w-full h-8 rounded" style={{ backgroundColor: palette.accent }} />
                          </div>
                          <p className="text-xs font-medium text-slate-700">{palette.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-xl bg-white/90">
                <CardHeader className="border-b border-slate-200/60">
                  <CardTitle>Upload Assets</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Favicon (optional)</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".ico,.png"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'favicon')}
                        className="hidden"
                        id="favicon-upload"
                      />
                      <label htmlFor="favicon-upload">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          {config.favicon ? (
                            <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              Favicon uploaded
                            </p>
                          ) : (
                            <p className="text-sm text-slate-600">Upload favicon (.ico or .png)</p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Logo (optional)</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          {config.logo ? (
                            <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              Logo uploaded
                            </p>
                          ) : (
                            <p className="text-sm text-slate-600">Upload logo image</p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Banner Image (optional)</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'banner')}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label htmlFor="banner-upload">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          {config.banner ? (
                            <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              Banner uploaded
                            </p>
                          ) : (
                            <p className="text-sm text-slate-600">Upload banner image</p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Background Image (optional)</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'background')}
                        className="hidden"
                        id="bg-upload"
                      />
                      <label htmlFor="bg-upload">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          {config.background ? (
                            <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              Background uploaded
                            </p>
                          ) : (
                            <p className="text-sm text-slate-600">Upload background image</p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {selectedTemplate.id === 'portfolio' && (
                    <div>
                      <Label>Portfolio Files (PDFs, Images, Code)</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg,.gif,.txt,.js,.html,.css"
                          onChange={(e) => handlePortfolioUpload(Array.from(e.target.files))}
                          className="hidden"
                          id="portfolio-upload"
                        />
                        <label htmlFor="portfolio-upload">
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                            <p className="text-sm text-slate-600">Upload portfolio files</p>
                          </div>
                        </label>
                        {config.portfolioFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {config.portfolioFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                <Check className="w-4 h-4 text-green-600" />
                                {file.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-slate-200/60 shadow-xl bg-white/90 sticky top-6">
                <CardHeader className="border-b border-slate-200/60">
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-slate-200">
                    <img 
                      src={selectedTemplate.preview} 
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Template:</span>
                      <span className="font-semibold text-slate-900">{selectedTemplate.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Title:</span>
                      <span className="font-semibold text-slate-900">{config.siteTitle || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Font:</span>
                      <span className="font-semibold text-slate-900">{fonts.find(f => f.value === config.font)?.name}</span>
                    </div>
                    {config.colorPalette && (
                      <div>
                        <span className="text-slate-600 block mb-2">Colors:</span>
                        <div className="flex gap-2">
                          <div className="w-full h-8 rounded" style={{ backgroundColor: config.colorPalette.primary }} />
                          <div className="w-full h-8 rounded" style={{ backgroundColor: config.colorPalette.secondary }} />
                          <div className="w-full h-8 rounded" style={{ backgroundColor: config.colorPalette.accent }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={generateLandingPage}
                    disabled={generating || !config.siteTitle.trim()}
                    className="w-full h-12 mt-6 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Page
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {downloadUrl && (
        <Card className="border-slate-200/60 shadow-xl bg-white/90 backdrop-blur-sm mt-6">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="text-xl flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              Your Landing Page is Ready!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-4 border border-green-200">
              <p className="text-slate-700 mb-2">
                ✨ Your landing page has been generated with all your customizations!
              </p>
              <p className="text-sm text-slate-600">
                The ZIP file includes: HTML file, README, and all uploaded assets (favicon, logo, banner, background, portfolio files).
              </p>
            </div>

            <Button 
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              asChild
            >
              <a href={downloadUrl} download={`${config.siteTitle.replace(/\s+/g, '-').toLowerCase() || 'landing-page'}.zip`}>
                <Download className="w-5 h-5 mr-2" />
                Download ZIP File
              </a>
            </Button>

            <Button 
              variant="outline"
              className="w-full h-12 mt-3"
              onClick={() => {
                setStep(1);
                setDownloadUrl(null);
                setConfig({
                  siteTitle: "",
                  font: fonts[0].value,
                  colorPalette: null,
                  favicon: null,
                  logo: null,
                  banner: null,
                  background: null,
                  portfolioFiles: []
                });
              }}
            >
              Create Another Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
