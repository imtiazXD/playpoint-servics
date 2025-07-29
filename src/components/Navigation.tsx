import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import { FloatingElement } from "@/components/ui/floating-elements";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/order", label: "Order Now" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300">
            <FloatingElement floatDirection="circular" duration={4} intensity={2}>
              <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-gradient-primary flex items-center justify-center animate-glow-pulse">
              <span className="text-primary-foreground font-bold text-sm md:text-lg">P</span>
              </div>
            </FloatingElement>
            <span className="text-lg md:text-xl font-bold text-foreground">Play Point</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 ${
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <NotificationBell />
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="hover:shadow-glow hover:animate-wiggle transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="hover:shadow-glow hover:animate-shake transition-all duration-300">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="gaming" size="sm" className="hover:animate-heartbeat">
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-slide-in">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive(item.href) 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
               <div className="pt-3 border-t border-border/50 space-y-2">
                 {user ? (
                   <>
                     <div className="flex justify-center mb-2">
                       <NotificationBell />
                     </div>
                     <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                       <Button variant="outline" size="sm" className="w-full justify-start hover:animate-wiggle">
                         <User className="h-4 w-4 mr-2" />
                         Dashboard
                       </Button>
                     </Link>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={() => {
                         signOut();
                         setMobileMenuOpen(false);
                       }}
                       className="w-full justify-start hover:animate-shake"
                     >
                       <LogOut className="h-4 w-4 mr-2" />
                       Logout
                     </Button>
                   </>
                 ) : (
                   <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                     <Button variant="gaming" size="sm" className="w-full hover:animate-heartbeat">
                       Login
                     </Button>
                   </Link>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;