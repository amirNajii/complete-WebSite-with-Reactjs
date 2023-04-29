import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../UserContext';

const Login = (props) => {

    const userContext = useContext(UserContext)

    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("Admin123");

    const myEmailRef = useRef();

    const [dirty, setDirty] = useState({
        email: false,
        password: false,
    });

    const [errors, setErrors] = useState({
        email: [],
        passowrd: [],
    });

    const [loginMessage, setLoginMessage] = useState("");

    useEffect(() => {
        document.title = 'Login';
        myEmailRef.current.focus();
    },[]);

    const validate = () => {
        let errorsData = {};

        //email
        errorsData.email = [];

        //email can't blank
        if(!email){
            errorsData.email.push("Email can't be blank");
        }
        //email regex
        const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if(email){
            if(!validEmailRegex.test(email)){
                errorsData.email.push("Proper email address is expected")
            }
        }

        //password
        errorsData.password = [];

        //password can't blank
        if(!password){
            errorsData.password.push("Password can't be blank");
        }
        //password regex
        const validPasswordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
        if(password){
            if(!validPasswordRegex.test(password)){
                errorsData.password.push("Password should be 6 to 15 characters long with at least one uppercase letter, one lowercase letter and one digit")
            }
        }

        setErrors(errorsData);
    }

    useEffect(validate,[email, password]);

    const onLoginClick = async () => {
        let dirtyData = dirty;
        Object.keys(dirty).forEach((control)=>{
            dirtyData[control] = true;
        });
        setDirty(dirtyData);

        validate();

        if(isValid()){
            let response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`,{method: "GET"});
            if(response.ok){
                let responseBody = await response.json();
                if(responseBody.length > 0){
                    userContext.dispatch({
                        type: "login",
                        payload:{
                            currentUserId: responseBody[0].id,
                            currentUserName: responseBody[0].fullName,
                            currentUserRole: responseBody[0].role,
                        },
                    });
                    if(responseBody[0].role === "user"){
                        props.history.replace("/dashboard");
                    } else {
                        props.history.replace("/products");
                    }
                } else {
                    setLoginMessage(<span className="text-danger">Invalid Login, please try again</span>);
                }
            }else {
                setLoginMessage(<span className="text-danger">Unable to connect to server</span>);
            }
        }
    }

    const isValid = () => {
        let valid = true;
        for(let control in errors){
            if(errors[control].length > 0) valid = false;
        }

        return valid;
    }

    return (
        <div className="row">
            <div className="col-lo-5 col-md-7 mx-auto">
                <div className="card border-success shadow-lg my-2">
                    <div className="card-header border-bottom border-success">
                        <h4 style={{ fontSize: "40px"}} className="text-success text-center">
                            Login
                        </h4>
                    </div>
                    <div className="card-body border-bottom border-success">
                        <div className="form-group">
                            <label className="mb-2" htmlFor="email">Email</label>
                            <input
                                autoComplete="off"
                                type="text" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter Your Email" 
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => {
                                    setDirty({...dirty, email: true});
                                    validate();
                                }}
                                ref={myEmailRef}
                            />
                                <div className="text-danger">
                                    {dirty["email"]&&errors["email"][0] ? errors["email"] : ""}
                                </div>
                        </div>
                        <div className="form-group mt-3">
                            <label className="mb-2" htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Enter Your Password" 
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => {
                                    setDirty({...dirty, password: true});
                                    validate();
                                }}   
                            />
                                <div className="text-danger">
                                    {dirty["password"]&&errors["password"][0] ? errors["password"] : ""}
                                </div>
                        </div>
                    </div>
                    <div className="card-footer text-center">
                        <div className="m-1">{loginMessage}</div>
                        <button className="btn btn-success m-2" onClick={onLoginClick}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;