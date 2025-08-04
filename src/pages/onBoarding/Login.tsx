import { useEffect, useRef, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useLocation, useNavigate } from "react-router";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { LoginUser } from "../../containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";
import { errorAlert } from "../../components/alerts/ToastService";
import { useAuthStore } from "../../stores/useAuthStore";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  // const [isGoogleLoading, setisGoogleLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get("message");
  const state = queryParams.get("state");
const { setUser } = useAuthStore();
  useEffect(() => {
    if (state === "notAuthenticated" && message) {
      errorAlert("Error", decodeURIComponent(message));
      const timer = setTimeout(() => {
        navigate("/login", { replace: true, state: null });
      }, 2000); // Give time for user to read the notification
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [state, message]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) {
      if (emailError && emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    if (passwordError) {
      if (passwordError && passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }
    const redirect=Storage?.getItem("redirect")|| null;
    try {
      setisLoading(true);
      const res = await LoginUser(email, password);
      setUser(res);
      console.log(res, "Login Response");
      if (redirect) {
        Storage.removeItem("redirect");
        navigate(redirect);
        return;
      }else navigate('/');
    } catch (error) {
      console.log(error);
      setisLoading(false);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <LoginLayout>
      <form
        className="grid mt-[2vh] md:mt-[2vh] gap-[3vh] h-fit w-full "
        onSubmit={handleSignIn}
      >
        <div className="grid gap-[10px] text-center md:text-left">
          <h1 className=" text-3xl font-semibold">Login to your account</h1>
          <p className=" text-lightGrey font-normal text-sm">
            Let’s sign in quickly to continue to your account.
          </p>
        </div>
        <div className="grid w-full gap-[12px] mt-4">
          <DefaultInput
            id="loginEmail"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            style="!w-full"
            value={email}
            setValue={setemail}
            required
            ref={emailRef}
            setExternalError={setEmailError}
            // setExternalError={setEmailError}
          />
          <div>
            <DefaultInput
              id="loginPassword"
              label="Password"
              placeholder="********"
              type="password"
              style="!w-full"
              value={password}
              setValue={setpassword}
              required
              ref={passwordRef}
              setExternalError={setPasswordError}
              classname="!mb-0 "
            />
            <div className="text-right m-0 ">
              <a
                className="text-[14px] text-red cursor-pointer hover:underline"
                onClick={() => navigate("/forgot-password")}
                role="link"
                tabIndex={0}
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-[10px]">
          <DefaultButton
            variant="primary"
            size="normal"
            type="default"
            className="w-full"
            onClick={() => handleSignIn}
            submitType="submit"
            isLoading={isLoading}
          >
            Sign In
          </DefaultButton>
          {/* <DefaultButton
            variant="secondary"
            size="normal"
            className="w-full"
            icon={<FcGoogle />}
            type="icon-left"
            onClick={() => handleLoginWithGoogle()}
            isLoading={isGoogleLoading}
          >
            Sign in with Google
          </DefaultButton> */}
        </div>
        <p className="text-[#A7A5A6]  text-[14px]  mt-[0.5vh] text-center">
          Don’t have an account?{"  "}
          <span
            className="text-red cursor-pointer hover:text-deepRed"
            onClick={() => navigate("/signup")}
            role="link"
            tabIndex={0}
          >
            Sign up
          </span>
        </p>
      </form>
    </LoginLayout>
  );
};

export default Login;
