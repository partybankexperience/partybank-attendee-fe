import React from "react";
import HomeLayout from "../../components/layouts/HomeLayout";
// import ProfileComponent from './Profile_page_component';
import Profile_layout from "./Profile_layout";

const Profile = () => {
  return (
    <>
      <HomeLayout>
        <div className="flex justify-center items-center relative top-[-5rem] z-50">
          <Profile_layout />
        </div>
        {/* <ProfileComponent /> */}
        <br />
        {/* <TestMe /> */}
      </HomeLayout>
    </>
  );
};

export default Profile;
