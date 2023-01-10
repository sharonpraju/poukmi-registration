import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const userLogin = (event) => {

    event.preventDefault();
    setSuccess(false);
    setError(false);
    setLoading(true);

    const loginPayload = {
      email: email,
      password: password
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, loginPayload)
      .then(response => {
        //storing JWT token to local storage
        localStorage.setItem("token", response.data.data);
        navigate("/dashboard");
      })
      .catch(error => {
        setLoading(false);
        setError(error.response.data.message);
      });
  };

  return (
    <div className='container col-12 d-flex justify-content-center align-items-center h-100-vh'>
      <div className='login-div text-center p-5'>
        <form onSubmit={userLogin}>
          <img className="login-avatar pb-3" src="assets/img/avatar.png" alt="avatar"></img>
          <TextField className="mt-3 w-100" id="login_username" label="Username" variant="outlined" color="primary" onChange={(event)=>{setEmail(event.target.value)}} InputProps={{ endAdornment: <InputAdornment position="start"><i className="fi fi-br-user"></i></InputAdornment> }} />
          <TextField className="mt-3 w-100" id="login_password" label="Password" variant="outlined" type="password" color="primary" onChange={(event)=>{setPassword(event.target.value)}} InputProps={{ endAdornment: <InputAdornment position="start"><i className="fi fi-br-lock"></i></InputAdornment> }} />
          <div className='mt-4 text-center'>
            <small className='text-muted'>By logging in, you agree to our Privacy Policy and Terms of use.</small>
          </div>
          {!loading && <Button type="submit" variant="contained" id="submit_btn" color="primary" className="ps-4 pe-4 w-100 font-weight-bolder mt-4" size="large" onClick={userLogin}>LOGIN</Button>}
          {loading && <div className='mt-3'><CircularProgress /></div>}
          {success && <Alert className="mt-3" severity="success">{success}</Alert>}
          {error && <Alert className="mt-3" severity="error">{error}</Alert>}
        </form>
      </div>
    </div>
  )
}



export default Login