import React from 'react';
import Button from '@mui/material/Button';

function ListView({users, deleteUser}) {
    return (
        <>
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
                                <Button variant="contained" color="danger" className="col-12 col-md-2 font-weight-bolder mt-2 text-white ps-3 pe-3" size="small" onClick={() => deleteUser(obj._id)}>Delete</Button>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default ListView