import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import Listing from "@/components/Listing";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Create_listing = () => {
  let [data, setData] = React.useState({
    name: "",
    description: "",
    address: "",

    imageUrls: [],

    type: "rent",

    parking: false,
    furnished: false,
    offer: false,

    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });
  let [fileUrls, setFileUrls] = React.useState([]);
  let [fileloading, filesetloading] = React.useState(false);
  let [fileerror, fileseterror] = React.useState("");
  let [loading, setloading] = React.useState(false);
  let [error, seterror] = React.useState("");
  let [files, setfiles] = React.useState([]);
  let navigate = useNavigate();
  let user = useSelector((state) => state.user);
  async function handleSubmit(e)
  {
     e.preventDefault();
    if (fileUrls.length == 0) {
      seterror("Atleast One image Required to Submit....");
      return;
    }
    if (data.regularPrice < data.discountPrice) {
      seterror("Regular price should be greater than discount price");
      return;
    }
    try {
     
      seterror("");
      setloading(true);
      let result = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imageUrls: fileUrls,
          userRef: user._id,
        }),
      });
      let json = await result.json();
      if (json.title) {
        setloading(false);
        seterror(json.message);
        return;
      }
      setloading(false);
      toast("Listing Created Successfully!", {
        description: `created @ ${new Date().toLocaleString()}`,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      navigate(`/listing/${json._id}`);
    } catch (err) {
      console.log(err.message);
    }
  }
  function handleFileSubmit()
  {
    let length = files.length;
    if (length == 0) {
      filesetloading(false);
      fileseterror("Atleast One Image is Required");
      return;
    }
    if (length + fileUrls.length > 6) {
      filesetloading(false);
      fileseterror("Maximum 6 Images(Each of 2MB) are allowed for Upload...");
      return;
    }
    fileseterror("");
    filesetloading(true);
    let result = [];

    for (let i = 0; i < length; i++) {
      result.push(handleAsync(files[i]));
    }
    Promise.all(result)
      .then((urls) => {
        filesetloading(false);
        setFileUrls(fileUrls.concat(urls));
      })
      .catch((err) => {
        filesetloading(false);
      });
  }
  async function handleAsync(file) {
    return new Promise((res, rej) => {
      const storage = getStorage();
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          filesetloading(false);
          fileseterror("Each uploaded Image should be max of 2MB...");
          console.log(error.message);
          rej("Each uploaded Image should be max of 2MB...");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            res(downloadURL);
          });
          filesetloading(false);
        }
      );
    });
  }
  function handleChange(e) {
    if (e.target.id === "description" || e.target.type === "text") {
      setData({ ...data, [e.target.id]: e.target.value });
    } else if (e.target.type === "number") {
      setData({
        ...data, [e.target.id]: parseInt(e.target.value) === '' ? 0 :
          parseInt(e.target.value)
      });
    } else if (
      e.target.type === "checkbox" &&
      e.target.id !== "sell" &&
      e.target.id !== "rent"
    ) {
      setData({ ...data, [e.target.id]: e.target.checked });
    } else {
      setData({ ...data, type: e.target.id });
    }
  }
  function handlefileChange(e) {
    setfiles(e.target.files);
  }
  function handleClick(index) {
    let f = fileUrls.filter((el, idx) => idx !== index);
    setFileUrls(f);
  }
  return (
    <div className="w-full md:mx-28 max-md:mx-10 mb-10">
      <h1 className="text-center font-bold text-3xl my-5">Create a Listing</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="flex max-sm:flex-col flex-row w-full gap-4">
          <div className="flex-1 space-y-3 mx-5 ">
            <Input
              onChange={handleChange}
              value={data.name}
              placeholder="Name"
              type="text"
              required
              id="name"
              minLength="10"
              maxLength="62"
              className="text-slate-500 font-medium p-3 size-15 w-full text-base"
            ></Input>
            <textarea
              name=""
              className="text-slate-500 rounded-lg p-3 box-border font-medium w-full"
              id="description"
              required
              value={data.description}
              onChange={handleChange}
              placeholder="Description"
              rows="5"
            ></textarea>
            <Input
              onChange={handleChange}
              placeholder="Address"
              className="text-slate-500 p-3 size-15 font-medium w-full text-base"
              type="text"
              value={data.address}
              id="address"
              required
            ></Input>

            <div className="flex flex-row flex-wrap gap-6 ">
              <label htmlFor="sell" className="flex  items-center gap-3 ">
                <span className="font-medium text-xl">Sell</span>
                <Input
                  onChange={handleChange}
                  checked={data.type === "sell"}
                  type="checkbox"
                  id="sell"
                  className="font-medium w-7 text-base"
                />
              </label>

              <label htmlFor="rent" className="flex items-center gap-3">
                <span className="font-medium text-xl">Rent</span>
                <Input
                  onChange={handleChange}
                  type="checkbox"
                  checked={data.type === "rent"}
                  className="font-medium w-7 text-base"
                  id="rent"
                />
              </label>
              <label className="flex items-center gap-3" htmlFor="parking">
                <span className="font-medium text-xl">Parking Spot</span>
                <Input
                  onChange={handleChange}
                  checked={data.parking}
                  className="font-medium w-7 text-base"
                  type="checkbox"
                  id="parking"
                />
              </label>
              <label className="flex items-center gap-3" htmlFor="furnished">
                <span className="font-medium text-xl">Furnished</span>
                <Input
                  onChange={handleChange}
                  checked={data.furnished}
                  className="font-medium w-7 text-base"
                  type="checkbox"
                  id="furnished"
                />
              </label>
              <label className="flex items-center gap-3" htmlFor="offer">
                <span className="font-medium text-xl"> Offer</span>
                <Input
                  onChange={handleChange}
                  checked={data.offer}
                  className="font-medium w-7 text-base"
                  type="checkbox"
                  id="offer"
                />
              </label>
            </div>

            <div className="flex  gap-4">
              <label
                htmlFor="bedrooms"
                className="flex-1 flex items-center gap-3"
              >
                <Input
                  onChange={handleChange}
                  value={data.bedrooms}
                  className="font-medium w-24 max-sm:w-14 text-base"
                  type="number"
                  min="1"
                  max="10"
                  id="bedrooms"
                />
                <span className="font-medium text-xl"> Beds</span>
              </label>
              <label
                htmlFor="bathrooms"
                className="flex-1 flex items-center gap-3"
              >
                <Input
                  onChange={handleChange}
                  value={data.bathrooms}
                  className="font-medium w-24 max-sm:w-14    text-base"
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                />
                <span className="font-medium text-xl"> Baths</span>
              </label>
            </div>
            <label htmlFor="regularPrice" className="flex items-center">
              <Input
                onChange={handleChange}
                value={data.regularPrice}
                className="font-medium w-1/2 text-base"
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
              />
              <span className="font-medium text-base ml-5">
                Regular price
                <p> ($/ Month)</p>
              </span>
            </label>
            {data.offer && (
              <label htmlFor="discountPrice" className="flex items-center">
                <Input
                  onChange={handleChange}
                  value={data.discountPrice}
                  className="font-medium w-1/2 text-base"
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                />
                <span className="font-medium text-base ml-5">
                  Discounted price
                  <p> ($/ Month)</p>
                </span>
              </label>
            )}
          </div>
          <div className="flex-1 space-y-4  mb-3 pl-3">
            <label htmlFor="" className="font-bold text-lg">
              Images:{" "}
            </label>
            <span>Up to 6 Images are allowed for Upload</span>
            <div className="flex gap-5 max-sm:flex-col  text-lg items-center font-bold">
              <Input
                type="file"
                multiple
                onChange={handlefileChange}
                disabled={fileloading}
                className="text-base multiple size-15 w-full "
                accept="image/*"
              ></Input>
              <Button
                type="button"
                className="text-green-700 bg-white 
font-bold text-base  hover:bg-green-200 disabled:opacity-80"
                disabled={fileloading}
                onClick={handleFileSubmit}
              >
                {fileloading && <LoaderIcon className="animate-spin mr-2" />}
                {fileloading && "Uploading...."}
                {!fileloading && "UPLOAD"}
              </Button>
            </div>
            {(
              <h1 className="text-lg tracking-wider text-red-600 font-bold">
                {fileerror}
              </h1>
            )}
            {error && error.length > 0 && (
              <h1 className="text-lg tracking-wider text-red-600 font-bold">
                {error}
              </h1>
            )}
            {fileUrls &&
              !fileloading &&
              fileUrls.map((el, index) => {
                return (
                  <Listing image={el} key={index} index={index} handleClick={handleClick} />
                );
              })}
            <Button
              type="submit"
              disabled={fileloading || loading}
              className="w-full"
            >
              {loading && <LoaderIcon className="animate-spin" />}
              CREATE LISTING
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create_listing;
