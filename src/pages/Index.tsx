import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Banner from "@/components/Banner";
import PostGrid from "@/components/PostGrid";
import LikeNotifications from "@/components/LikeNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const POSTS_PER_PAGE = 55;
const MAX_POSTS = 110;

const Index = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Gönderiler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in Index component:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Gönderiler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Sayfayı Yenile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      
      <div className="bg-primary text-white py-3 px-4 text-center">
        <p className="text-sm md:text-base animate-fade-in">
          Fark yaratmamıza yardım edin! Sokak hayvanlarına yardım hikayelerinizi paylaşın. 🐾
        </p>
      </div>
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="text-center mb-8">
                <a href="https://linkany.pro/fenomenbet" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/lovable-uploads/317ada8f-0e1c-4d55-b53d-91630923accf.png" 
                    alt="Fenomenbet Giriş" 
                    className="h-12 mx-auto hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
              
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
            
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <LikeNotifications />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;