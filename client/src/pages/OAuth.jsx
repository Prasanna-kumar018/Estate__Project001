import { Button } from "@/components/ui/button";
import React from "react";
import { AwardIcon, LoaderIcon } from "lucide-react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/firebaseconfig";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {user} from "../redux/slice/user";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const auth = getAuth(app);
  let [loading, setLoading] = React.useState(false);
  const [signInWithGoogle, error] = useSignInWithGoogle(auth);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  async function handleClick() {
    setLoading(true);
    try
    {
    let data = await signInWithGoogle();
    let result = await fetch("/api/users/google", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Username: data.user.displayName,
        Email: data.user.email,
        Photourl: data.user.photoURL,
      }),
    });
      let json = await result.json();  
      setLoading(false);
      let date = new Date();
      toast("You have Signed In Successfully", {
        description: `@ ${date.toLocaleString()}`,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      dispatch(user.actions.setuser(json));
      navigate('/');
    }
    catch (err)
    {
      setLoading(false);
       toast("ERROR: "+err.message, {
         description: `@ ${new Date().toLocaleString()}`,
         action: {
           label: "Close",
           onClick: () => {
             toast.dismiss();
           },
         },
       });
    }

  }

  return (
    <Button
      disabled={loading}
      type={"button"}
      className="w-full bg-red-800 hover:bg-red-600"
      onClick={handleClick}
    >
      {!loading && <p>CONTINUE WITH GOOGLE</p>}
      {loading && <LoaderIcon className="animate-spin" />}
    </Button>
  );
};
export default OAuth;