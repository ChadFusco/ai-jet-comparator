'use client'

import { useTheme } from 'next-themes';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  function clickHandler() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <button
      onClick={clickHandler}
      className="p-2 mb-4 text-xs font-semibold uppercase tracking-wider border-2 rounded dark:border-white border-gray-800 dark:text-white text-gray-800">
      Toggle Theme
    </button>
  )
}
