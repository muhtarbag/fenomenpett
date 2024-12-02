import { BlogPostForm } from "../BlogPostForm";
import { BlogPostList } from "../BlogPostList";

export const BlogTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Yeni Blog Yazısı</h3>
        <BlogPostForm />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Blog Yazıları</h3>
        <BlogPostList />
      </div>
    </div>
  );
};