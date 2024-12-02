import { Pencil, Trash2 } from "lucide-react";
import { BlogPost } from "./types";
import { Button } from "@/components/ui/button";
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

interface BlogPostItemProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: number) => void;
}

export const BlogPostItem = ({ post, onEdit, onDelete }: BlogPostItemProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
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
            onClick={() => onEdit(post)}
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
                  onClick={() => onDelete(post.id)}
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
  );
};