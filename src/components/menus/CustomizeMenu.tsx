"use client";

import { useState } from "react";

interface CustomizeMenuProps {
  settings: CustomizeSettings;
  setSettings: (settings: CustomizeSettings) => void;
}

export interface CustomizeSettings {
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
}

const backgroundColors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#ffffff" },
  { name: "Soft Gray", value: "#f8f9fa" },
  { name: "Pastel Blue", value: "#e3f2fd" },
  { name: "Pastel Green", value: "#e8f5e8" },
  { name: "Pastel Purple", value: "#f3e5f5" },
  { name: "Pastel Pink", value: "#fce4ec" },
  { name: "Pastel Orange", value: "#fff3e0" },
  { name: "Pastel Yellow", value: "#fffde7" },
  { name: "Pastel Red", value: "#ffebee" },
  { name: "Pastel Teal", value: "#e0f2f1" },
];

const fontFamilies = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times", value: "Times New Roman, serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
];

const fontSizes = [
  { name: "S", value: "16px" },
  { name: "M", value: "18px" },
  { name: "L", value: "24px" },
  { name: "XL", value: "32px" },
];

const textColors = [
  { name: "White", value: "#ffffff" },
  { name: "Dark Gray", value: "#424242" },
  { name: "Medium Gray", value: "#757575" },
  { name: "Blue Gray", value: "#546e7a" },
  { name: "Forest Green", value: "#2e7d32" },
  { name: "Deep Purple", value: "#6a1b9a" },
  { name: "Rose Pink", value: "#c2185b" },
  { name: "Deep Orange", value: "#d84315" },
  { name: "Amber", value: "#f57c00" },
  { name: "Teal", value: "#00695c" },
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
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="space-y-3">
        {/* Background Color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Background
          </label>
          <div className="flex gap-1">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  handleSettingChange("backgroundColor", color.value)
                }
                className={`w-6 h-6 rounded border ${
                  settings.backgroundColor === color.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Font Settings */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Font
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) =>
                handleSettingChange("fontFamily", e.target.value)
              }
              className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Size
            </label>
            <select
              value={settings.fontSize}
              onChange={(e) => handleSettingChange("fontSize", e.target.value)}
              className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            >
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Text Color
          </label>
          <div className="flex gap-1">
            {textColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleSettingChange("textColor", color.value)}
                className={`w-6 h-6 rounded border flex items-center justify-center ${
                  settings.textColor === color.value
                    ? "border-blue-500 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    color:
                      color.value === "#424242" || color.value === "#546e7a"
                        ? "#ffffff"
                        : "#ffffff",
                  }}
                >
                  A
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
