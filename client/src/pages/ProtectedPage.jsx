import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedPage = () => {
  let user = useSelector((state) => state.user);
  if (user) {
    return (
      <div className="flex-1 flex justify-center">
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to={"/sign-in"} />;
  }
};

export default ProtectedPage;
