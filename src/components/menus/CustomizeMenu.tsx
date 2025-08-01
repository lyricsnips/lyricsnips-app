"use client";

import {
  Special_Gothic_Expanded_One,
  UnifrakturMaguntia,
  Pirata_One,
  Cal_Sans,
  Schoolbell,
} from "next/font/google";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
});

const unifraktur = UnifrakturMaguntia({
  weight: ["400"],
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  weight: ["400"],
  subsets: ["latin"],
});

const calSans = Cal_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

const schoolbell = Schoolbell({
  weight: ["400"],
  subsets: ["latin"],
});

interface CustomizeMenuProps {
  settings: CustomizeSettings;
  setSettings: (settings: CustomizeSettings) => void;
}

export interface CustomizeSettings {
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
}

const backgroundColors = [
  { name: "Dark Mode", value: "#0f0f0f" },
  { name: "Light Mode", value: "#ffffff" },
  { name: "Sage Green", value: "#9ca3af" },
  { name: "Dusty Rose", value: "#f3e8ff" },
  { name: "Mint", value: "#ecfdf5" },
  { name: "Lavender", value: "#faf5ff" },
  { name: "Cream", value: "#fefce8" },
  { name: "Slate", value: "#f1f5f9" },
  { name: "Warm Gray", value: "#f8fafc" },
  { name: "Soft Blue", value: "#eff6ff" },
  { name: "Peach", value: "#fef2f2" },
  { name: "Taupe", value: "#f5f5f4" },
];

const fontFamilies = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times", value: "Times New Roman, serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Special Gothic", value: gothic.style.fontFamily },
  { name: "Unifraktur Maguntia", value: unifraktur.style.fontFamily },
  { name: "Pirata One", value: pirataOne.style.fontFamily },
  { name: "Cal Sans", value: calSans.style.fontFamily },
  { name: "Schoolbell", value: schoolbell.style.fontFamily },
];

const textColors = [
  { name: "Pure White", value: "#ffffff" },
  { name: "Charcoal", value: "#1f2937" },
  { name: "Slate Gray", value: "#64748b" },
  { name: "Forest Green", value: "#059669" },
  { name: "Navy Blue", value: "#1e40af" },
  { name: "Burgundy", value: "#991b1b" },
  { name: "Olive", value: "#65a30d" },
  { name: "Teal", value: "#0d9488" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Rose", value: "#be185d" },
];

export default function CustomizeMenu({
  settings,
  setSettings,
}: CustomizeMenuProps) {
  const handleSettingChange = (key: keyof CustomizeSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  return (
    <div className="mb-4 p-3  border border-gray-200 shadow-sm">
      <div className="grid grid-cols-3 gap-3">
        {/* Font Settings */}
        <div>
          <label className="block text-sm font-medium mb-1">Font</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
            className="w-full p-1 text-xs text-black border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {fontFamilies.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium  mb-1">Text Color</label>
          <div className="flex gap-1 flex-wrap">
            {textColors.slice(0, 6).map((color) => (
              <button
                key={color.value}
                onClick={() => handleSettingChange("textColor", color.value)}
                className={`w-6 h-6 border flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                  settings.textColor === color.value
                    ? "border-gray-500 scale-110 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    color: color.value === "#ffffff" ? "#000000" : "#ffffff",
                  }}
                >
                  A
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Background */}
        <div>
          <label className="block text-sm font-medium  mb-1">Background</label>
          <div className="flex gap-1 flex-wrap">
            {backgroundColors.slice(0, 6).map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  handleSettingChange("backgroundColor", color.value)
                }
                className={`w-6 h-6 rounded border transition-all duration-200 hover:scale-105 ${
                  settings.backgroundColor === color.value
                    ? "border-gray-500 scale-110 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
