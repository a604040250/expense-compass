import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { LogOut, Moon, Sun, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">ExpenseIQ</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} className="rounded-full">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full text-muted-foreground hover:text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
