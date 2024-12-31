import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PIXABAY_API_KEY = Deno.env.get('PIXABAY_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
    
    if (productsError) throw productsError

    // For each product, fetch a relevant image from Pixabay
    for (const product of products) {
      // Use product category or name as search term
      const searchTerm = encodeURIComponent(product.category || product.nama)
      
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${searchTerm}&image_type=photo&per_page=3&min_width=300&min_height=300`
      )
      
      const data = await response.json()
      
      if (data.hits && data.hits.length > 0) {
        // Get a random image from the results
        const randomIndex = Math.floor(Math.random() * Math.min(data.hits.length, 3))
        const image = data.hits[randomIndex]
        
        // Update the product with the new image URL
        // Using previewURL for smaller image size (approximately 150x150)
        const { error: updateError } = await supabase
          .from('products')
          .update({ featured_image: image.previewURL })
          .eq('id', product.id)
        
        if (updateError) throw updateError
      }
    }

    return new Response(
      JSON.stringify({ message: 'Product images updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})