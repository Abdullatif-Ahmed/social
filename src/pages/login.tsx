import React, { useRef, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ClipLoader } from "react-spinners";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [errorM, setErrorM] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const { refetch } = useAuthUser();
  const { state } = useLocation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      refetch();
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setErrorM(error.code);
      } else {
        setErrorM("Registration Failed");
      }
      errorRef.current!.focus();
      setSubmitLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-y-2">
      <p
        ref={errorRef}
        className={`error-msg ${!errorM ? "sr-only" : "w-full"}`}
        aria-live="assertive"
      >
        {errorM}
      </p>

      <div className="flex flex-col w-full">
        <label
          htmlFor="email"
          className="capitalize text-[15px] font-normal mb-1"
        >
          email:
        </label>
        <input
          type="email"
          autoComplete="off"
          id="email"
          className="inp"
          placeholder="type your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
      </div>

      <div className="flex flex-col w-full">
        <label
          htmlFor="pass"
          className="capitalize text-[15px] font-normal mb-1"
        >
          passward:
        </label>
        <input
          type="password"
          autoComplete="off"
          id="pass"
          className="inp"
          placeholder="type your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          name="password"
        />
      </div>

      <div className="flex items-center flex-col w-full mt-3">
        <button
          aria-label="log in"
          type="submit"
          className={`${
            submitLoading && "flex items-center justify-center"
          } mb-3  btn-submit`}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <ClipLoader
              color="#fff"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "sign in"
          )}
        </button>
        <Link
          to="/register"
          state={{ from: state?.from }}
          className="text-sm font-light hover:text-primary"
        >
          Don't have an account?
        </Link>
      </div>
    </form>
  );
}

export default Login;
