import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

async function searchPixabayImage(query: string, apiKey: string): Promise<string | null> {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3&safesearch=true`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Get a random image from the top 3 results
      const randomIndex = Math.floor(Math.random() * Math.min(3, data.hits.length));
      return data.hits[randomIndex].previewURL; // Using previewURL for smaller image size
    }
  } catch (error) {
    console.error('Error fetching from Pixabay:', error);
  }
  
  return null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const pixabayApiKey = Deno.env.get('PIXABAY_API_KEY');
    if (!pixabayApiKey) {
      throw new Error('Pixabay API key not found');
    }

    // Get all products
    const { data: products, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*');

    if (fetchError) throw fetchError;
    
    console.log(`Found ${products?.length} products to update`);

    // Update each product's featured image
    for (const product of products || []) {
      // Use category as the search term, fallback to product name
      const searchTerm = product.category || product.nama;
      console.log(`Searching image for product: ${product.nama} using term: ${searchTerm}`);
      
      const imageUrl = await searchPixabayImage(searchTerm, pixabayApiKey);
      
      if (imageUrl) {
        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update({ featured_image: imageUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError);
        } else {
          console.log(`Successfully updated image for product: ${product.nama}`);
        }
      } else {
        console.log(`No image found for product: ${product.nama}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Products updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})