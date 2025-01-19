import { supabase } from "@/integrations/supabase/client";

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...', {
      url: supabase.supabaseUrl,
      hasKey: !!supabase.supabaseKey
    });
    
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', {
        error,
        message: error.message,
        details: error.details
      });
      return false;
    }
    
    console.log('Supabase connection test successful:', {
      data,
      status: 'connected'
    });
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
};