import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/Layouts/AuthLayout';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utills/helper';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPaths';
import { UserContext } from '../../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    //Login Api calls
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else if (error.data && error.data.message) {
        setError(error.data.message)
      } else {
        setError("Something went wrong, please try again")
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg-w[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl'>Welcome back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            type="text"
            onChange={({ target }) => setEmail(target.value)}
            value={email}
            label="Email Address"
            placeholder='shruti@gmail.com'
          />

          <Input
            type="password"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
            label="Password"
            placeholder='Min length 8 Char'
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Login
          </button>
          <p className="">
            Don't have an account ? {''}
            <Link to="/signup" className="font-medium text-primary">
              SignUp
            </Link>
          </p>
        </form>
      </div>

    </AuthLayout>
  )
}

export default Login
