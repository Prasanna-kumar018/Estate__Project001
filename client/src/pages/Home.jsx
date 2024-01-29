import React from "react";
import { Link } from "react-router-dom";
import ListingItem from "@/components/ListingItem";
import { ChevronRight, LoaderIcon, Mail } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const Home = () => {
  let [offerlisting, showoffer] = React.useState([]);
  let [rentlisting, showrent] = React.useState([]);
  let [salelisting, showsale] = React.useState([]);
  let next = React.useRef(null);
  let prev = React.useRef(null);
  let [loading, setloading] = React.useState(false);
  let [error, seterror] = React.useState("");
  React.useEffect(() => {
    setloading(true);
    seterror('');
    async function fetchoffer() {
      try {
        let d1 = await fetch("/api/listing/get?offer=true&limit=4");
        let json = await d1.json();
        showoffer(json);
        fetchrent();
      } catch (err) {
        setloading(false);
        seterror(err.message);
        console.log(err);
      }
    }
    fetchoffer();
    async function fetchrent() {
      try {
        let d2 = await fetch("/api/listing/get?type=rent&limit=4");
        let json2 = await d2.json();
        showrent(json2);
        fetchsale();
      } catch (err) {
        setloading(false);
        seterror(err.message);
        console.log(err);
      }
    }
    async function fetchsale() {
      try {
        let d3 = await fetch("/api/listing/get?type=sell&limit=4");
        let json3 = await d3.json();
        showsale(json3);
        setloading(false);
      } catch (err) {
        setloading(false);
        seterror(err.message);
        console.log(err);
      }
    }
  }, []);
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  if (loading)
  {
     return (
       <h1 className="text-green-700 tracking-wider text-center text-lg font-bold my-3">
         Loading....
       </h1>
     );
  }
  else if (error.length > 0)
  {
     return (
       <h1 className="text-red-700 tracking-wider text-center text-lg font-bold my-3">
         {error}
       </h1>
     );
    }
  return (
    <div className="">
      <div className="min-h-[450px] max-md:min-h-[300px] p-12 lg:p-24" id="top">
        <div className="text-6xl max-md:text-4xl font-bold text-gray-800">
          <span>Find your next </span>
          <span className="text-slate-500">perfect</span>
          <br />
          <span>place with ease</span>
        </div>
        <p className="mt-10 text-slate-500 flex flex-wrap">
          <p>
            Kala Estate will help you find your home fast, easy and comfortable.
            Our expert support are always available.
          </p>
        </p>
        <Link to={"/search"}>
          <p className="mt-5 font-bold text-blue-700 ">Let's Start now...</p>
        </Link>
      </div>
      <div className="relative max-md:mb-10 mb-16">
        <Carousel
          plugins={[plugin.current]}
          className="w-full "
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="max-md:h-[300px] h-[500px] p-0">
            {offerlisting &&
              offerlisting.length > 0 &&
              offerlisting.map((image) => {
                return (
                  <CarouselItem key={image.imageUrls[0]}>
                    <img
                      src={image.imageUrls[0]}
                      className="w-screen h-full "
                      alt="image"
                    />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselNext ref={next} className="hidden" />
          <CarouselPrevious ref={prev} className="hidden" />
        </Carousel>
        <ChevronRight
          id="colorchange"
          className="absolute top-1/2 right-0 size-20 animate-in  -translate-y-1/2"
          onClick={() => {
            next.current.click();
          }}
        />
        <ChevronLeft
          id="colorchange"
          className="absolute top-1/2 left-0 size-20 animate-in -translate-y-1/2"
          onClick={() => {
            prev.current.click();
          }}
        />
      </div>
      <div className=" max-sm:px-auto max-lg:p-12 px-24">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-600">Recent offers</h1>
          <Link to={"/search?offer=true"}>
            <p className="my-3 text-lg font-bold text-blue-700 hover:underline">
              Show more offers
            </p>
          </Link>
          <div className="flex flex-wrap gap-12">
            {offerlisting &&
              offerlisting.length > 0 &&
              offerlisting.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>
        </div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-600">
            Recent places for rent
          </h1>
          <Link to={"/search?type=rent"}>
            <p className="my-3 text-lg font-bold text-blue-700 hover:underline">
              Show more places for rent
            </p>
          </Link>
          <div className="flex flex-wrap gap-12">
            {rentlisting &&
              rentlisting.length > 0 &&
              rentlisting.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>
        </div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-600">
            Recent places for sale
          </h1>
          <Link to={"/search?type=sell"}>
            <p className="my-3 text-lg font-bold text-blue-700 hover:underline">
              Show more places for sale
            </p>
          </Link>
          <div className="flex flex-wrap gap-12">
            {salelisting &&
              salelisting.length > 0 &&
              salelisting.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
