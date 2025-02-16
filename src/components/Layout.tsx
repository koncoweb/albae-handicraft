
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await supabase.auth.signOut();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b bg-background">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Albae Handicraft
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-primary">
              Beranda
            </Link>
            <Link to="/products" className="hover:text-primary">
              Produk
            </Link>
            <Link to="/about" className="hover:text-primary">
              Tentang
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Kontak
            </Link>
            {isAuthenticated && (
              <Link to="/admin/products" className="hover:text-primary">
                Admin Produk
              </Link>
            )}
            <button
              onClick={handleAuthAction}
              className="hover:text-primary"
            >
              {isAuthenticated ? "Keluar" : "Login"}
            </button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-background">
        {children}
      </main>

      <footer className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Albae Handicraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
