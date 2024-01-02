import React from "react";
import SideBar from "./SideBar";
import "./style.css";

const About = () => {
    return (
        <div className="about">
            <SideBar />
            <div className="aboutInner">
                <h2>About Us!</h2>
                <h3 style={{ textAlign: "center" }}>Welcome To <span id="W_Name1">Donation</span></h3>
                <p>
                    <span id="W_Name2">Donation</span> is a Professional <span id="W_Type1">Donation</span> Platform. Here we will provide you only interesting content, which you will like very much. We're dedicated to providing you the best of <span id="W_Type2">Donation</span>, with a focus on dependability and <span id="W_Spec">Donation</span>. We're working to turn our passion for <span id="W_Type3">Donation</span> into a booming <a href="https://www.blogearns.com/2021/05/free-about-us-page-generator.html" rel="do-follow" style={{ color: "inherit", textDecoration: "none" }}>online website</a>. We hope you enjoy our <span id="W_Type4">Donation</span> as much as we enjoy offering them to you.
                </p>
                <p>I will keep posting more important posts on my Website for all of you. Please give your support and love.</p>
                <p style={{ fontWeight: "bold", textAlign: "center" }}>Thanks For Visiting Our Site<br /><br />
                    <span style={{ color: "blue", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Have a nice day!</span>
                </p>
            </div>
        </div>
    );
};

export default About;
