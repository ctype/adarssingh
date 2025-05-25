import React from "react";

import CustomInput from "../form/CustomInput";
import ProfileSectionWrapper from "./ProfileSectionWrapper";

interface IPersonalInformationProfileSectionProps {
  data: Partial<BaseUser>;
  setData: React.Dispatch<React.SetStateAction<Partial<BaseUser>>>;
}

export default function PersonalInformationProfileSeciton({
  data,
  setData,
}: IPersonalInformationProfileSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "mobileNumber" ? Number(value) : value,
    }));
  };
  return (
    <ProfileSectionWrapper
      label={"Personal Information"}
      description="Update your personal information"
    >
      <CustomInput
        label="First name"
        name="firstName"
        value={data.firstName ?? ""}
        onChange={handleChange}
        placeholder="Enter your legal first name"
      />
      <CustomInput
        label="Last name"
        name="lastName"
        value={data.lastName ?? ""}
        onChange={handleChange}
        placeholder="Enter your legal last name"
      />
      <CustomInput
        label="Phone number"
        name="mobileNumber"
        type="number"
        required={false}
        value={data.mobileNumber ?? ""}
        onChange={handleChange}
        placeholder="Enter your phone number"
      />
    </ProfileSectionWrapper>
  );
}
