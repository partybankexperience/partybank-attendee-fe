import { useEffect, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout";
import OTPInput from "react-otp-input";
import { formatCountdownTimer } from "../../components/helpers/dateTimeHelpers";
import DefaultButton from "../../components/buttons/DefaultButton";
import { resendOTP, verifyOtp } from "../../containers/onBoardingApi";
import { useAuthStore } from "../../stores/useAuthStore";
import { Storage } from "../../stores/InAppStorage";
import { useLocation, useNavigate } from "react-router";
import maskEmail from "../../components/helpers/maskedEmail";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600);
  const [isResendOTPLoading, setisResendOTPLoading] = useState(false);
  const { setUser } = useAuthStore();
  const redirect=Storage?.getItem("redirect")|| null;
  const navigate=useNavigate()
  const location=useLocation()
  const email = location?.state?.email || "";
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
      setTimer(60); // Reset timer
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
        setUser(res);
        if (redirect) {
                Storage.removeItem("redirect");
                navigate(redirect);
                return;
              }else navigate('/');
      console.log(res, "Login Response");
    } catch (error:any) {
        
    }
  }
  return (
    <LoginLayout>
      <form
        className="grid mt-[2vh]  md:mt-[7vh] gap-[7vh] h-fit w-full "
        onSubmit={handleSubmit}
      >
        <div className="grid gap-[10px] text-center md:text-left">
          <h1 className=" text-3xl font-semibold">Email Verification</h1>
          <p className=" text-lightGrey font-normal text-sm">
            Verification code has been send via email to 
            {maskEmail(email) }
          </p>
          <div className="mt-[3rem] grid gap-[18px]">
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
                timer > 0 ? "text-grey200 cursor-not-allowed" : "text-primary"
              }`}
              disabled={timer > 0 || isResendOTPLoading}
            >
              {timer > 0
                ? `Resend OTP in ${formatCountdownTimer(timer)}s`
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
