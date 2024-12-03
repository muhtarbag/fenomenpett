import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import Banner from "@/components/Banner";
import PostGrid from "@/components/PostGrid";
import Stories from "@/components/Stories";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "sonner";

const POSTS_PER_PAGE = 55;
const MAX_POSTS = 110;

const Index = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  
  // Clear all cache function
  const clearAllCache = () => {
    queryClient.clear();
    toast.success("Önbellek başarıyla temizlendi!");
    // Reload the page to fetch fresh data
    window.location.reload();
  };

  // Set up realtime subscription
  useEffect(() => {
    console.log('🔄 Setting up realtime subscription for approved posts');
    
    const channel = supabase
      .channel('public:submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: 'status=eq.approved'
        },
        (payload) => {
          console.log('📡 Realtime update received:', payload);
          queryClient.invalidateQueries({ queryKey: ["approved-posts"] });
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🔄 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: posts = [], isLoading, error, isFetching } = useQuery({
    queryKey: ["approved-posts", page],
    queryFn: async () => {
      console.log("📡 Fetching approved posts for page:", page);
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('id, username, image_url, comment, likes')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (error) {
          console.error("❌ Supabase error:", error);
          throw error;
        }
        
        console.log("✅ Fetched approved posts:", data?.length);
        return data || [];
      } catch (err) {
        console.error("❌ Failed to fetch posts:", err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FenomenPet",
            "url": "https://fenomenpet.com",
            "description": "Sokak hayvanlarına yardım ederek bonus kazanın! FenomenPet ile sokak hayvanlarına mama ve su vererek fotoğraflarınızı paylaşın.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://fenomenpet.com/check-status?username={search_term}",
              "query-input": "required name=search_term"
            },
            "publisher": {
              "@type": "Organization",
              "name": "FenomenPet",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fenomenpet.com/lovable-uploads/a06650c0-2ee1-42dd-9217-cef8bdd67039.png"
              }
            },
            "sameAs": [
              "https://twitter.com/fenomenpet",
              "https://www.instagram.com/fenomenpet",
              "https://www.facebook.com/fenomenpet"
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Banner />
        
        <div className="bg-primary text-white py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <p className="text-sm md:text-base animate-fade-in text-secondary flex items-center gap-2">
              Fark yaratmamıza yardım edin! Sokak hayvanlarına yardım hikayelerinizi paylaşın. 
              <PawPrint size={24} color="#ffc700" className="inline-block" />
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={clearAllCache}
              className="whitespace-nowrap"
            >
              Önbelleği Temizle
            </Button>
          </div>
        </div>
        
        <div className="py-8">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <div className="text-center mb-8">
                  <a href="https://linkany.pro/fenomenbet" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="/lovable-uploads/317ada8f-0e1c-4d55-b53d-91630923accf.png" 
                      alt="Fenomenbet Giriş" 
                      className="h-12 mx-auto hover:opacity-90 transition-opacity"
                    />
                  </a>
                </div>
                
                <Stories />
                <PostGrid posts={posts} />

                {posts.length === POSTS_PER_PAGE && (
                  <div className="space-y-8 mt-8">
                    <div className="text-center">
                      <Button 
                        onClick={() => setPage(prev => prev + 1)} 
                        variant="outline"
                        disabled={isFetching || page * POSTS_PER_PAGE >= MAX_POSTS}
                        className="animate-fade-in"
                      >
                        {isFetching ? "Yükleniyor..." : "Daha Fazla Göster"}
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <a href="https://linkany.pro/fenomenbet" target="_blank" rel="noopener noreferrer">
                        <img 
                          src="/lovable-uploads/317ada8f-0e1c-4d55-b53d-91630923accf.png" 
                          alt="Fenomenbet Giriş" 
                          className="h-12 mx-auto hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;