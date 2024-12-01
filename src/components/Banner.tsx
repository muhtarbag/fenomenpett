import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Banner = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {isMobile ? (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="relative">
                  <img
                    src="/lovable-uploads/e4fe31df-b619-4ae9-9d59-d6057f321c83.png"
                    alt="FenomenPet Mobil Banner"
                    className="w-full h-auto object-cover rounded-[30px]"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/40 rounded-[30px]">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Sokak Hayvanlarına Destek Olun
                    </h1>
                    <p className="text-white/90 text-sm mb-4">
                      Onların sesi olun, fotoğraflarınızı paylaşın
                    </p>
                    <Button asChild className="bg-secondary hover:bg-secondary/90 text-primary">
                      <Link to="/submit">Fotoğraf Gönder</Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        <div className="relative w-full h-[400px] overflow-hidden rounded-[40px]">
          <img
            src="/lovable-uploads/7138849c-6a14-4a65-8f76-220e6fc26382.png"
            alt="FenomenPet Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/40">
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-up">
              Sokak Hayvanlarına Destek Olun
            </h1>
            <p className="text-white/90 text-xl mb-6 max-w-2xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Onların sesi olun, fotoğraflarınızı paylaşın ve toplumsal farkındalık oluşturun
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-primary animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link to="/submit">Fotoğraf Gönder</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;