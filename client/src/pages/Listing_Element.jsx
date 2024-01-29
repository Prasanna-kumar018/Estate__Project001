import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
const Listing_Element = ({
  index,
  image,
  estatename,
  id,
  deletelisting,
  deleteload,
}) => {
  let navigate = useNavigate();
  return (
    <div
      key={index}
      className="flex  p-2 shadow-popover-foreground shadow-lg items-center justify-between"
    >
      <Link to={`/listing/${id}`}>
        <img src={image} className="h-20 aspect-video  mr-3 " alt="No-image" />
      </Link>
      <Link
        to={`/listing/${id}`}
        className="text-left ml-2 font-bold w-[250px] line-clamp-2"
      >
        <p className="underline ">{estatename}</p>
      </Link>
      <div className="flex flex-col gap-2 ml-3">
        <Button
          type="button"
          className="bg-red-700 hover:bg-red-500 hover:text-stone-700 "
          onClick={() => {
            deletelisting(id);
          }}
        >
          {deleteload && <LoaderIcon className="animate-spin" />}
          DELETE
        </Button>
        <Button
          type="button"
          className="bg-blue-800 hover:bg-blue-600 "
          onClick={() => {
            navigate(`/edit_listing/${id}`);
          }}
        >
          {" "}
          EDIT
        </Button>
      </div>
    </div>
  );
};

export default Listing_Element;
