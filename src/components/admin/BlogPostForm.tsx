import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const BlogPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([{ title, content }]);

      if (error) throw error;

      toast.success("Blog yazısı başarıyla eklendi");
      setTitle("");
      setContent("");
    } catch (error: any) {
      toast.error("Blog yazısı eklenirken bir hata oluştu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="title">Başlık</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog yazısı başlığı"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Blog yazısı içeriği"
          rows={10}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Ekleniyor..." : "Blog Yazısı Ekle"}
      </Button>
    </form>
  );
};