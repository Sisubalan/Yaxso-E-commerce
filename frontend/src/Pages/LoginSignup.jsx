import { useState } from 'react';
import './Css/LoginSignup.css';

const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const url = process.env.REACT_APP_API_URL || "http://localhost:4000";

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const apiRequest = async (endpoint, data) => {
        try {
            const response = await fetch(`${url}/${endpoint}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            return await response.json();
        } catch (error) {
            console.error(`Error with ${endpoint} request:`, error);
            alert("Something went wrong! Please try again.");
            return { success: false };
        }
    };

    const login = async () => {
        console.log("Login function Executed", formData);
        const responseData = await apiRequest("login", formData);
        if (responseData.success) {
            localStorage.setItem("auth-token", responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData.error);
        }
    };

    const signup = async () => {
        console.log("Signup function Executed", formData);
        const responseData = await apiRequest("signup", formData);
        if (responseData.success) {
            localStorage.setItem("auth-token", responseData.token);
            window.location.replace("/");
        } else {
            alert(responseData.error);
        }
    };

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" && (
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={changeHandler}
                            placeholder="Your Name"
                        />
                    )}
                    <input
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        placeholder="Email Address"
                    />
                    <input
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <button onClick={() => (state === "Login" ? login() : signup())}>Continue</button>
                {state === "Sign Up" ? (
                    <p className="loginsignup-login">
                        Already have an account? <span onClick={() => setState("Login")}>Login here</span>
                    </p>
                ) : (
                    <p className="loginsignup-login">
                        Create an Account? <span onClick={() => setState("Sign Up")}>Click here</span>
                    </p>
                )}
                <div className="loginsignup-agree">
                    <input type="checkbox" />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;






// import { useState } from 'react'
// import './Css/LoginSignup.css'

// const LoginSignup = () => {


//     const [state,setState] = useState("Login")
//     const url = process.env.REACT_APP_API_URL || "http://localhost:4000";
//     const [formData,setFormData] = useState({
//         username:"",
//         password:"",
//         email:"",
//     })

//     const changeHandler = (e)=>{
//         setFormData({...formData,[e.target.name]:e.target.value})
//     }

//     const login = async () =>{
//         console.log("Login function Executed",formData);
//         let responseData;
//         await fetch(url +'/login',{
//             method:'POST',
//             headers:{
//                 Accept:'application/form-data',
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify(formData),
//         }).then((response)=> response.json()).then((data)=>responseData=data)

//         if(responseData.success)
//         {
//             localStorage.setItem('auth-token',responseData.token);
//             window.location.replace("/");
//         }
//         else{
//             alert(responseData.error)
//         }
//     }

//     const signup = async () =>{
//         console.log("Signup function Executed",formData);
//         let responseData;
//         await fetch(url +'/signup',{
//             method:'POST',
//             headers:{
//                 Accept:'application/form-data',
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify(formData),
//         }).then((response)=> response.json()).then((data)=>responseData=data)

//         if(responseData.success)
//         {
//             localStorage.setItem('auth-token',responseData.token);
//             window.location.replace("/");
//         }
//         else{
//             alert(responseData.error)
//         }
//     }

//     return (
//         <div className="loginsignup">
//             <div className="loginsignup-container">
//                 <h1>{state}</h1>
//                 <div className="loginsignup-fields">
//                     {state==="Sign Up"?<input type="text" name='username' value={formData.username} onChange={changeHandler} placeholder="Your Name"/>:<></>}
//                     <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address"/>
//                     <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password"/>
//                 </div>
//                 <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
//                 {state==="Sign Up"?
//                 <p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
//                 :
//                 <p className="loginsignup-login">Create an Account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
//                 <div className="loginsignup-agree">
//                     <input type="checkbox" name=''/>
//                     <p>By continuing, i agree to the terms of use & privacy policy.</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default LoginSignup