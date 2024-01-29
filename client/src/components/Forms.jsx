import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoaderIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import OAuth from "@/pages/OAuth";
const Forms = () => {
  let navigate = useNavigate();
  let [loading, setLoading] = React.useState(false);
  let [error, seterror] = React.useState(false);
  let [errormsg, seterrormsg] = React.useState(null);
  let formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
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
  });
  function onSubmit(data) {
    console.log(data);
    setLoading(true);
    seterror(false);
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Username: data.username,
        Password: data.password,
        Email: data.email,
      }),
    })
      .then((res) => res.json())
      .then((data) =>
      {
        console.log(data);
        if (data.title)
        {
          setLoading(false);
          seterror(true);
          seterrormsg(data.message);
          return;
        }
        setLoading(false);
        let date = new Date();
        toast("You have Signed Up Successfully", {
          description: `created @ ${date.toLocaleString()}`,
          action: {
            label: "Close",
            onClick: ()=> {
              toast.dismiss();
            }
          },
        });
        navigate("/sign-in");
      })
      .catch((err) =>
      {
        setLoading(false);
        seterror(true);
      });
  }
  return (
    <div className="md:w-1/3 h-full max-sm:mt-5 mt-3">
      <h1 className="font-bold text-3xl text-center max-sm:my-6 my-5" >Sign Up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-sm:space-y-5 space-y-4 ">
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className=" w-full cursor-pointer"
          >
            {loading && <LoaderIcon className="animate-spin" />}
            {!loading && "SIGN UP"}
          </Button>
          <OAuth/>
        </form>
        <div className="flex gap-2 mt-2">
          <p>Have an account?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-700 cursor-pointer">Sign In</span>
          </Link>
        </div>
        {error && <h1 className="text-red-700 font-bold mt-2">{errormsg }</h1>}
      </Form>
    </div>
  );
};

export default Forms;
