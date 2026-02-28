import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { LogOut, Moon, Sun, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-2xl">
      {/* Animated gradient strip */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]">
        <div
          className="h-full w-full animate-gradient"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(142 76% 36%), hsl(190 90% 50%), hsl(var(--primary)))',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg animate-pulse-glow"
          >
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div>
            <span className="font-display text-xl font-bold gradient-text">ExpenseIQ</span>
            {user && (
              <p className="text-xs text-muted-foreground -mt-0.5 hidden sm:block">
                {getGreeting()}, <span className="font-medium text-foreground">{user.name.split(' ')[0]}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="rounded-full hover:bg-primary/10 transition-colors"
          >
            <motion.div
              key={isDark ? 'sun' : 'moon'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </Button>
          {user && (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-primary-foreground text-sm font-bold shadow-md">
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
