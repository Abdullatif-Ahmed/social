import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { USER } from "../types";
import useAuthUser from "../hooks/useAuthUser";

const email_regx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const pass_regx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#]).{7,20}$/;
function SignUp() {
  const [firstName, setFirstName] = useState<string>("");
  const [firstNameFocusRemoved, setFirstNameFocusRemoved] =
    useState<boolean>(false);

  const [lastName, setLastName] = useState<string>("");
  const [lastNameFocusRemoved, setlastNameFocusRemoved] =
    useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [emailFocusRemoved, setEmailFocusRemoved] = useState<boolean>(false);

  const [birthday, setBirthday] = useState<string>("");
  const [birthdayFocusRemoved, setBirthdayFocusRemoved] =
    useState<boolean>(false);

  const [gender, setGender] = useState<string>("male");

  const [pass, setPass] = useState<string>("");
  const [validPass, setValidPass] = useState<boolean>(false);
  const [passFocusRemoved, setPassFocusRemoved] = useState<boolean>(false);

  const [rPass, setRpass] = useState<string>("");
  const [vaildRPass, setValidRPass] = useState<boolean>(false);
  const [rPassFocusRemoved, setrPassFocusRemoved] = useState<boolean>(false);
  const [errorM, setErrorM] = useState<string>("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const { refetch } = useAuthUser();
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    setValidEmail(email_regx.test(email.trim()));
  }, [email]);
  useEffect(() => {
    setValidPass(pass_regx.test(pass.trim()));
    setValidRPass(pass === rPass);
  }, [pass, rPass]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      firstName &&
      lastName &&
      email_regx.test(email) &&
      birthday &&
      pass_regx.test(pass) &&
      pass === rPass
    ) {
      setSubmitLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`,
          });
          const user: USER = {
            displayName: `${firstName} ${lastName}`,
            id: auth.currentUser.uid,
            photoURL: "",
            gender: gender,
            birthday: birthday,
            profileBg: "",
            bio: "",
            followings: [],
            followers: 0,
            themeMode: "system",
          };
          await setDoc(doc(db, "users", auth.currentUser?.uid), user);
        }
        refetch();
        navigate("/register", { state: { from: state?.from, newUser: true } });
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          setErrorM(error.message);
        } else {
          setErrorM("Registration Failed");
        }
        errorRef.current!.focus();
        setSubmitLoading(false);
      }
    } else {
      setErrorM("fix the errors");
      errorRef.current?.focus();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-x-3 gap-y-2">
      <p
        ref={errorRef}
        className={`error-msg ${!errorM ? "sr-only" : "w-full"}`}
        aria-live="assertive"
      >
        {errorM}
      </p>

      <div className="flex flex-col w-full min-[450px]:w-[calc(50%-10px)]">
        <label
          htmlFor="firstName"
          className="capitalize text-[15px] font-normal mb-1"
        >
          first name:
        </label>
        <input
          type="text"
          autoComplete="off"
          id="firstName"
          autoFocus
          className={`inp ${
            (errorM && !firstName) || (!firstName && firstNameFocusRemoved)
              ? "error"
              : ""
          }`}
          placeholder="type your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onFocus={() => setFirstNameFocusRemoved(false)}
          onBlur={() => setFirstNameFocusRemoved(true)}
          aria-describedby="firstName-er"
        />
        <p
          id="firstName-er"
          className={`error-msg mt-1 sr-only ${
            !firstName && errorM && "not-sr-only px-2"
          }`}
        >
          add your first name
        </p>
      </div>
      <div className="flex flex-col w-full min-[450px]:w-[calc(50%-10px)]">
        <label
          htmlFor="lastName"
          className="capitalize text-[15px] font-normal mb-1"
        >
          last name:
        </label>
        <input
          type="text"
          autoComplete="off"
          id="lastName"
          className={`inp ${
            (!lastName && lastNameFocusRemoved) || (errorM && !lastName)
              ? "error"
              : ""
          }`}
          placeholder="type your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onFocus={() => setlastNameFocusRemoved(false)}
          onBlur={() => setlastNameFocusRemoved(true)}
          aria-describedby="lastName-er"
        />
        <p
          id="lastName-er"
          className={`error-msg mt-1 sr-only ${
            !lastName && errorM && "not-sr-only px-2"
          }`}
        >
          add your last name
        </p>
      </div>
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
          className={`inp ${
            (!validEmail && errorM) || (!email && emailFocusRemoved)
              ? "error"
              : ""
          }`}
          placeholder="type your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocusRemoved(false)}
          onBlur={() => setEmailFocusRemoved(true)}
          aria-describedby="email-er"
        />
        <p
          id="email-er"
          className={`error-msg mt-1 sr-only ${
            !validEmail && errorM && "not-sr-only px-2"
          }`}
        >
          {!validEmail ? "must be a vaild email" : "add your email"}
        </p>
      </div>

      <div className="flex flex-col w-full min-[450px]:w-[calc(50%-10px)]">
        <label
          htmlFor="birthday"
          className="capitalize text-[15px] font-normal mb-1"
        >
          birthday:
        </label>
        <input
          type="date"
          autoComplete="off"
          id="birthday"
          className={`inp ${
            (!birthday && birthdayFocusRemoved) || (!birthday && errorM)
              ? "error"
              : ""
          }`}
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          onFocus={() => setBirthdayFocusRemoved(false)}
          onBlur={() => setBirthdayFocusRemoved(true)}
          aria-describedby="birthday-er"
        />
        <p
          id="birthday-er"
          className={`error-msg mt-1 sr-only ${
            !birthday && errorM && birthdayFocusRemoved && "not-sr-only px-2"
          }`}
        >
          add your birthday
        </p>
      </div>
      <div className="flex flex-col w-full min-[450px]:w-[calc(50%-10px)] justify-center">
        <label className="capitalize text-[15px] font-normal mb-1">
          gender:
        </label>
        <div className="flex gap-x-8 accent-primary">
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              defaultChecked
              onChange={(e) =>
                e.target.checked === true && setGender(e.target.value)
              }
            />
            <label htmlFor="male" className="capitalize text-sm font-normal">
              male
            </label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              onChange={(e) =>
                e.target.checked === true && setGender(e.target.value)
              }
            />
            <label htmlFor="female" className="capitalize text-sm font-normal">
              female
            </label>
          </div>
        </div>
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
          className={`inp ${
            (!validPass && errorM) || (!pass && passFocusRemoved) ? "error" : ""
          }`}
          placeholder="type your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onFocus={() => setPassFocusRemoved(false)}
          onBlur={() => setPassFocusRemoved(true)}
          aria-describedby="pass-er"
        />
        <p
          id="pass-er"
          className={`error-msg mt-1 sr-only ${
            !validPass && errorM && "not-sr-only px-2"
          }`}
        >
          passward must be 7 to 20 characters. <br />
          must include uppercase and lowercase letters, a number and aspecial
          character. <br />
          Allowed special characters: <span aria-label="at sign">@</span>{" "}
          <span aria-label="dollar sign">$</span>
          <span aria-label="exclamation mark">!</span>{" "}
          <span aria-label="Percent sign">%</span>{" "}
          <span aria-label="question mark">?</span>
          <span aria-label="ampersand mark">&</span>
          <span aria-label="hashtag">#</span>
        </p>
      </div>
      <div className="flex flex-col w-full">
        <label
          htmlFor="rPass"
          className="capitalize text-[15px] font-normal mb-1"
        >
          repeat password:
        </label>
        <input
          type="password"
          autoComplete="off"
          id="rPass"
          className={`inp ${!vaildRPass && rPassFocusRemoved ? "error" : ""}`}
          placeholder="repeat your password"
          value={rPass}
          onChange={(e) => setRpass(e.target.value)}
          onFocus={() => setrPassFocusRemoved(false)}
          onBlur={() => setrPassFocusRemoved(true)}
          aria-describedby="rPass-er"
        />
        <p
          id="rPass-er"
          className={`error-msg mt-1 sr-only ${
            !vaildRPass && rPassFocusRemoved && "not-sr-only px-2"
          }`}
        >
          repeat your passward
        </p>
      </div>
      <div className="flex items-center flex-col w-full mt-3">
        <button
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
            "sign up"
          )}
        </button>
        <Link to="/login" className="text-sm font-light hover:text-primary">
          Already have an account?
        </Link>
      </div>
    </form>
  );
}

export default SignUp;
