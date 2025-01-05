import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please log in to access this page",
          });
          navigate('/login');
          return;
        }

        if (requireAdmin) {
          const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (!userRole || userRole.role !== 'admin') {
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "You need admin privileges to access this page",
            });
            navigate('/');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Please try logging in again",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAdmin, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;