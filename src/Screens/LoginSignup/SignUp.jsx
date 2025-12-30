import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import '../../styles/Form.css'
import postUser from "../../js/PostUser.js";

function SignUp(){
    const[email,setEmail] = useState("");
    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleChangeEmail = (event) =>{
        setEmail(event.target.value);
    }
    const handleChangeUsername = function (event){
        setUsername(event.target.value);
    }
    const handleChangePassword = function (event){
        setPassword(event.target.value);
    }

    const formSubmit = async (event) =>{
        event.preventDefault();
        const userData = {
            userEmail: email,
            userName:username,
            userPassword: password
        }

        const data = await postUser(userData);
        
        if(data.error){
            alert("Error: " + data.error + ". Please try again.");
            setEmail("");
            setUsername("");
            setPassword("");
        }
        else{
            alert('Successful signup!');
            navigate("/login");
        }

    }
    return(
    <>
        <div className={"content"}>
            <h1>Sign Up</h1>
            <form onSubmit={formSubmit}>
                <p>
                    <input className={"formInput"} type={"email"} placeholder={"Email goes here"} value={email}
                           onChange={handleChangeEmail} required/>
                </p>

                <p>
                    <input className={"formInput"} type={"text"} placeholder={"Username goes here"} value={username}
                           onChange={handleChangeUsername} required/>
                </p>

                <p>
                    <input className={"formInput"} type={"password"} placeholder={"Password goes here"} value={password}
                           onChange={handleChangePassword} required/>
                </p>

                <p>
                    <input className={"formInputSubmit"} type={"submit"}  value={"Sign Up"}/>
                </p>

                <Link to={"/login"}>Already have an account? Login here</Link>

            </form>
        </div>
    </>
    )
}

export default SignUp;