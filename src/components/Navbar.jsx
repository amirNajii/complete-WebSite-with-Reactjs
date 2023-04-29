import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Navbar = () => {

    console.log(window)

    const userContext = useContext(UserContext);

    const onLogoutClick = (e) => {
        e.preventDefault();
        userContext.dispatch({
            type: "logout"
        });
        window.location.href = "/";
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <NavLink className="navbar-brand" to="/">Pista Academy</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user" ? (<li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard" activeClassName="active"><i className="fa fa-dashboard"></i>Dashboard
                            </NavLink>
                        </li>) : ""}
                        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "user" ? (<li className="nav-item">
                            <NavLink className="nav-link" to="/store" activeClassName="active"><i className="fa fa-shopping-bag"></i>Store
                            </NavLink>
                        </li>) : ""}
                        {userContext.user.isLoggedIn && userContext.user.currentUserRole === "admin" ? (<li className="nav-item">
                            <NavLink className="nav-link" to="/products" activeClassName="active"><i className="fa fa-suitcase"></i>Products
                            </NavLink>
                        </li>) : ""}
                        {!userContext.user.isLoggedIn ? (<li className="nav-item">
                            <NavLink className="nav-link" to="/" activeClassName="active" exact={true}>Login</NavLink>
                        </li>) : ""}
                        {!userContext.user.isLoggedIn ? (<li className="nav-item">
                            <NavLink className="nav-link" to="/register" activeClassName="active">Register</NavLink>
                        </li>) : ""}
                        
                    </ul>
                    {userContext.user.isLoggedIn ? (<div style={{ marginRight:100 }}>
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-user circle"/>{userContext.user.currentUserName}
                                </NavLink>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><NavLink onClick={onLogoutClick} className="dropdown-item" to="#">Logout</NavLink></li>
                                </ul>
                            </li>
                        </ul>
                    </div>) : ""}
                </div>
        </nav>
    )
}

export default Navbar;