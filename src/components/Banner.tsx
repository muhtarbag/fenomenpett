import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

const Banner = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <img
                src="/lovable-uploads/e4fe31df-b619-4ae9-9d59-d6057f321c83.png"
                alt="FenomenPet Mobil Banner"
                className="w-full h-auto rounded-[30px]"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="relative w-full h-[400px] overflow-hidden rounded-[40px] mx-auto max-w-7xl px-4">
          <img
            src="/lovable-uploads/7138849c-6a14-4a65-8f76-220e6fc26382.png"
            alt="FenomenPet Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
};

export default Banner;