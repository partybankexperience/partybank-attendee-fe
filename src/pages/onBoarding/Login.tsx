import { useRef, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout"
import { useLocation, useNavigate } from "react-router";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";

const Login = () => {
    const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  // const [isGoogleLoading, setisGoogleLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const navigate = useNavigate();

//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setisLoading(true);
        // Simulate API call
        setTimeout(() => {
        setisLoading(false);
        // Navigate to the next page or handle success
        navigate('/dashboard');
        }, 2000);
    };
  return (
    <LoginLayout>
        <form className="grid mt-[2vh] md:mt-[2vh] gap-[3vh] h-fit w-full " onSubmit={handleSignIn}>
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
                onClick={() => navigate('/forgot-password')}
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
          Don’t have an account?{'  '}
          <span
            className="text-red cursor-pointer hover:text-deepRed"
            onClick={() => navigate('/signup')}
            role="link"
            tabIndex={0}
          >
            Sign up
          </span>
        </p>
      </form>
    </LoginLayout>
  )
}

export default Login