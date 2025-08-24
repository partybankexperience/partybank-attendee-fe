
import { useNavigate } from "react-router";
import DefaultInput from "../../../components/inputs/DefaultInput";
import DefaultButton from "../../../components/buttons/DefaultButton";
import { useTicketStore } from "../../../stores/cartStore";
import { useAuthStore } from "../../../stores/useAuthStore";
import { Storage } from "../../../stores/InAppStorage";

const StepThree = ({ password, confirmPassword, setPassword, setConfirmPassword, onSubmit, isLoading }:any) => {
  const navigate = useNavigate();
const { selectedTicketId } = useTicketStore();
    const redirect = Storage?.getItem("redirectPath") || null;

 const { checkoutStage,setCheckoutStage } = useAuthStore();

 function handleNext() {
    if (selectedTicketId && redirect && checkoutStage==='eventDetails') {
      setCheckoutStage('checkout')
      Storage.removeItem("redirectPath");
      navigate(redirect);
      return;
    }else {
      navigate("/");
    }
       }
  return (
    <form onSubmit={onSubmit} className="grid  gap-[3vh] h-fit">
      <div className="grid w-full gap-[18px]">
        <DefaultInput
          id="password"
          label="New Password"
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="Enter new password"
          classname="!w-full"
        />
        <DefaultInput
          id="confirm"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="Confirm password"
          classname="!w-full"
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
          Reset Password
        </DefaultButton>
      </div>
      <p className="text-grey200 text-[14px]  mt-[0.5vh] text-center">
        Remember your password?{" "}
        <span
          className="text-red font-medium cursor-pointer hover:text-deepRed"
          onClick={() => handleNext()}
        >
          Sign In
        </span>
      </p>
    </form>
  );
};

export default StepThree;
