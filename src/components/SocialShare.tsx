import { Facebook, Twitter, Link as LinkIcon, Instagram, MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
}

const SocialShare = ({ url }: SocialShareProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Bağlantı panoya kopyalandı!");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
          <Share2 size={20} />
          <span>Paylaş</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="flex flex-col gap-2">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Facebook size={20} className="text-[#1877F2]" />
            <span>Facebook</span>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Twitter size={20} className="text-[#1DA1F2]" />
            <span>Twitter</span>
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MessageSquare size={20} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Instagram size={20} className="text-[#E4405F]" />
            <span>Instagram</span>
          </a>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LinkIcon size={20} />
            <span>Linki Kopyala</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShare;