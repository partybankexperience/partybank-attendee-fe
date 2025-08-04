import HomeLayout from "../../components/layouts/HomeLayout";
import EventDetailContainer from "./EventDetailContainer";
// import TestMe from "./TestMe";

const EventDetails = () => {
  return (
    <>
      <HomeLayout>
         <EventDetailContainer />
         <br />
         {/* <TestMe /> */}
      </HomeLayout>
    </>
  );
};

export default EventDetails;
