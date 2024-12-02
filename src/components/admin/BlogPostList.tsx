import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export const BlogPostList = () => {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      console.log("🔄 Fetching blog posts...");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching blog posts:", error);
        throw error;
      }
      
      console.log("✅ Fetched blog posts:", data);
      return data as BlogPost[];
    },
  });

  const handleDelete = async (id: number) => {
    try {
      console.log("🗑️ Attempting to delete blog post:", id);
      
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Error deleting blog post:", error);
        throw error;
      }

      console.log("✅ Successfully deleted blog post:", id);
      toast.success("Blog yazısı başarıyla silindi");
      
      // Invalidate and refetch the query to update the UI
      await queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      console.error("❌ Delete operation failed:", error);
      toast.error("Blog yazısı silinirken bir hata oluştu: " + error.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      console.log("📝 Updating blog post:", editingPost.id);
      
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: editingPost.title,
          content: editingPost.content,
        })
        .eq("id", editingPost.id);

      if (error) {
        console.error("❌ Error updating blog post:", error);
        throw error;
      }

      console.log("✅ Successfully updated blog post:", editingPost.id);
      toast.success("Blog yazısı başarıyla güncellendi");
      setEditingPost(null);
      
      // Invalidate and refetch the query to update the UI
      await queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } catch (error: any) {
      console.error("❌ Update operation failed:", error);
      toast.error("Blog yazısı güncellenirken bir hata oluştu: " + error.message);
    }
  };

  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEditingPost(post)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Blog Yazısını Sil</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(post.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p className="text-gray-600">{post.content}</p>
        </div>
      ))}

      {editingPost && (
        <AlertDialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <AlertDialogContent>
            <form onSubmit={handleUpdate}>
              <AlertDialogHeader>
                <AlertDialogTitle>Blog Yazısını Düzenle</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">İçerik</Label>
                  <Textarea
                    id="content"
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, content: e.target.value })
                    }
                    rows={10}
                    required
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">
                  İptal
                </AlertDialogCancel>
                <AlertDialogAction type="submit">
                  Güncelle
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};