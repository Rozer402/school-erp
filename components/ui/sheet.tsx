import * as React from "react"

export const Sheet = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)

export const SheetTrigger = ({ children, asChild: _asChild }: { children: React.ReactNode; asChild?: boolean }) => (
  <div>{children}</div>
)

export const SheetContent = ({ children, className, side: _side }: { children: React.ReactNode; className?: string; side?: string }) => (
  <div className={className}>{children}</div>
)
