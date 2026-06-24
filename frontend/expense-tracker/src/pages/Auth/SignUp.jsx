import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/Layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utills/helper';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utills/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter valid email');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    //signUp API call
    try {
      //Upload image if present
      if (profilePic) {
        console.log("Uploading image...");
        const imageUploadRes = await uploadImage(profilePic);
        console.log("Image upload response:", imageUploadRes);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }
      console.log("Sending register request...");
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.data.message) {
        setError(error.data.message);
      } else {
        setError("Something went wrong. please try again");
      }
    }
  }
  return (
    <AuthLayout>
      <div className="lg:w[100%] h-auto md:h-full flex flex-col mt-10 md:mt-0 justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">Jpoin us today by entering your details below</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Shruti"
              label="Full name"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
            />

            <Input
              type="text"
              placeholder="test@google.com"
              label="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <div className='col-span-2'>
              <Input
                type="password"
                placeholder="Min length 6 char"
                label="Password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            SignUp
          </button>
          <p className="">
            Already have an account ? {''}
            <Link to="/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
