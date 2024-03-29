import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import LeftSidebar from "./Left_sidebar";
import MobileNav from "./Mobile_nav";
import useAuthUser from "../hooks/useAuthUser";
import Model from "./Model";
import SuccessfulSigned from "../assets/Successful Registration.svg";
import { ErrorBoundary } from "react-error-boundary";
import errorFallback from "./Error_fallback";
import Loading from "./Loading";
function Layout() {
  const { data: user, isLoading } = useAuthUser();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  if (user)
    return (
      <>
        <Header />
        <main className="flex gap-x-5 lg:gap-x-10  px-4 xl:container xl:mx-auto relative">
          <LeftSidebar /> <MobileNav />
          <section
            className={`flex-1 pb-9 ${
              !pathname.match(/profile/)
                ? "w-full md:w-[calc(60%-1.25rem)] min-[900px]:w-[calc(45%-2.5rem)]"
                : "w-full md:w-[calc(80%-1.25rem)] min-[900px]:w-[calc(80%-1.25rem)]"
            } py-6`}
          >
            <ErrorBoundary fallbackRender={errorFallback}>
              <Outlet />
            </ErrorBoundary>
          </section>
          {!pathname.match(/profile/) && (
            <aside className="side-bar md:w-[calc(20%-1.25rem/2)] min-[900px]:w-[calc(35%-1.25rem)]"></aside>
          )}
        </main>

        {state?.newUser && (
          <Model
            close={() => navigate(pathname)}
            title="you successfully signed up"
          >
            <div className="text-center">
              <img
                width={400}
                height={250}
                className="w-full"
                src={SuccessfulSigned}
                alt="successfully signed up"
              />
            </div>
          </Model>
        )}
      </>
    );
  else if (!user && isLoading) return <Loading />;
  return <Navigate to="/login" state={{ from: pathname }} />;
}
export default Layout;
