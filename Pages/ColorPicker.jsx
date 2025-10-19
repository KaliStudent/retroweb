import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Palette, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ColorPicker() {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hex, setHex] = useState("#ff0000");
  const [rgb, setRgb] = useState({ r: 255, g: 0, b: 0 });
  const [copied, setCopied] = useState(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef(null);

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    s = s / 100;
    l = l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  useEffect(() => {
    const newRgb = hslToRgb(hue, saturation, lightness);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }, [hue, saturation, lightness]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSaturation = Math.round((x / rect.width) * 100);
    const newLightness = Math.round(100 - (y / rect.height) * 100);
    
    setSaturation(newSaturation);
    setLightness(newLightness);
  };

  const handleCanvasMouseDown = (e) => {
    setIsDragging(true);
    handleCanvasClick(e);
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      handleCanvasClick(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleCanvasMouseMove);
      window.addEventListener('mouseup', handleCanvasMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleCanvasMouseMove);
        window.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isDragging]);

  const handleHexInput = (value) => {
    setHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const newRgb = hexToRgb(value);
      if (newRgb) {
        setRgb(newRgb);
        const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
      }
    }
  };

  const handleRgbChange = (color, value) => {
    const newRgb = { ...rgb, [color]: parseInt(value) || 0 };
    setRgb(newRgb);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const addToHistory = () => {
    if (!colorHistory.includes(hex)) {
      setColorHistory([hex, ...colorHistory.slice(0, 11)]);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Color Picker</h1>
        </div>
        <p className="text-slate-600 text-lg">Professional color selection and conversion tool</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-200/60">
              <CardTitle className="text-lg">Color Selector</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    className="w-full aspect-square rounded-xl cursor-crosshair shadow-lg relative overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(to bottom, transparent, black),
                        linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
                      `
                    }}
                  >
                    <div
                      className="absolute w-5 h-5 border-3 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${saturation}%`,
                        top: `${100 - lightness}%`,
                        boxShadow: '0 0 0 1.5px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>
                </div>

                <div className="w-12">
                  <div className="h-full w-full rounded-lg overflow-hidden shadow-lg relative">
                    <div
                      className="h-full w-full cursor-pointer"
                      style={{
                        background: 'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const newHue = Math.round((y / rect.height) * 360);
                        setHue(newHue);
                      }}
                    >
                      <div
                        className="absolute left-0 right-0 h-1 border-2 border-white shadow-lg"
                        style={{
                          top: `${(hue / 360) * 100}%`,
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div
                className="w-full h-32 rounded-xl shadow-lg mb-6"
                style={{ backgroundColor: hex }}
              />

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">HEX</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(hex, 'hex')}
                      className="h-7"
                    >
                      {copied === 'hex' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <Input
                    value={hex}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="font-mono text-base"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">RGB</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                      className="h-7"
                    >
                      {copied === 'rgb' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-red-600 w-4">R</span>
                      <Slider
                        value={[rgb.r]}
                        onValueChange={(val) => handleRgbChange('r', val[0])}
                        max={255}
                        className="flex-1"
                      />
                      <Input
                        value={rgb.r}
                        onChange={(e) => handleRgbChange('r', e.target.value)}
                        className="w-16 h-8 text-xs text-center"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-green-600 w-4">G</span>
                      <Slider
                        value={[rgb.g]}
                        onValueChange={(val) => handleRgbChange('g', val[0])}
                        max={255}
                        className="flex-1"
                      />
                      <Input
                        value={rgb.g}
                        onChange={(e) => handleRgbChange('g', e.target.value)}
                        className="w-16 h-8 text-xs text-center"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-600 w-4">B</span>
                      <Slider
                        value={[rgb.b]}
                        onValueChange={(val) => handleRgbChange('b', val[0])}
                        max={255}
                        className="flex-1"
                      />
                      <Input
                        value={rgb.b}
                        onChange={(e) => handleRgbChange('b', e.target.value)}
                        className="w-16 h-8 text-xs text-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">HSL</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`hsl(${hue}, ${saturation}%, ${lightness}%)`, 'hsl')}
                      className="h-7"
                    >
                      {copied === 'hsl' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">H</div>
                      <Badge variant="outline" className="font-mono">{hue}°</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">S</div>
                      <Badge variant="outline" className="font-mono">{saturation}%</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">L</div>
                      <Badge variant="outline" className="font-mono">{lightness}%</Badge>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={addToHistory}
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600"
                >
                  Add to History
                </Button>
              </div>
            </CardContent>
          </Card>

          {colorHistory.length > 0 && (
            <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-200/60">
                <CardTitle className="text-lg">Color History</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-6 gap-2">
                  {colorHistory.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleHexInput(color)}
                      className="aspect-square rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer border-2 border-slate-200 hover:border-slate-400"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}