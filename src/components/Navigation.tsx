import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
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
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-gradient-primary flex items-center justify-center animate-glow-pulse">
              <span className="text-primary-foreground font-bold text-sm md:text-lg">P</span>
            </div>
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
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="hover:shadow-glow transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="hover:shadow-glow transition-all duration-300">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="gaming" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="text-xs">
                  <User className="h-3 w-3" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="gaming" size="sm" className="text-xs">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;