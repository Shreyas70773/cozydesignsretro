"use client";

import { usePathname } from "next/navigation";

import { PreloaderSequence } from "./preloader-sequence";

export function RoutePreloader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <>
      {children}
      <PreloaderSequence key={pathname} />
    </>
  );
}
