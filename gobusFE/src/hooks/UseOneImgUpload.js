import axios from "axios";
import { CLOUD_NAME, PRESET_KEY } from "../../keys";

const preset_key = PRESET_KEY;
const cloud_name = CLOUD_NAME;

const UseOneImgUpload = async ({ file }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset_key);
  formData.append("cloud_name", "");

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    formData
  );

  const imageUrl = response.data.secure_url;
  return imageUrl;
};

export default UseOneImgUpload;
