import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LoginLayout from "../../../components/layouts/LoginLayout";
import StepTwo from "./Step2";
import StepThree from "./Step3";
import {
  forgotPasswordConfirmOTP,
  resetPassword,
} from "../../../containers/onBoardingApi";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useTicketStore } from "../../../stores/cartStore";
import { Storage } from "../../../stores/InAppStorage";
import {
  StyledTimerCard,
  usePaymentTimer,
} from "../../../components/helpers/timer";
import { useCancelCheckout } from "../../checkout/CancelCheckout";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkoutStage, email } = useAuthStore();
  const { selectedTicketId, quantity, selectedTicketName, price } =
    useTicketStore();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timersInitialized, setTimersInitialized] = useState(false);
  const eventName = Storage.getItem("eventName");
  const timeLeft = usePaymentTimer(endTime, () => {
    setEndTime(null);
  });
  const { handleCancelCheckout, ModalForceComponent } = useCancelCheckout();
  const startTimer = (durationInMinutes: number) => {
    // Calculate the end time based on the input duration
    const targetTime = new Date(
      new Date().getTime() + durationInMinutes * 60 * 1000
    );
    setEndTime(targetTime);
  };
  // Use a ref to store the interval ID
  useEffect(() => {
    if (checkoutStage === "eventDetails" && selectedTicketId) {
      startTimer(10); // Start the timer with 10 minutes
      setTimersInitialized(true);
    }
  }, [checkoutStage]);
  // Warn on refresh or back
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step !== 1) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePopState = () => {
      if (
        step !== 1 &&
        window.confirm("Are you sure you want to leave this page?")
      ) {
        // setStep(1);
        navigate("/login");
      } else {
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return alert("Enter valid 4-digit OTP.");
    try {
      setIsLoading(true);
      await forgotPasswordConfirmOTP(email, otp);
      setStep(3);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword)
      return alert("Passwords do not match.");
    try {
      setIsLoading(true);
      await resetPassword(email, password, confirmPassword);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (checkoutStage === "eventDetails" && selectedTicketId) {
      startTimer(5); // Start the timer with 10 minutes
      setTimersInitialized(true);
    }
  }, [checkoutStage]);

  useEffect(() => {
    if (!timersInitialized) return; // Prevent running before timers are set
    if (timeLeft === 0 && endTime === null) {
      // Cancel the checkout process
      // cancelCheckout()
      handleCancelCheckout(
        `/event-details/${eventName}`,
        "Session Timed Out",
        "Your ticket hold has expired. Please restart the booking process."
      );
    }
  }, [timeLeft, eventName, timersInitialized, endTime]);
  return (
    <LoginLayout>
      {/* <div className="grid gap-[10px] text-center md:text-left mt-[2vh] md:mt-[4vh]">
        <h1 className="text-black text-3xl font-semibold">Reset Password</h1>
        <p className="text-lightGrey font-normal text-sm">Enter your new password below.</p>
      </div> */}
      {/* Ticket Summary */}
      {ModalForceComponent}
      {selectedTicketId && checkoutStage === "eventDetails" && (
        <div className="bg-faintPink p-4 rounded-xl mb-4  relative">
          <StyledTimerCard timeLeft={timeLeft} />
          <div className="flex justify-between items-center">
            <p className="font-semibold">{selectedTicketName}</p>
            <p className="text-sm text-darkGrey">
              {quantity} × {price ? price.toLocaleString() : "Free"}{" "}
            </p>
          </div>
          {/* <span className="font-bold text-red">{ticket.price}</span> */}
          <p className="text-softRed text-[14px] text-left">
            You're almost done, just reset your password and login to complete
            your purchase.
          </p>
        </div>
      )}
      {/* {step === 1 && (
        <StepOne
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
          onSubmit={handleStep1Submit}
          isLoading={isLoading}
        />
      )} */}
      {step === 1 && (
        <StepTwo
          email={email}
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleStep2Submit}
          isLoading={isLoading}
        />
      )}
      {step === 3 && (
        <StepThree
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleStep3Submit}
          isLoading={isLoading}
        />
      )}
    </LoginLayout>
  );
};

export default ForgotPassword;
