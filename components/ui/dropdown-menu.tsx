"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({ open: false, setOpen: () => {} })

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={ref}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { setOpen, open } = React.useContext(DropdownMenuContext)
  
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        setOpen(!open)
        if (child.props.onClick) child.props.onClick(e)
      }
    })
  }
  
  return (
    <button onClick={() => setOpen(!open)}>
      {children}
    </button>
  )
}

export const DropdownMenuContent = ({ children, className, align = "center" }: { children: React.ReactNode; className?: string; align?: "start" | "center" | "end" | "left" }) => {
  const { open } = React.useContext(DropdownMenuContext)
  if (!open) return null
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      align === "end" ? "right-0" : align === "left" ? "left-0" : "left-1/2 -translate-x-1/2",
      className
    )}>
      {children}
    </div>
  )
}

export const DropdownMenuItem = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div 
      onClick={() => {
        setOpen(false);
        if (onClick) onClick();
      }}
      className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    >
      {children}
    </div>
  )
}

export const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  )
}

export const DropdownMenuSeparator = ({ className }: { className?: string }) => {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
  )
}
