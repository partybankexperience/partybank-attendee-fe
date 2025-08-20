import { useEffect, useRef, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useLocation, useNavigate } from "react-router";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { emailExists, initiateOtp, LoginUser } from "../../containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";
import { errorAlert } from "../../components/alerts/ToastService";
import { useAuthStore } from "../../stores/useAuthStore";
import { useTicketStore } from "../../stores/cartStore";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { StyledTimerCard, usePaymentTimer } from "../../components/helpers/timer";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [emailExist, setemailExist] = useState(false);
  const [buttonClicked, setbuttonClicked] = useState(false);
  // const [isGoogleLoading, setisGoogleLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get("message");
  const state = queryParams.get("state");
  const { setUser,checkoutStage,setCheckoutStage,setEmail, markOtpSent } = useAuthStore();
  const { selectedTicketId, quantity,selectedTicketName,price,reset } = useTicketStore();
   const [endTime, setEndTime] = useState<Date | null>(null);
  const { cancelCheckout } = useCheckoutStore();
  const [timersInitialized, setTimersInitialized] = useState(false);
    const eventName=Storage.getItem('eventName')
    const timeLeft = usePaymentTimer(endTime, () => {
      setEndTime(null);
    });
  
    const startTimer = (durationInMinutes: number) => {
      // Calculate the end time based on the input duration
      const targetTime = new Date(new Date().getTime() + durationInMinutes * 60 * 1000);
      setEndTime(targetTime);
    };
    // Use a ref to store the interval ID
    const timerRef = useRef<any>(null);

    useEffect(() => {
      if (state === "notAuthenticated" && message) {
        errorAlert("Error", decodeURIComponent(message));
        const timer = setTimeout(() => {
          navigate("/login", { replace: true, state: null });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [state, message, navigate]);
  
    // Clean up the countdown timer when the component unmounts
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, []);
  console.log(checkoutStage, "Checkout Stage");
    const redirect = Storage?.getItem("redirectPath") || null;
  
    const checkIfEmailExists = async (e: React.FormEvent) => {
        e.preventDefault();
        if (emailError) {
          emailRef.current?.focus();
          return;
        }
      
        setisLoading(true);
        setbuttonClicked(true); // Show countdown div immediately
      
        try {
          const res = await emailExists(email);
          setemailExist(res.exists);
      
          if (!res.exists) {
            // Send OTP
            await initiateOtp(email);
      
            // Store email + stage
            setEmail(email);
            markOtpSent();
            if (checkoutStage === "eventDetails") {
              setCheckoutStage("login");
            }
      
            // Prepare countdown value
            setCountdown(10);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setisLoading(false);
      
          // 🔑 Start countdown *only after loading ends and OTP was sent*
          if (!emailExist) {
            timerRef.current = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timerRef.current);
                  navigate("/email-verification", { state: { email } });
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }
      };
      
  
    const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      if (emailError) {
        if (emailRef.current) {
          emailRef.current.focus();
        }
        return;
      }
      if (passwordError) {
        if (passwordRef.current) {
          passwordRef.current.focus();
        }
        return;
      }
      try {
        setisLoading(true);
        const res = await LoginUser(email, password);
        setUser(res);
        if(checkoutStage==='eventDetails'){
        // Storage.setItem("checkoutStage", "signUp");
        setCheckoutStage('signUp');
        if (redirect && checkoutStage==='eventDetails') {
          Storage.removeItem("redirectPath");
          navigate(redirect);
        } 
        }else navigate(-1);
      } catch (error) {
        console.error(error);
        setisLoading(false);
      } finally {
        setisLoading(false);
      }
    };
  
    const handleLogin = (e: any) => {
      e.preventDefault(); // Add this here to prevent default form behavior
      if (emailExist && buttonClicked) {
        handleSignIn(e);
      } else {
        checkIfEmailExists(e);
      }
    };
    useEffect(() => {
        if( checkoutStage === 'emailVerification' && selectedTicketId) {
          startTimer(10); // Start the timer with 10 minutes
          setTimersInitialized(true);
        }
      }, [checkoutStage])
      useEffect(() => {
        if (!timersInitialized) return; // Prevent running before timers are set
        if (timeLeft === 0&& endTime === null) {
          // Cancel the checkout process
          cancelCheckout()
          // Remove the cart data from local storage
          reset()
          // Timer expired, redirect to the event details page
          navigate(`/event-details/${eventName}`);
    
        }
      }, [timeLeft, eventName,timersInitialized,endTime]);

      return (
    <LoginLayout>
      <form
        className="grid mt-[2vh] md:mt-[2vh] gap-[3vh] h-fit w-full "
        onSubmit={handleLogin}
      >
        <div className="grid gap-[10px] text-center md:text-left">
          <h1 className=" text-3xl font-semibold">Login to your account</h1>
          <p className=" text-lightGrey font-normal text-sm">
            Please enter your email to get started!
          </p>
          {/* Ticket Summary */}
          {selectedTicketId && checkoutStage==='eventDetails' && (
          <div className="bg-faintPink p-4 rounded-xl mb-4  relative">
            <StyledTimerCard timeLeft={timeLeft} />
            <div className="flex justify-between items-center">
              <p className="font-semibold">{selectedTicketName}</p>
              <p className="text-sm text-darkGrey">
                {quantity} × {price?.toLocaleString()}
              </p>
            </div>
            {/* <span className="font-bold text-red">{ticket.price}</span> */}
            <p className="text-softRed text-[14px] text-left">
              You're almost done, just log in to complete your purchase.
            </p>
          </div>
          )}
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
           
          {buttonClicked &&
            (emailExist ? (
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
                  classname="!mb-0"
                />
                <div className="text-right m-0">
                  <a
                    className="text-[14px] text-red cursor-pointer hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            ) : !isLoading && (
              <div className="text-center text-red text-[14px] animate-fadeIn">
                <p>We couldn’t find an account with that email.</p>
                <p>
                  Please verify your email — we’ll take you there in{" "}
                  <strong>{countdown}</strong> seconds...
                </p>
                <button
                  className="mt-2 text-blue underline"
                  onClick={() => navigate("/email-verification", { state: { email } })}
                >
                  Go Now
                </button>
              </div>
            ))}
        </div>
        <div className="mt-4 grid gap-[10px]">
          <DefaultButton
            variant="primary"
            size="normal"
            type="default"
            className="w-full"
            onClick={() => handleLogin}
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
        {/* no need for this cause you need to verify the user email first */}
        {/* <p className="text-[#A7A5A6]  text-[14px]  mt-[0.5vh] text-center">
          Don’t have an account?{"  "}
          <span
            className="text-red cursor-pointer hover:text-deepRed"
            onClick={() => navigate("/signup")}
            role="link"
            tabIndex={0}
          >
            Sign up
          </span>
        </p> */}
      </form>
    </LoginLayout>
  );
};

export default Login;
