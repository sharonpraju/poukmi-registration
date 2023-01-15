import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import axios from 'axios';

//invoking web-socket connection
const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

function Dashboard() {

  const navigate = useNavigate();

  const [users, setUsers] = useState();

  const fetchUsers = async () => {
    const axiosPromise = (() => {
      return new Promise(async (resolve, reject) => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`)
          .then((response) => {
            setUsers(response.data.data.users);
            resolve(typeof (response.data.data) === 'string' ? (response.data.data) : ("Request Successfull"));
          })
          .catch(error => {
            console.log(error)
            reject(typeof (error.response.data.data) === 'string' ? (error.response.data.data) : ("Something went wrong"));
          });
      });
    });

    toast.dismiss();
    toast.promise(
      axiosPromise,
      {
        pending: "Fetching Users",
        error: { render({ data }) { return data } }
      },
      {
        position: "bottom-center",
      }
    );
  }

  const deleteUser = (id) => {
    const axiosPromise = (() => {
      return new Promise(async (resolve, reject) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`)
          .then(response => {
            fetchUsers();
            resolve(response.data.message);
          })
          .catch(error => {
            resolve("User Deletion failed");
          });
      });
    });

    toast.dismiss();
    toast.promise(
      axiosPromise,
      {
        success: { render({ data }) { return data } },
        pending: "Deleting user",
        error: { render({ data }) { return data } }
      },
      {
        position: "bottom-center",
      }
    );
  }

  const deleteAll = () => {
    const axiosPromise = (() => {
      return new Promise(async (resolve, reject) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users`)
          .then(response => {
            fetchUsers();
            resolve(response.data.message);
          })
          .catch(error => {
            resolve("User Deletion failed");
          });
      });
    });

    toast.dismiss();
    toast.promise(
      axiosPromise,
      {
        success: { render({ data }) { return data } },
        pending: "Deleting users",
        error: { render({ data }) { return data } }
      },
      {
        position: "bottom-center",
      }
    );
  }

  const logout = () => {
    const axiosPromise = (() => {
      return new Promise(async (resolve, reject) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`)
          .then(response => {
            localStorage.removeItem('token');
            navigate("/login");
            resolve(response.data.message);
          })
          .catch(error => {
            reject("Logout failed");
          });
      });
    });

    toast.dismiss();
    toast.promise(
      axiosPromise,
      {
        pending: "Logging Out",
        error: { render({ data }) { return data } }
      },
      {
        position: "bottom-center",
      }
    );
  }

  useEffect(() => {
    fetchUsers();

    //listening for updated message from socket
    socket.on('updated', () => {
      fetchUsers();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  return (
    <div className='container col-12'>
      <div className='main d-block mt-5 p-5 border rounded'>
        <div className='row p-0 m-0'>
          <div className='col-6 text-start'>
            <h2>User List</h2>
          </div>
          <div className='col-6 text-end'>
            <Link to="#" onClick={logout}>Logout</Link>
          </div>
        </div>
        <hr></hr>
        {
          users && users.map((obj) => {
            return (
              <div className='row p-0 m-0 border-bottom'>
                <div className="col-6 col-md-4 p-3">
                  {obj.first_name}
                </div>
                <div className="col-6 col-md-4 p-3">
                  {obj.last_name}
                </div>
                <div className="col-12 col-md-4 p-3 d-flex justify-content-end">
                  <Button variant="contained" color="danger" className="col-12 col-md-2 font-weight-bolder mt-2 text-white" size="large" onClick={() => deleteUser(obj._id)}>Delete</Button>
                </div>
              </div>
            )
          })
        }
        <div className='row p-3 m-0 justify-content-end gap-2'>
          {(users && users.length > 0) ? <Button variant="contained" color="danger" className="col-12 col-md-2 font-weight-bolder mt-2 text-white" size="large" onClick={() => deleteAll()}>Delete All</Button> : <div className='col-12 text-center'>No Users</div>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard