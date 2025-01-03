import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Albae Handicraft
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Beranda
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900">
              Produk
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">
              Tentang
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">
              Kontak
            </Link>
            <button
              onClick={handleAuthAction}
              className="text-gray-700 hover:text-gray-900"
            >
              {isAuthenticated ? "Keluar" : "Login"}
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Albae Handicraft. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}