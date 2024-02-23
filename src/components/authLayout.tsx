import { Navigate, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";

import useAuthUser from "../hooks/useAuthUser";
import Loading from "./loading";

function AuthLayout() {
  const { pathname, state } = useLocation();
  const { data: user, isLoading } = useAuthUser();
  if (isLoading) return <Loading />;
  if (user)
    return (
      <Navigate
        to={state?.from || "/"}
        state={{ newUser: state?.newUser }}
        replace={true}
      />
    );
  return (
    <div>
      <main className="px-1 py-10">
        <section className="w-full min-[450px]:w-[420px] mx-auto p-5 rounded-md shadow-lg dark:shadow dark:shadow-gray-950  bg-light-bg-secondary dark:bg-dark-bg-secondary ">
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="logo"
              width="85px"
              height="85px"
              className="m-auto"
            />
            <h1 className="uppercase font-semibold text-xl">
              {pathname.slice(1) === "register" ? "sign up" : "sign in"}
            </h1>
          </div>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AuthLayout;
