import { Share, Instagram } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SocialShareProps {
  url: string;
}

const SocialShare = ({ url }: SocialShareProps) => {
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
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, so we'll open Instagram in a new tab
        window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
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
          Instagram'da Paylaş
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          Facebook'ta Paylaş
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          Twitter'da Paylaş
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          WhatsApp'ta Paylaş
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('telegram')}>
          Telegram'da Paylaş
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;