import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      toast.success("Welcome back, Hashim!");
      setIsLoginOpen(false);
      setPassword('');
    } else {
      toast.error("Invalid password. Hint: 1234");
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl">
            H
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">{CONFIG.name.toUpperCase()}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Home</Link>
          <a href="#projects" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Projects</a>
          <a href="#skills" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Skills</a>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-zinc-900">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                    H
                  </div>
                  <span className="font-medium">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100">
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                    <ShieldCheck size={16} />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 text-red-400 focus:text-red-400 cursor-pointer">
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                  <Lock size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                  <DialogTitle>Admin Login</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      placeholder="Enter password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-zinc-950 border-zinc-800"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full bg-amber-500 text-zinc-950 font-bold hover:bg-amber-600">
                    Login
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-900 border-b border-zinc-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Home</Link>
          <a href="#projects" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Projects</a>
          <a href="#skills" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Skills</a>
          {user ? (
            <>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-amber-500">Admin Panel</Link>
              <Button onClick={() => { logout(); setIsMenuOpen(false); }} variant="destructive" className="w-full">Logout</Button>
            </>
          ) : (
            <Button onClick={() => setIsLoginOpen(true)} variant="outline" className="w-full border-zinc-800">Admin Login</Button>
          )}
        </div>
      )}
    </nav>
  );
}
