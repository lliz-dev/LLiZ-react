import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./Resources.jsx";
import About from "./About.jsx";
import Navigation from "./Navigation.jsx";
import Home from "./Home.jsx";
import "./styles/App.css"
import Login from "./Screens/LoginSignup/Login.jsx";
import SignUp from "./Screens/LoginSignup/SignUp.jsx";
import BlogList from "./Screens/BlogStuff/BlogList.jsx";
import BlogPage from "./Screens/BlogStuff/BlogPage.jsx";
import Profile from "./Screens/Profile/Profile.jsx";
import Admin from "./Admin.jsx";
import ProfileEditor from "./Screens/Profile/ProfileEditor.jsx";
import DeleteUserComp from "./DeleteUserComp.jsx";
import BlogEditor from "./Screens/BlogStuff/BlogEditor.jsx";
import BlogMaker from "./Screens/BlogStuff/BlogMaker.jsx";
import ForgotPassword from "./Screens/LoginSignup/ForgotPassword.jsx";
import ResetPassword from "./Screens/LoginSignup/ResetPassword.jsx";
import ChangeEmail from "./Screens/Profile/ChangeEmail.jsx";

function App() {
  return (
    <>
        <Router>
            <Navigation></Navigation>

            <Routes>
                <Route path="/" element={<Home/>} />

                <Route path="/change-email" element={<ChangeEmail/>} />

                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/profile" element={<Profile/>} />
                <Route path="/editprofile" element={<ProfileEditor/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/posts" element={<BlogList/>} />
                <Route path="/res" element={<Resources/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/deleteAccount" element={<DeleteUserComp/>} />

                    {/* Route for the list of blogs */}
                    <Route path="/" element={<BlogList/>} />

                    {/* Route to edit a blog */}
                    <Route path="/edit/:id" element={<BlogEditor/>} />

                    {/* Route for each individual blog page */}
                    <Route path="/posts/:id" element={<BlogPage/>} />

                <Route
                    path="/admin"
                    element={<Admin/>}
                />

                <Route
                    path="/createpost"
                    element={<BlogMaker/>}
                />

                {/* Catch-all route - redirect to home for any unmatched routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>

    </>
  )
}

export default App
