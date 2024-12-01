import { Share, Instagram, Facebook, Twitter, Link as LinkIcon, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface SocialShareProps {
  url: string;
}

const SocialShare = ({ url }: SocialShareProps) => {
  const { toast } = useToast();
  
  const shareData = {
    title: 'Fenomenpet - Sokak Hayvanlarına Yardım',
    text: 'Sokak hayvanlarına yardım etmek için siz de katılın!',
    url: url
  };

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(shareData.text);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, so we'll open Instagram
        window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
        return;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            description: "Bağlantı kopyalandı!",
            duration: 2000,
          });
        } catch (err) {
          console.error('Failed to copy:', err);
          toast({
            variant: "destructive",
            description: "Bağlantı kopyalanamadı",
            duration: 2000,
          });
        }
        return;
      default:
        if (navigator.share) {
          try {
            await navigator.share(shareData);
            return;
          } catch (err) {
            console.log('Error sharing:', err);
          }
        }
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
          <Share size={20} />
          <span>Paylaş</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('instagram')} className="cursor-pointer">
          <Instagram className="mr-2 h-4 w-4" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
          <LinkIcon className="mr-2 h-4 w-4" />
          Linki Kopyala
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;