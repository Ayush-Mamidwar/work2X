import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import Passwordinput from '../../components/input/Passwordinput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

 
  const handleLogin = async (e)=>{
    e.preventDefault()

    if(!validateEmail(email)){
        setError("Please Enter a valid email address")
        return 
    }

    if(!password){
        setError("Please enter the password")
        return;
    }

    setError(null)

    //login api call
    try{
        const response = await axiosInstance.post("/login",{
            email:email,
            password:password
        });
        
        if(response.data.error){
            setError(response.data.message)
        }
        if(response.data && response.data.accessToken){
            localStorage.setItem("token",response.data.accessToken)
            navigate('/dashboard')
        }
    }catch(err){
        console.log('first')
        if(err.response && err.response.data && err.response.data.message){
            setError(err.response.data.message)
        }else{
            setError("An Unexpexted error occurred. Please Try again later")
        }
    }
  }

  return (
    <>
        <Navbar />

        <div className='flex items-center justify-center mt-28'>
            <div className='w-96 border rounded bg-white px-7 py-10'>
                <form onSubmit={handleLogin}>
                    <h4 className='text-2xl mb-7'>Login</h4>

                    <input 
                    type="text" 
                    placeholder='Email' 
                    className='input-box' 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Passwordinput
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    {error && <p className='text-red-500 text-xs pb-1 '>{error}</p>}
                    <button type='submit' className='btn-primary'>Login</button>

                    <p className='text-sm text-center mt-4'>
                        Not registered yet? <Link to="/signup" className='font-medium text-primary underline'>
                            Create an Account</Link>
                    </p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login