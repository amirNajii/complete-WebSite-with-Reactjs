import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const Register = (props) => {
    const [state, setState] = useState({
        email: "",
        password: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        country: "",
        receiveNewsLetters: "",
    });
    const [countries, setCountries] = useState([
        {id:1, countryName: "Iran"},
        {id:2, countryName: "India"},
        {id:3, countryName: "USA"},
        {id:4, countryName: "UK"},
        {id:5, countryName: "Japan"},
        {id:6, countryName: "France"},
        {id:7, countryName: "Brazil"},
        {id:8, countryName: "Canada"},
    ]);

    const [errors, setErrors] = useState({
        email: [],
        password: [],
        fullName: [],
        dateOfBirth: [],
        gender: [],
        country: [],
        receiveNewsLetters: [],
    });

    const [dirty, setDirty] = useState({
        email: false,
        password: false,
        fullName: false,
        dateOfBirth: false,
        gender: false,
        country: false,
        receiveNewsLetters: false,
    });

    const [message, setMessage] = useState("");

    const userContext = useContext(UserContext);

    const validate = () => {
        let errorsData = {};

        // email
        errorsData.email = [];

        //email can't blank
        if(!state.email)
        {
            errorsData.email.push("Email can't be blank")
        }
        //email regex
        const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if(state.email){
            if(!validEmailRegex.test(state.email)){
                errorsData.email.push("Proper email address is expected")
            }
        }

        // password
        errorsData.password = [];

        //email can't blank
        if(!state.password)
        {
            errorsData.password.push("Password can't be blank")
        }
        //email regex
        const validPasswordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
        if(state.password){
            if(!validPasswordRegex.test(state.password)){
                errorsData.password.push("Password should be 6 to 15 characters long with at least one uppercase letter, one lowercase letter and one digit")
            }
        }

        // fullName
        errorsData.fullName = [];

        //fullName can't blank
        if(!state.fullName)
        {
            errorsData.fullName.push("Full Name can't be blank")
        }

        // dateOfBirth
        errorsData.dateOfBirth = [];

        //dateOfBirth can't blank
        if(!state.dateOfBirth)
        {
            errorsData.dateOfBirth.push("Date Of Birth can't be blank")
        }

         // gender
         errorsData.gender = [];

         //gender can't blank
         if(!state.gender)
         {
             errorsData.gender.push("Please select gender either male or female")
         }

         // country
         errorsData.country = [];

         //country can't blank
         if(!state.country)
         {
             errorsData.country.push("Please select a country")
         }

         setErrors(errorsData);

    }


    useEffect(validate,[state]);


    useEffect(() => {
        document.title = 'Register';
    },[])

    let isValid = () => {
        let valid = true;
        for(let control in errors){
            if(errors[control].length > 0){
                valid = false;
            }
        }

        return valid;
    }

    let onRegisterClick = async () => {
        //set all controls as dirty
        let dirtyData = dirty;
        Object.keys(dirty).forEach((control) => {
          dirtyData[control] = true;
        });
        setDirty(dirtyData);
    
        validate();
    
        if (isValid()) {
          let response = await fetch("http://localhost:5000/users", {
            method: "POST",
            body: JSON.stringify({
              email: state.email,
              password: state.password,
              fullName: state.fullName,
              dateOfBirth: state.dateOfBirth,
              gender: state.gender,
              country: state.country,
              receiveNewsLetters: state.receiveNewsLetters,
              role: "user",
            }),
            headers: {
              "Content-type": "application/json",
            },
          });
    
          if (response.ok) {
            
            const responseBody = await response.json();
            userContext.dispatch({
                type: "login",
                payload: {
                    currentUserId: responseBody.id,
                    currentUserName: responseBody.fullName,
                    currentUserRole: responseBody.role,
                }
            });

            setMessage(
                <span className="text-success">Successfully Registered</span>
              );

            props.history.replace("/dashboard");
            
          } else {
            setMessage(
              <span className="text-danger">Errors in database connection</span>
            );
          }
        } else {
          setMessage(<span className="text-danger">Errors</span>);
        }
      };

    

    return (
        <div className="row">
            <div className="col-lg-6 col-md-7 mx-auto">
                <div className="card border-primary shadow my-2">
                    <div className="card-header border-bottom border-primary">
                        <h5 style={{fontSize:"20px"}} className="text-primary text-center">Register</h5>
                        <ul className="text-danger">
                            {Object.keys(errors).map((control) => {
                                if(dirty[control]){
                                    return errors[control].map((err)=> {
                                        return <li key={err}>{err}</li>
                                    });
                                } else {
                                    return "";
                                }
                            })}
                        </ul>
                    </div>
                    <div className="card-body border-bottom">
                        {/* Email */}
                        <div className="row mb-3">
                            <label className="col-lg-4" htmlFor="email">Email</label>
                            <div className="col-lg-8">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    id="email"
                                    name="email" 
                                    className="form-control" 
                                    value={state.email}
                                    onChange={(e) => setState({...state, [e.target.name]: e.target.value})}
                                    onBlur={(e)=> {
                                        setDirty({...dirty, [e.target.name]: true});
                                        validate();
                                    }} 
                                />
                                <div className="text-danger">
                                    {dirty["email"]&&errors["email"][0] ? errors["email"] : ""}
                                </div>
                            </div>
                        </div>
                        {/* Password */}
                        <div className="row mb-3">
                            <label className="col-lg-4" htmlFor="password">Password</label>
                            <div className="col-lg-8">
                            <input 
                                type="password"
                                id="password"
                                name="password" 
                                className="form-control" 
                                value={state.password}
                                onChange={(e) => setState({...state, [e.target.name]: e.target.value})}
                                onBlur={(e)=> {
                                    setDirty({...dirty, [e.target.name]: true});
                                    validate();
                                }}  
                            />
                                <div className="text-danger">
                                    {dirty["password"]&&errors["password"][0] ? errors["password"] : ""}
                                </div>
                            </div>
                        </div>
                        {/* FullName */}
                        <div className="row mb-3">
                            <label className="col-lg-4" htmlFor="fullName">Full Name</label>
                            <div className="col-lg-8">
                            <input
                                autoComplete="off" 
                                type="text"
                                id="fullName"
                                name="fullName" 
                                className="form-control" 
                                value={state.fullName}
                                onChange={(e) => setState({...state, [e.target.name]: e.target.value})}
                                onBlur={(e)=> {
                                    setDirty({...dirty, [e.target.name]: true});
                                    validate();
                                }}  
                            />
                                <div className="text-danger">
                                    {dirty["fullName"]&&errors["fullName"][0] ? errors["fullName"] : ""}
                                </div>
                            </div>
                        </div>
                        {/* dateOfBirth */}
                        <div className="row mb-3">
                            <label className="col-lg-4" htmlFor="dateOfBirth">Date Of Birth</label>
                            <div className="col-lg-8">
                            <input 
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth" 
                                className="form-control" 
                                value={state.dateOfBirth}
                                onChange={(e) => setState({...state, [e.target.name]: e.target.value})}
                                onBlur={(e)=> {
                                    setDirty({...dirty, [e.target.name]: true});
                                    validate();
                                }}  
                            />
                                <div className="text-danger">
                                    {dirty["dateOfBirth"]&&errors["dateOfBirth"][0] ? errors["dateOfBirth"] : ""}
                                </div>
                            </div>
                        </div>
                        {/* Gender */}
                        <div className="row mb-3">
                            <label className="col-lg-4">Gender</label>
                            <div className="col-lg-8">
                                <div className="form-check">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        value='male'
                                        id="male" 
                                        className="form-check-input"
                                        checked={state.gender==="male"?true:false} 
                                        onChange={(e) => setState({...state, [e.target.name]: e.target.value})}
                                         
                                    />
                                    <label htmlFor="male" className="form-check-inline mb-1">Male</label>
                                </div>
                                <div className="form-check">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        value='female'
                                        id="female" 
                                        className="form-check-input"
                                        checked={state.gender==="female"?true:false} 
                                        onChange={(e) => setState({...state, [e.target.name]: e.target.value})} 
                                    />
                                    <label htmlFor="female" className="form-check-inline mb-1">Female</label>
                                </div>
                                <div className="text-danger">
                                    {dirty["gender"]&&errors["gender"][0] ? errors["gender"] : ""}
                                </div>
                            </div>
                        </div>
                        {/* Country */}
                        <div className="row mb-3">
                            <label className="col-lg-4" htmlFor="country">Country</label>
                            <div className="col-lg-8">
                            <select
                                    multiple={false} 
                                    id="country"
                                    name="country" 
                                    className="form-control mb-2" 
                                    value={state.country}
                                    onChange={(e) => setState({...state, [e.target.name]: e.target.value})} 
                                >
                                    <option value="">Please Select a Country</option>
                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>{country.countryName}</option>
                                    ))}
                                </select>
                                <div className="text-danger">
                                    {dirty["country"]&&errors["country"][0] ? errors["country"] : ""}
                                </div>
                            </div>
                        </div>
                        {/* End of Country */}
                        {/* recieve news letters */}
                        <div className="row mb-3">
                            <label className="col-lg-4"></label>
                            <div className="col-lg-8">
                                <div className="form-check">
                                    <input 
                                        type="checkbox"
                                        name="receiveNewsLetters"
                                        value='true'
                                        id="receiveNewsLetters" 
                                        className="form-check-input"
                                        checked={state.receiveNewsLetters===true?true:false} 
                                        onChange={(e) => setState({...state, [e.target.name]: e.target.checked})} 
                                    />
                                    <label htmlFor="receiveNewsLetters" className="form-check-inline">Recieve News Letters</label>
        
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="card-footer text-center">
                        <div className="m-1">{message}</div>
                        <div>
                            <button 
                                className="btn btn-primary m-2"
                                onClick={onRegisterClick}
                            >Register</button>
                        </div>
                    </div>
                    {/* end of Footer */}
                </div>
                
            </div>
        </div>
    )
}

export default Register;