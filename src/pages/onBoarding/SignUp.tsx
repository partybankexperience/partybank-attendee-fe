import { useEffect, useRef, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout"
import { useLocation, useNavigate } from "react-router";
import DefaultInput from "../../components/inputs/DefaultInput";
import DefaultButton from "../../components/buttons/DefaultButton";
import RadioButton from "../../components/inputs/RadioButton";
import { SignUpUser } from "../../containers/onBoardingApi";
import { useAuthStore } from "../../stores/useAuthStore";
import { successAlert } from "../../components/alerts/ToastService";
import { useTicketStore } from "../../stores/cartStore";
import { Storage } from "../../stores/InAppStorage";
import { StyledTimerCard, usePaymentTimer } from "../../components/helpers/timer";
import { useCheckoutLeaveGuards } from "../checkout/CancelCheckout";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const [gender, setGender] = useState("")
  const [genderError, setGenderError] = useState(false);
  const genderRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<any>(null);
  const { setUser,setCheckoutStage ,checkoutStage,clearAuth } = useAuthStore();
  const location = useLocation();
  const emailFromLocation = location?.state?.email || "";
  const { selectedTicketId, quantity, selectedTicketName,price } = useTicketStore();
  const redirect = Storage?.getItem("redirectPath") || null;
  const [endTime, setEndTime] = useState<Date | null>(null);
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
  async function handleRegisterUser(e: React.FormEvent) {
    e.preventDefault();
   
    if (firstNameError) {
      if (firstNameRef.current) {
        firstNameRef.current.focus();
      }
      return;
    }
    if (lastNameError) {
      if (lastNameRef.current) {
        lastNameRef.current.focus();
      }
      return;
    }
    if (emailError) {
      if (emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    if (gender === "") {
      setGenderError(true);
      genderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    } else {
      setGenderError(false);
    }
    if (passwordError) {
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }
    
    // Handle registration logic here
    const genderSelection:any=gender!==''?gender:'other'
    try {
      setisLoading(true)
      const res=await SignUpUser(email,password,firstName,lastName,genderSelection)
      setUser(res)
      if(checkoutStage==='emailVerification'){
        // Storage.setItem("checkoutStage", "signUp");
        // setCheckoutStage('signUp')
        if (redirect) {
          setCheckoutStage('checkout');
          Storage.removeItem("redirectPath");
          navigate(redirect);
        } 
        }else navigate('/search');
      // Storage.setItem("checkoutStage", "signUp");
      successAlert("Success",res.message)
      console.log(res, "Sign Up Response");
      // navigate('/checkout',{state:{email}})
    } catch (error) {
      
    } finally {
      setisLoading(false)
    }
    ; }

    useEffect(() => {
      setGenderError(false)
    }, [gender])
    
    useEffect(() => {
      if (emailFromLocation) {
        setemail(emailFromLocation);
      }
    }, [])
    function handleChangeEmail() {
      if (checkoutStage === "emailVerification") {
        // Storage.setItem("checkoutStage", "eventDetails");
        setCheckoutStage('eventDetails')

      }
      clearAuth()
      navigate("/login");
    }
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
        useCheckoutLeaveGuards({ active: true, backTo: `/event-details/${eventName}` });
        // cancelCheckout()
        // // Remove the cart data from local storage
        // reset()
        // // Timer expired, redirect to the event details page
        // navigate(`/event-details/${eventName}`);
  
      }
    }, [timeLeft, eventName,timersInitialized,endTime]);
  return (
    <LoginLayout>
      <form className="grid mt-[2vh] md:mt-[0vh] gap-[2vh] h-fit " onSubmit={handleRegisterUser}>
    <div className="grid gap-[10px] text-center md:text-left">
      <h1 className="text-black text-3xl font-semibold">Create an Account</h1>
      {/* <p className="text-lightGrey font-normal text-sm">Let’s sign up quickly to get stated.</p> */}
      {/* Ticket Summary */}
      {selectedTicketId && checkoutStage==='emailVerification' && (
      <div className="bg-faintPink p-4 rounded-xl mb-4  relative">
      <StyledTimerCard timeLeft={timeLeft} />
      <div className="flex justify-between items-center">
              <p className="font-semibold">{selectedTicketName}</p>
              <p className="text-sm text-darkGrey">
{quantity} × {price ? price.toLocaleString() : "Free"}              </p>
            </div>
            {/* <span className="font-bold text-red">{ticket.price}</span> */}
            <p className="text-softRed text-[14px] text-left">
            You were checking out
            </p>
          </div>)}
    </div>
    <div className="grid md:grid-cols-2 gap-[18px]">
      <DefaultInput
        id="signupFirstName"
        label="First Name"
        placeholder="Enter your first name"
        type="text"
        style="!w-full"
        required
        value={firstName}
        setValue={setFirstName}
        setExternalError={setFirstNameError}
      />
      <DefaultInput
        id="signupLastName"
        label="Last Name"
        placeholder="Enter your last name"
        type="text"
        style="!w-full"
        required
        value={lastName}
        setValue={setLastName}
        setExternalError={setLastNameError}
        
      />
    </div>
    <div className="grid w-full gap-[18px]">
      <div className="grid">
      <DefaultInput
        id="signupEmail"
        label="Email"
        placeholder="Enter your email address"
        type="email"
        style="!w-full"
        value={email}
        setValue={setemail}
        required
        ref={emailRef}
        setExternalError={setEmailError}
        disabled={true} // Disable email input if it's coming from location state
      />
        <p className="text-sm text-grey200">
          <button
            type="button"
            className="cursor-pointer text-red underline hover:text-deepRed focus:outline-none focus:ring-2 focus:ring-red focus:ring-offset-2"
            onClick={() => handleChangeEmail()}
            aria-label="Change email"
          >
            Change email
          </button>
        </p>
      </div>

      <div className="flex flex-col gap-4" ref={genderRef}>
      <span className="text-[1rem] font-semibold text-black">Gender</span>

      <div className="flex gap-6">
        <RadioButton
          label="Male"
          value="male"
          name="gender"
          checked={gender === "male"}
          onChange={setGender}
        />
        <RadioButton
          label="Female"
          value="female"
          name="gender"
          checked={gender === "female"}
          onChange={setGender}
        />
      </div>
      {genderError && (
    <p className="text-red text-sm mt-1">Please select your gender.</p>
  )}
    </div>
      <DefaultInput
        id="signupPassword"
        label="Password"
        placeholder="********"
        type="password"
        style="!w-full"
        required
        setValue={setPassword}
        value={password}
        ref={passwordRef}
        setExternalError={setPasswordError}
      />
    </div>
    <div className="grid gap-[20px] w-full">
      <DefaultButton
        variant="primary"
        size="normal"
        type="default"
        className="w-full"
        submitType="submit"
        isLoading={isLoading}
      >
        Sign Up
      </DefaultButton>
      {/* <DefaultButton
        variant="secondary"
        size="normal"
        className="w-full"
        icon={<FcGoogle />}
        type="icon-left"
      >
        Sign Up with Google
      </DefaultButton> */}
    </div>
    <p className="text-grey200 text-[14px]  mt-[0.5vh] text-center">
      Already have an account?{' '}
      <span
        className="text-red font-medium cursor-pointer hover:text-deepRed"
        onClick={() => navigate('/login')}
        role="link"
        tabIndex={0}
      >
        Sign In
      </span>
    </p>
  </form></LoginLayout>
  )
}

export default SignUp