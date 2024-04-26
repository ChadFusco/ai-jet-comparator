'use client'

import { Image, Link } from '@nextui-org/react';
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="text-xs flex justify-center items-center py-8">
      <div>Built by Chad Fusco&nbsp;&nbsp;|&nbsp;&nbsp;</div>
      <Link
        isExternal
        isBlock
        size="sm"
        href="https://github.com/ChadFusco/ai-jet-comparator"
        className="flex justify-center items-center"
      >
        Source&nbsp;
        <Image
          src={theme === 'dark' ? "github-mark-white.svg" : "github-mark.svg"}
          alt="Github Mark"
          width={16}
          height={16}
        >
        </Image>
      </Link>
    </footer>
  )
}