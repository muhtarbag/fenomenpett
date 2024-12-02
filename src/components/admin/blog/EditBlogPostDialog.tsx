import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BlogPost } from "./types";

interface EditBlogPostDialogProps {
  post: BlogPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditBlogPostDialog = ({ post, onClose, onSuccess }: EditBlogPostDialogProps) => {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(post);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      console.log('📝 Updating blog post:', editingPost.id);
      
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: editingPost.title,
          content: editingPost.content,
        })
        .eq("id", editingPost.id);

      if (error) {
        console.error('❌ Error updating blog post:', error);
        throw error;
      }

      console.log('✅ Successfully updated blog post:', editingPost.id);
      toast.success("Blog yazısı başarıyla güncellendi");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Error in handleUpdate:', error);
      toast.error("Blog yazısı güncellenirken bir hata oluştu: " + error.message);
    }
  };

  return (
    <AlertDialog open={!!post} onOpenChange={() => onClose()}>
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
                value={editingPost?.title}
                onChange={(e) =>
                  setEditingPost(editingPost ? { ...editingPost, title: e.target.value } : null)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <Textarea
                id="content"
                value={editingPost?.content}
                onChange={(e) =>
                  setEditingPost(editingPost ? { ...editingPost, content: e.target.value } : null)
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
  );
};