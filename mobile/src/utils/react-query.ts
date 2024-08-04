import { ReactNativeFile } from "apollo-upload-client";
export const verifyProfilePicture = async (variables: {
  pose: ReactNativeFile;
  avatar: string;
}) => {
  const formData = new FormData();
  formData.append("pose", variables.pose);
  formData.append("avatar", variables.avatar);
  const res = await fetch(
    `https://5a7f-213-172-134-71.ngrok-free.app/api/v1/verify-face`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  return data as {
    verified: boolean;
  };
};
export const validateFace = async ({ face }: { face: ReactNativeFile }) => {
  const formData = new FormData();
  formData.append("face", face);
  const res = await fetch(
    `https://5a7f-213-172-134-71.ngrok-free.app/api/v1/find-face`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  return data as {
    valid: boolean;
  };
};
