import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./helpers/protectedRoutes"
import AxiosInterceptor from './helpers/axiosInterceptor'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//pages
import Login from './containers/authentication/Login';
import Register from './containers/authentication/Register';
import Dashboard from './containers/dashboard/Dashboard';

function App() {

  //invoking interceptor
  AxiosInterceptor();

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;