import React, { useEffect, useState } from 'react';

const THEMES = ['default', 'teal', 'sunset', 'night'];

function applyTheme(t) {
  const html = document.documentElement;
  THEMES.forEach((th) => html.classList.remove(`theme-${th}`));
  if (t !== 'default') html.classList.add(`theme-${t}`);
  try {
    localStorage.setItem('ui:theme', t);
  } catch (e) {}
}

export default function ThemeSelector() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ui:theme') || 'default';
      setTheme(saved);
      applyTheme(saved);
    } catch (e) {}
  }, []);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-900 dark:text-white mr-1">Theme</label>
      <select
        aria-label="Select theme"
        value={theme}
        onChange={(e) => {
          const t = e.target.value;
          setTheme(t);
          applyTheme(t);
        }}
        className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded px-2 py-1 border"
      >
        <option value="default">Default</option>
        <option value="teal">Teal</option>
        <option value="sunset">Sunset</option>
        <option value="night">Night</option>
      </select>
    </div>
  );
}
