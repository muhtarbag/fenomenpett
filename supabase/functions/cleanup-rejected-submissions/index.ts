import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting cleanup of old rejected submissions...')

    // First, get the IDs of rejected submissions older than 90 days
    const { data: oldRejectedSubmissions, error: fetchError } = await supabaseClient
      .from('rejected_submissions')
      .select('id, image_url')
      .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${oldRejectedSubmissions?.length || 0} old rejected submissions to delete`)

    if (oldRejectedSubmissions && oldRejectedSubmissions.length > 0) {
      // Delete the records from the database
      const { error: deleteError } = await supabaseClient
        .from('rejected_submissions')
        .delete()
        .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

      if (deleteError) {
        throw deleteError
      }

      // Delete the associated images from storage
      for (const submission of oldRejectedSubmissions) {
        if (submission.image_url) {
          const imagePath = submission.image_url.split('/').pop()
          if (imagePath) {
            const { error: storageError } = await supabaseClient
              .storage
              .from('submissions')
              .remove([imagePath])

            if (storageError) {
              console.error(`Failed to delete image for submission ${submission.id}:`, storageError)
            }
          }
        }
      }

      console.log('Successfully cleaned up old rejected submissions')
      return new Response(
        JSON.stringify({ 
          message: 'Cleanup completed', 
          deletedCount: oldRejectedSubmissions.length 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'No old submissions to delete' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error during cleanup:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})