import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { user as Sliceuser } from "@/redux/slice/user";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import Listing_Element from "./Listing_Element";
const Profile = () => {
  let [loading, setLoading] = React.useState(false);
  let [error, seterror] = React.useState(false);
  let [errormsg, seterrormsg] = React.useState("");
  let [imgloading, imgsetLoading] = React.useState(false);
  let [imgerror, imgseterror] = React.useState(false);
  let [imgerrormsg, imgseterrormsg] = React.useState("");
  let [deleteloading, deletesetLoading] = React.useState(false);
  let [deleteerror, deleteseterror] = React.useState(false);
  let [deleteerrormsg, deleteseterrormsg] = React.useState("");
  let [showloading, setshowloading] = React.useState(false);
  let [showmsg, setshowmsg] = React.useState("");
  let [deleteload, setdeleteload] = React.useState(false);
  let [deletemsg, setdeletemsg] = React.useState("");
  let [listing, setlisting] = React.useState([]);
  let dispatch = useDispatch();
  let user = useSelector((state) => state.user);
  let [photourl, setphotourl] = React.useState(user.Photourl);
  let [percent, setpercent] = React.useState("");

  let fileref = React.useRef(null);
  let formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be atleast 6 characters",
    }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.Username,
      password: "Password",
      email: user.Email,
    },
  });
  function handleChange(e) {
    imgsetLoading(true);
    imgseterror(false);
    const storage = getStorage();
    const filename = new Date().getTime() + e.target.files[0].name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setpercent(`Upload is ${Math.round(progress)}% done`);
        if (Math.round(progress) === 100) {
          setpercent(`Image Uploaded Successfully`);
        }
      },
      (error) => {
        imgsetLoading(false);
        imgseterrormsg(error.message);
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setphotourl(downloadURL);
          imgsetLoading(false);
          imgseterror(false);
          imgseterrormsg(null);
        });
      }
    );
  }
  async function Submithandler(d) {
    setLoading(true);
    seterror(false);
    let { username, password, email } = d;
    let res = {
      Username: username,
      Password: password,
      Email: email,
      Photourl: photourl,
    };
    if (password === "Password") {
      let { Password, ...rest } = res;
      res = rest;
    }
    let updateData = await fetch(`/api/users/update/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(res),
    });
    let json = await updateData.json();
    console.log(json);
    if (json.title) {
      setLoading(false);
      seterror(true);
      seterrormsg(json.message);
      return;
    }
    setLoading(false);
    dispatch(Sliceuser.actions.setuser(json));
    toast("Data Updated Successfully", {
      description: `created @ ${new Date().toLocaleString()}`,
      action: {
        label: "Close",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }

  async function deleteAccout() {
    deletesetLoading(true);
    deleteseterror(false);
    let json = await fetch(`/api/users/delete/${user._id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (json.title) {
      deletesetLoading(false);
      deleteseterror(true);
      deleteseterrormsg(json.message);
      return;
    }
    deletesetLoading(false);
    dispatch(Sliceuser.actions.deleteuser());
    toast("Account Deleted Successfully", {
      description: `created @ ${new Date().toLocaleString()}`,
      action: {
        label: "Close",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }
  async function handleSignout() {
    await fetch("/api/users/signout", {
      method: "GET",
    });
    dispatch(Sliceuser.actions.deleteuser());
    toast("Signed Out Successfully", {
      description: `created @ ${new Date().toLocaleString()}`,
      action: {
        label: "Close",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }
  async function handlelisting() {
    setshowloading(true);
    setshowmsg("");
    let listing = await fetch("/api/listing/listings/" + user._id);
    let json = await listing.json();
    if (json.title) {
      setshowloading(false);
      setshowmsg(json.message);
      return;
    }
    setshowloading(false);
    setlisting(json);
  }
  async function deletelisting(id) {
    setdeleteload(true);
    setdeletemsg("");
    let deleteData = await fetch(
      `/api/listing/listings/delete/${id.toString()}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    let json = await deleteData.json();
    if (json.title) {
      setdeleteload(false);
      setdeletemsg(json.message);
      return;
    }
    setdeleteload(false);
    let f = listing.filter((lis) => lis._id.toString() !== id);
    setlisting(f);
  }
  return (
    <div className="lg:w-1/3   h-full max-sm:mt-2 max-sm:px-4 mt-1 max-sm:mx-4">
      <h1 className="font-bold text-3xl mt-5 text-center">Profile</h1>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(Submithandler)}>
          <input
            type="file"
            ref={fileref}
            hidden
            onChange={handleChange}
            accept="image/*"
          />
          <div className="mt-4 mb-4">
            <Avatar
              className="mx-auto size-20 cursor-pointer"
              onClick={() => {
                fileref.current.click();
              }}
            >
              <AvatarImage src={photourl} />
              <AvatarFallback className="bg-slate-300 font-semibold text-4xl">
                {user.Username.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          {imgerror && (
            <h1 className="text-red-700 font-bold mt-3 mb-3 text-center">
              {imgerrormsg}
            </h1>
          )}
          {imgloading && (
            <h1 className="mt-3 text-green-700 font-bold text-center">
              {percent}
            </h1>
          )}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className="font-[600] focus-visible:ring-offset-0 text-lg py-6 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="font-[600] focus-visible:ring-offset-0 text-lg py-6 focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Password"
                    className="font-[600] focus-visible:ring-offset-0 text-lg py-6 focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Don{"'"}t want to change your password then type Password
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className=" w-full cursor-pointer text-base "
          >
            {loading && <LoaderIcon className="animate-spin" />}
            {!loading && "UPDATE"}
          </Button>
          <Button
            type="button"
            className=" w-full cursor-pointer text-base bg-green-800 hover:bg-green-600"
          >
            <Link to="/create-listing">CREATE LISTING</Link>
          </Button>
        </form>
        {error && (
          <h1 className="text-red-700 font-bold mt-3 mb-3">{errormsg}</h1>
        )}
        {deleteerror && (
          <h1 className="text-red-700 font-bold mt-3 mb-3">{deleteerrormsg}</h1>
        )}
        <div className="flex gap-2 mt-4 mb-3 text-red-700 max-sm:text-base text-lg font-bold justify-between">
          <Button
            className="cursor-pointer bg-red-700 max-lg:text-sm text-base
             hover:bg-red-500 hover:text-black"
            disabled={deleteloading}
            onClick={() => {
              deleteAccout();
            }}
          >
            {deleteloading && <LoaderIcon className="animate-spin" />}
            DELETE ACCOUNT
          </Button>
          <Button
            className="cursor-pointer bg-red-700 max-lg:text-base text-lg hover:bg-red-500 hover:text-black"
            onClick={() => {
              handleSignout();
            }}
          >
            Sign Out
          </Button>
        </div>
      </Form>
      {showmsg && showmsg.length > 0 && (
        <h1 className="text-red-700 tracking-wider text-center font-bold mt-3 mb-3">
          {showmsg}
        </h1>
      )}
      <div
        onClick={handlelisting}
        disabled={showloading}
        className="mt-1 text-green-500 font-medium text-lg cursor-pointer 
       disabled:opacity-35   mb-7 flex items-center justify-center gap-2"
      >
        {showloading && <LoaderIcon className="animate-spin" />}
        <span>Show listings</span>
      </div>
      <div className="mb-10">
        {deletemsg && deletemsg.length > 0 && (
          <h1 className="text-red-700 tracking-wider text-center font-bold mt-3 mb-3">
            {deletemsg}
          </h1>
        )}
        {listing &&
          listing.length > 0 &&
          listing.map((el, index) => {
            return (
              <Listing_Element
                index={index}
                image={el.imageUrls[0]}
                estatename={el.name}
                id={el._id}
                deletelisting={deletelisting}
                deleteload={deleteload}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Profile;
