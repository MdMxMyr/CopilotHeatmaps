"use client";

import { hotjar } from 'react-hotjar';
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hotjar init on first load - client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      hotjar.initialize({ id: 5300940, sv: 6 });
    }
  }, []);

  return <>{children}</>;
}