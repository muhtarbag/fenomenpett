import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Helmet } from "react-helmet";

type BlogPost = Tables<"blog_posts">;

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
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

  return (
    <>
      <Helmet>
        <title>FenomenPet Blog - Sokak Hayvanları Hikayeleri ve Yardım İpuçları</title>
        <meta name="description" content="Sokak hayvanlarına yardım hikayeleri, besleme ipuçları ve FenomenPet topluluğunun paylaşımları. Siz de katkıda bulunun!" />
        <meta name="keywords" content="sokak hayvanları blog, hayvan yardımı, fenomenpet blog, pati dostu hikayeler" />
        <link rel="canonical" href="https://fenomenpet.com/blog" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">FenomenPet Blog</h1>
        <div className="grid gap-8 max-w-3xl mx-auto">
          {posts?.map((post: BlogPost) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <time className="text-sm text-gray-500" dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString("tr-TR")}
              </time>
            </article>
          ))}
          {(!posts || posts.length === 0) && (
            <div className="text-center text-gray-500">
              Henüz blog yazısı bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;