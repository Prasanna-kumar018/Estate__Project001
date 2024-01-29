import React from "react";
import IconSearch from "./IconSearch";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Header = () => {
  let user = useSelector((state) => state.user);
  let [searchTerm, setsearchTerm] = React.useState('');
  let navigate = useNavigate();
  function handleSearch(e)
  {
    e.preventDefault();
    let url = new URLSearchParams(location.search);
    url.set("searchTerm", searchTerm);
    let str = url.toString();
    navigate(`/search?${str}`);
  }
  React.useEffect(() =>
  {
    let url = new URLSearchParams(location.search);
    let search = url.get('searchTerm');
    setsearchTerm(search);
  },[location.search]);
  return (
    <section className="bg-slate-200 shadow-md p-2.5  px-5  md:10 lg:px-20 whitespace-nowrap">
      <div className="flex justify-between space-x-3">
        <h1 className="font-bold  text-md sm:text-xl flex  my-auto">
        <Link to={'/'}>
          <span className="text-slate-500">KALA&nbsp;</span>
          <span className="text-slate-700"> ESTATE</span>
        </Link>
        </h1>
        <form onSubmit={handleSearch} className="bg-slate-100 rounded-lg flex  flex-row max-sm:p-3 max-sm:min-w-[60px] min-w-[300px]">
          <input
            type="text"
            onChange={(e) => {
              setsearchTerm(e.target.value);
            }}
            value={searchTerm || ''}
            placeholder=" Search..."
            className="focus:outline-none sm:p-2.5  flex-1 bg-transparent w-full "
          />
          <span className=" flex items-center aspect-square h-full  justify-center  box-content ">
            <IconSearch className="size-6 " onClick={handleSearch} />
          </span>
        </form>

        <div className="flex my-auto flex-nowrap">
          <nav className="flex gap-5 box items-center">
            <a href="/" className="max-md:hidden block">
              Home
            </a>
            <a href="/about" className="max-md:hidden block">
              About
            </a>
            {!user && <a href="/sign-in">Sign In</a>}
            {user && (
              <a href="/profile">
                <Avatar>
                  <AvatarImage src={user.Photourl} />
                  <AvatarFallback className="font-semibold text-xl">
                    {user.Username.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </a>
            )}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Header;
