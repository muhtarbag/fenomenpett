import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Banner from "@/components/Banner";
import PostGrid from "@/components/PostGrid";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["approved-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
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
          <div className="text-center mb-8">
            <a href="https://linkany.pro/fenomenbet" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-lg">
                Fenomenbet Giriş
              </Button>
            </a>
          </div>
          
          <PostGrid posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default Index;