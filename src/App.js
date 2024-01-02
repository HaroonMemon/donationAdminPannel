// import './App.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import Donation from './Components/Donation';
import Request from './Components/Request';
import Privacy from './Components/Privacy';
import Term from './Components/Term';
import About from './Components/About';
import SideBar from './Components/SideBar';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Login/> */}
        <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        </Routes>
        {/* <SideBar> */}
        <Routes>
          <Route path="/request" element={<Request />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/term" element={<Term />} />
          <Route path="/about" element={<About />} />
          <Route path="/sidebar" element={<SideBar/>}></Route>
          {/* Other routes */}
        </Routes>
        {/* </SideBar> */}
      </BrowserRouter>
      <ToastContainer />

    </div>
  );
}

export default App;
