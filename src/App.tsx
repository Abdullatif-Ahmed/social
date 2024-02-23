import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
const Layout = lazy(() => import("./components/layout"));
const AuthLayout = lazy(() => import("./components/authLayout"));

const Explore = lazy(() => import("./pages/explore"));
const Profile = lazy(() => import("./pages/profile"));
const Login = lazy(() => import("./pages/login"));
const SignUp = lazy(() => import("./pages/signUp"));
const Liked = lazy(() => import("./pages/liked"));
const Saved = lazy(() => import("./pages/saved"));
const MyFeed = lazy(() => import("./pages/my feed"));
const ProfilePosts = lazy(() => import("./pages/profile posts"));
const ProfileImages = lazy(() => import("./pages/profile images"));

import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "javascript-time-ago";

import useAuthUser from "./hooks/useAuthUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error404 from "./pages/404";
import { ErrorBoundary } from "react-error-boundary";
import errorFallback from "./functions/errorFallback";
import Loading from "./components/loading";

TimeAgo.addDefaultLocale(en);

function App() {
  const { data: user } = useAuthUser();

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(
      user?.themeMode !== "system"
        ? user?.themeMode || "light"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  }, [user?.themeMode]);

  return (
    <ErrorBoundary fallbackRender={errorFallback}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Layout />
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <Explore />
                </Suspense>
              }
            />
            <Route
              path="myfeed"
              element={
                <Suspense fallback={<Loading />}>
                  <MyFeed />
                </Suspense>
              }
            />
            <Route
              path="liked"
              element={
                <Suspense fallback={<Loading />}>
                  <Liked />
                </Suspense>
              }
            />
            <Route
              path="saved"
              element={
                <Suspense fallback={<Loading />}>
                  <Saved />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={<Navigate to={`/profile/${user?.id}`} replace={true} />}
            />
            <Route
              path="profile/:id"
              element={
                <Suspense fallback={<Loading />}>
                  <Profile />
                </Suspense>
              }
            >
              <Route index element={<ProfilePosts />} />
              <Route path="images" element={<ProfileImages />} />
            </Route>
          </Route>

          <Route
            element={
              <Suspense fallback={<Loading />}>
                <AuthLayout />
              </Suspense>
            }
          >
            <Route
              path="/login"
              element={
                <Suspense fallback={<Loading />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/register"
              element={
                <Suspense fallback={<Loading />}>
                  <SignUp />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={
            user?.themeMode === "dark" ||
            (user?.themeMode === "system" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches)
              ? "dark"
              : "light"
          }
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
