import React from "react";
import { useParams } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, LoaderIcon, Mail } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { MapPin, Bath, Bed, ParkingSquare } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Chair from "@/components/Chair";
import { useSelector } from "react-redux";
const Listing_Page = () => {
  let { list_id } = useParams();
  let next = React.useRef(null);
  let prev = React.useRef(null);
  let [mail, setmail] = React.useState(false);
  let [owner, setownerdata] = React.useState(null);
  let [data, setData] = React.useState(null);
  let [fullloading, setfullloading] = React.useState(false);
  let [fullerror, setfullerror] = React.useState("");
  let [loading, setloading] = React.useState(false);
  let [error, setError] = React.useState("");
  let user = useSelector((state) => state.user);
  let [msg, setmsg] = React.useState("");
  React.useEffect(() => {
    setfullloading(true);
    setfullerror("");
    async function abc() {
      let d = await fetch(`/api/listing/listings/get/${list_id}`);
      let json = await d.json();
      if (json.title) {
        setfullloading(false);
        setfullerror(json.message);
        return;
      }
      setfullloading(false);
      console.log(json);
      setData(json);
    }
    abc();
  }, [list_id]);

  async function getUser() {
    setloading(true);
    setError("");
    let d = await fetch(`/api/listing/get/${data.userRef.toString()}`);
    let json = await d.json();

    if (json.title) {
      setloading(false);
      setError(json.message);
      return;
    }
    setloading(false);
    setownerdata(json);
    setmail(true);
  }
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  if (fullloading) {
    return <h1>Loading....</h1>;
  } else if (fullerror.length > 0) {
    return <h1>{fullerror}</h1>;
  } else if (data) {
    return (
      <main className="flex-1 mt-1">
        <div className="relative">
          <Carousel
            plugins={[plugin.current]}
            className="w-full "
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="max-md:h-[300px] h-[500px] p-0">
              {data &&
                data.imageUrls.length > 0 &&
                data.imageUrls.map((image) => {
                  return (
                    <CarouselItem key={image}>
                      <img
                        src={image}
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
        <div className="mt-8 max-lg:mx-6 lg:mx-52">
          <h1 className="text-3xl font-semibold my-10">
            {data.name} - {`$ ` + data.regularPrice.toLocaleString("en-US")}
            {data.type === "rent" && " /month"}
          </h1>
          <p className="flex  gap-1 text-md mb-3">
            <MapPin className="text-green-700" />
            <span className="text-slate-600">{data.address}</span>
          </p>
          <div className="flex gap-10 mt-5">
            {data.type === "rent" ? (
              <Button className="max-md:min-w-[100px] min-w-[200px] bg-red-800 text-lg hover:bg-red-800">
                For Rent
              </Button>
            ) : (
              <Button className="max-md:min-w-[100px] min-w-[200px] bg-red-800 text-lg hover:bg-red-800">
                {" "}
                For Sale
              </Button>
            )}
            {data.offer && (
              <Button className="min-w-[200px] text-lg bg-green-800 hover:bg-green-800">
                {" "}
                $ {(data.discountPrice).toLocaleString('en-US')}
                {" discount"}
              </Button>
            )}
          </div>
          <p className="mt-3 text-lg">
            <span className="font-semibold">Description : </span>
            {data.description}
          </p>
          <div className="flex gap-5 flex-wrap text-green-800 text-lg items-center font-semibold mt-3 mb-10">
            <span className="flex gap-3 items-center">
              <Bed className="text-lg" />
              <span>
                {data.bedrooms > 1
                  ? `${data.bedrooms} beds`
                  : `${data.bedrooms} bed`}
              </span>
            </span>
            <span className="flex gap-3 items-center">
              <Bath className="text-lg" />
              <span>
                {data.bathrooms > 1
                  ? `${data.bathrooms} Baths`
                  : `${data.bathrooms} Bath`}
              </span>
            </span>
            <span className="flex gap-3 items-center">
              <ParkingSquare className="text-lg" />
              <span>{data.parking === true ? `Parking` : `No Parking`}</span>
            </span>
            <span className="flex gap-3 items-center">
              <Chair className="text-xl" />
              <span>{data.furnished ? `Furnished` : `UnFurnished`}</span>
            </span>
          </div>
          {mail && (
            <>
              <h1 className="my-3">
                Contact
                <span className="mx-1 font-bold">
                  {owner.Username}
                </span> for <span className="mx-1 font-bold">{data.name}</span>
              </h1>
              <textarea
                onChange={(e) => {
                  setmsg(e.target.value);
                }}
                value={msg}
                placeholder="Enter your message here..."
                className="w-full h-24 border-2 border-gray-300 rounded-md p-3"
                rows="10"
              ></textarea>
            </>
          )}
          {error && error.length > 0 && (
            <h1 className="text-red-700 tracking-wider text-center text-lg font-bold my-3">
              {error}
            </h1>
          )}
          {!mail && data.userRef.toString() !== user._id && (
            <Button
              onClick={() => {
                getUser();
              }}
              className="w-full mt-5 text-base mb-5"
            >
              {loading && <LoaderIcon className="animate-spin mr-2" />}
              {"CONTACT LANDLORD"}
            </Button>
          )}
          {mail && (
            <Link
              to={`mailto:${owner.Email}?subject=Regarding ${data.name}&body=${msg}`}
            >
              <Button className="w-full my-10 hover:opacity-90">
                {"SAVE MESSAGE"}
              </Button>
            </Link>
          )}
        </div>
      </main>
    );
  }
};

export default Listing_Page;
