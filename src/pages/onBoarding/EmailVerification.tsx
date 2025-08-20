import { useEffect, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout";
import OTPInput from "react-otp-input";
import DefaultButton from "../../components/buttons/DefaultButton";
import { resendOTP, verifyOtp } from "../../containers/onBoardingApi";
import { useAuthStore } from "../../stores/useAuthStore";
import { Storage } from "../../stores/InAppStorage";
import { useNavigate } from "react-router";
import maskEmail from "../../components/helpers/maskedEmail";
import { useTicketStore } from "../../stores/cartStore";
import { useCheckoutStore } from "../../stores/checkoutStore";
import { formatTimer, StyledTimerCard, usePaymentTimer } from "../../components/helpers/timer";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600);
  const [isResendOTPLoading, setisResendOTPLoading] = useState(false);
  const {email, otpSent  } = useAuthStore();
  const navigate=useNavigate()
  // const location=useLocation()
  // const email = location?.state?.email || "";
  const { selectedTicketId, quantity, selectedTicketName,price ,reset} = useTicketStore();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [otpEndTime, setOtpEndTime] = useState<Date | null>(null);
  const [timersInitialized, setTimersInitialized] = useState(false);
  const eventName=Storage.getItem('eventName')
  const checkoutStage = Storage.getItem("checkoutStage") || null;
  const { setCheckoutStage,setVerificationToken } = useAuthStore();
  const { cancelCheckout } = useCheckoutStore();
  const timeLeft = usePaymentTimer(endTime, () => {
      setEndTime(null);
    });
  
    const startTimer = (durationInMinutes: number) => {
      // Calculate the end time based on the input duration
      const targetTime = new Date(new Date().getTime() + durationInMinutes * 60 * 1000);
      setEndTime(targetTime);
    };
    const otpTimeLeft = usePaymentTimer(otpEndTime, () => {
      setOtpEndTime(null);
    });
  
    const otpStartTimer = (durationInMinutes: number) => {
      // Calculate the end time based on the input duration
      const targetTime = new Date(new Date().getTime() + durationInMinutes * 60 * 1000);
      setOtpEndTime(targetTime);
    };
  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const handleResendOtp = async () => {
    try {
      setisResendOTPLoading(true);
        await resendOTP(email,'signup');
        otpStartTimer(5)
      // setTimer(60); // Reset timer
    } catch (error) {
    } finally {
      setisResendOTPLoading(false);
    }
  };
  //   const encryptedEmail = email ? maskEmail(email) : "";
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(otp===''||otp.length<0) return
    try {
        const res=await verifyOtp(otp,email)
        if(selectedTicketId && checkoutStage==='login') setCheckoutStage('emailVerification')
        // setUser(res);
        setVerificationToken(res.accessToken);
        navigate('/signup', { state: { email } })
      console.log(res, "Login Response");
    } catch (error:any) {
        
    }
  }

  useEffect(() => {
    otpStartTimer(5) // Start the OTP timer with 5 minutes
    if (checkoutStage === 'login') {
      startTimer(10); // Start the timer with 10 minutes
      setTimersInitialized(true);
    }
  }, [])


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
  useEffect(() => {
    if (!email && !otpSent) {
      navigate("/login");
    }
  }, [email, otpSent, navigate]);
  return (
    <LoginLayout>
      <form
        className="grid mt-[2vh]  md:mt-[7vh] gap-[7vh] h-fit w-full "
        onSubmit={handleSubmit}
      >
        <p className="text-black text-xl">
        </p>
        <div className="grid gap-[10px] text-center md:text-left">
            <div className="text-center  md:text-left grid gap-[5px]">
          <h1 className=" text-3xl font-semibold">Email Verification</h1>
          
          <p className=" text-lightGrey font-normal text-sm">
          {email
    ? <>Verification code has been sent via email to {maskEmail(email)}</>
    : "No email found. Please go back."}
          </p>
          {/* Ticket Summary */}
      {selectedTicketId && checkoutStage==='login' && (
      <div className="bg-faintPink p-4 rounded-xl  relative">
        <StyledTimerCard timeLeft={timeLeft} />

      <div className="flex justify-between items-center">
              <p className="font-semibold">{selectedTicketName}</p>
              <p className="text-sm text-darkGrey">
                {quantity} × {price?.toLocaleString()}
              </p>
            </div>
            {/* <span className="font-bold text-red">{ticket.price}</span> */}
            <p className="text-softRed text-[14px] text-left">
            You're almost done!! Just one more step remaining
            </p>
          </div>)}
          

            </div>
          <div className="mt-[2rem] grid gap-[18px]">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              inputType="tel"
              renderSeparator={<span className="mx-[28px]"> </span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="border border-gray-300 rounded !w-[3.3rem] !h-[3.3rem] md:!w-[4vw] md:!h-[4vw] !bg-white text-black text-center focus:outline-none focus:border-primary !mx-auto"
                />
              )}
            />
            <button
              type="button"
              onClick={handleResendOtp}
              className={`text-center text-[14px] font-medium cursor-pointer m-auto ${
                otpTimeLeft > 0 ? "text-grey200 cursor-not-allowed" : "text-primary"
              }`}
              disabled={otpTimeLeft > 0 || isResendOTPLoading}
            >
              {otpTimeLeft > 0
                ? `Resend OTP in ${formatTimer(otpTimeLeft)}s`
                : "Resend OTP"}
            </button>
          </div>
        </div>
        <DefaultButton variant="primary"
            size="normal"
            submitType="submit"
            className="w-full">
            Submit
        </DefaultButton>
      </form>
    </LoginLayout>
  );
};

export default EmailVerification;
