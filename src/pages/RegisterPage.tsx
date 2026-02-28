import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function FloatingShapes() {
  return (
    <>
      <div
        className="floating-shape bg-primary"
        style={{ width: 280, height: 280, top: '-8%', left: '-5%', animationDelay: '0s', animationDuration: '9s' }}
      />
      <div
        className="floating-shape bg-emerald-400"
        style={{ width: 180, height: 180, bottom: '5%', right: '-3%', animationDelay: '3s', animationDuration: '11s' }}
      />
      <div
        className="floating-shape bg-teal-300"
        style={{ width: 100, height: 100, top: '50%', left: '8%', animationDelay: '1s', animationDuration: '7s' }}
      />
      <div
        className="floating-shape bg-green-400"
        style={{ width: 70, height: 70, top: '20%', right: '15%', animationDelay: '5s', animationDuration: '8s' }}
      />
    </>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (register(name, email, password)) {
      navigate('/');
    } else {
      toast({ title: 'Registration failed', description: 'Email already in use', variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-bg">
      <FloatingShapes />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary mb-4 shadow-xl animate-pulse-glow"
          >
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold gradient-text">Create account</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">Start tracking your expenses with ExpenseIQ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-7 space-y-5 border border-white/10 shadow-2xl">
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 rounded-xl h-11"
              required
            />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 rounded-xl h-11"
              required
            />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Password</Label>
            <div className="relative mt-1.5">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
