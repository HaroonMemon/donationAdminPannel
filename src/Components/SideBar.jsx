import React, { useState } from 'react';
import { FaBars, FaDonate, FaHome } from 'react-icons/fa';
import './style.css';
import { FaCodePullRequest } from 'react-icons/fa6';
import { MdPolicy, MdPrivacyTip } from 'react-icons/md';
import { FcAbout } from 'react-icons/fc';
import { BiLogOut } from 'react-icons/bi';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { toast } from 'react-toastify'; // Import react-toastify

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase sign-out function

      // Clear user session data from local storage or session storage
      localStorage.removeItem('user'); // Remove user data from local storage
      sessionStorage.clear(); // Clear all session storage

      // Show toast message for successful logout
      toast.success('Logged out successfully');

      // Redirect to the login page
      navigate('/'); // Replace '/login' with your actual login page route
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

    const menuItem = [
        {
            path: "/home",
            name: "Home",
            icon: <FaHome />,
        },
        {
            path: "/donation",
            name: "Donation",
            icon: <FaDonate />,
        },
        {
            path: "/request",
            name: "Request",
            icon: <FaCodePullRequest />,
        },
        {
            path: "/privacy",
            name: "Privacy",
            icon: <MdPrivacyTip />,
        },
        {
            path: "/term",
            name: "Term",
            icon: <MdPolicy />,
        },
        {
            path: "/about",
            name: "About",
            icon: <FcAbout />,
        },

        // {
        //     path: "/",
        //     name: "LogOut",
        //     icon: <BiLogOut />,
        // },
        
    ]


    
    return (
        <div className="container">
            <div style={{width: isOpen ? "20%" : "48px",padding: isOpen ? "10px" : "0px"}} className="sideBar">
                <div className="top_section">
                    <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Admin Pannel</h1>
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link"
                            activeclassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                            
                            </NavLink>
                    ))
                    
                }
                <button className="btn" onClick={handleLogout} > 
                <BiLogOut/>{ isOpen? " Logout" : "" }</button>

            </div>
            <main>{children}</main>
        </div>
    )
}
export default SideBar;