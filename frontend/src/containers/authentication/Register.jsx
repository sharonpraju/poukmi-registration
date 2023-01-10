import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

function Register() {

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = (event) => {

    event.preventDefault();
    setSuccess(false);
    setError(false);
    setLoading(true);

    const registerPayload = {
      first_name: firstName,
      last_name: lastName,
      email: email
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, registerPayload)
      .then(response => {
        setLoading(false);
        setSuccess(response.data.message);
        reset();
      })
      .catch(error => {
        setLoading(false);
        setError(error.response.data.message);
      });
  };

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
  };

  return (
    <div className='container col-12 d-flex justify-content-center align-items-center h-100-vh'>
      <div className='main d-block p-5 border rounded'>
        <div className='row p-0 m-0'>
          <div className='col-6 text-start'>
            <h2>Register</h2>
          </div>
          <div className='col-6 text-end'>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <form onSubmit={register}>
          <div className='row p-0 m-0'>
            <div className="col-12 col-md-6 p-3">
              <TextField className="w-100" label="First Name" variant="outlined" color="primary" value={firstName || ""} onChange={(event) => { setFirstName(event.target.value) }} />
            </div>
            <div className="col-12 col-md-6 p-3">
              <TextField className="w-100" label="Last Name" variant="outlined" color="primary" value={lastName || ""} onChange={(event) => { setLastName(event.target.value) }} />
            </div>
            <div className="col-12 col-md-6 p-3">
              <TextField className="w-100" label="Email" variant="outlined" color="primary" value={email || ""} onChange={(event) => { setEmail(event.target.value) }} InputProps={{ endAdornment: <InputAdornment position="start"><i className="fi fi-br-user"></i></InputAdornment> }} />
            </div>
            <div className='col-12 col-md-6 row p-3 m-0 justify-content-end gap-2'>
            {!loading && <Button variant="outlined" color="primary" className="col-12 col-md-5 font-weight-bolder mt-2" size="large" onClick={reset}>Reset</Button>}
            {!loading && <Button type="submit" variant="contained" color="primary" className="col-12 col-md-5 font-weight-bolder mt-2" size="large" onClick={register}>Register</Button>}
          </div>
          </div>
          {loading && <div className='mt-3'><CircularProgress /></div>}
          {success && <Alert className="mt-3" severity="success">{success}</Alert>}
          {error && <Alert className="mt-3" severity="error">{error}</Alert>}
        </form>
      </div>
    </div>
  )
}



export default Register