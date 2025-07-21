import { useRef, useState } from "react";
import LoginLayout from "../../components/layouts/LoginLayout"
import { useLocation, useNavigate } from "react-router";
import DefaultInput from "../../components/inputs/DefaultInput";
import DefaultButton from "../../components/buttons/DefaultButton";
import RadioButton from "../../components/inputs/RadioButton";

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

  const emailRef = useRef<any>(null);
  const location = useLocation();
  function handleRegisterUser(e: React.FormEvent) {
    e.preventDefault();
    setisLoading(true); }
  return (
    <LoginLayout><form className="grid mt-[2vh] md:mt-[2vh] gap-[3vh] h-fit " onSubmit={handleRegisterUser}>
    <div className="grid gap-[10px] text-center md:text-left">
      <h1 className="text-black text-3xl font-semibold">Create an Account</h1>
      <p className="text-lightGrey font-normal text-sm">Let’s sign up quickly to get stated.</p>
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
      />
      <div className="flex flex-col gap-4">
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