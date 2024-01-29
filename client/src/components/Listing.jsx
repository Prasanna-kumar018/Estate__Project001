import React from "react";
import { Button } from "./ui/button";
const Listing = ({ image, index, handleClick }) => {
  return (
      <div
        key={index}
        className="flex  p-2 shadow-popover-foreground shadow-lg items-center justify-between"
      >
        <img src={image} className="h-20 w-1/3 " alt="No-image" />
        <Button
          type="button"
          className="bg-red-700 hover:bg-red-500 hover:text-stone-700 "
          onClick={() => {
            handleClick(index);
          }}
        >
          {" "}
          DELETE
        </Button>
      </div>
  );
};

export default Listing;
