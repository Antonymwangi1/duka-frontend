'use client'

import { useAuthStore } from '@/store/auth.store'
import { Bell, Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const { shop }              = useAuthStore()
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between shrink-0">

            <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Mobile logo */}
                <span className="font-bold text-primary text-lg lg:hidden">
                    Duka
                </span>

                {/* Desktop shop name */}
                <p className="hidden lg:block text-sm text-muted-foreground">
                    {shop?.shopName ?? 'Duka'}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>

                <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                </Button>
            </div>
        </header>
    )
}