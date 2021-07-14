import React, {useState, useEffect} from 'react';
import './style.css';
import loadingGIF from "./images/loading.gif";
import Facebook from './images/facebook.png';
import Gmail from './images/gmail.png';
import Email from './images/email.png';

const LoadingScreen = (props)=>{

    const [active, setActive] = useState("login");
    const [actionType, setActionType] = useState("email");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
    const [loginEmailError, setLoginEmailError] = useState("");
    const [loginPasswordError, setLoginPasswordError] = useState("");
    const [signupEmailError, setSignupEmailError] = useState("");
    const [signupPasswordError, setSignupPasswordError] = useState("");
    const [signupConfirmPasswordError, setSignupConfirmPasswordError] = useState("");

    const  validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const validatePassword = (password) =>{
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    const signUp = async ()=>{
        if(validateEmail(signupEmail) && signupPassword===signupConfirmPassword && validatePassword(signupPassword)){
            await props.firebaseAuth.createUserWithEmailAndPassword(signupEmail, signupPassword)
            .then((userCredential) => {
              var user = userCredential.user;
              props.setUserEmail(user.email);
              props.setUserID(user.uid);
              props.setLoading(false);
              window.localStorage.setItem('userID', user.uid);
              window.localStorage.setItem('userEmail', user.email);
            })
            .catch((error) => {
              setSignupEmailError("Email already exists.")
            });
        }
        else{
            if(!validateEmail(signupEmail)){
                setSignupEmailError("Invalid email address.")
            }
            if(signupPassword!==signupConfirmPassword){
                setSignupConfirmPasswordError("passwords do not match.")
            }
            if(!validatePassword(signupPassword)){
                setSignupPasswordError("password is too weak.");
            }
        }
    }

    const login = async ()=>{
        if(validateEmail(loginEmail)){
            await props.firebaseAuth.signInWithEmailAndPassword(loginEmail, loginPassword)
            .then((userCredential) => {
                var user = userCredential.user;
                props.setUserEmail(user.email);
                props.setUserID(user.uid);
                props.setLoading(false);
                window.localStorage.setItem('userID', user.uid);
                window.localStorage.setItem('userEmail', user.email);
            })
            .catch((error) => {
                var errorCode = error.code;
                if(errorCode==="auth/user-not-found"){
                    setLoginEmailError("Account does not exist.");
                }
                else if(errorCode==="auth/wrong-password"){
                    setLoginPasswordError("Wrong password.")
                }
            });
        }
        else{
            setLoginEmailError("Invalid email address.")
        }
    }

    const loginWithEmailLink = async ()=>{
        if(validateEmail(loginEmail)){

            var actionCodeSettings = {
                url: 'https://www.dheerajgadwala.tech/NotepadGFB/',
                handleCodeInApp: true
            };
            await props.firebaseAuth.sendSignInLinkToEmail(loginEmail, actionCodeSettings)
            .then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                //window.localStorage.setItem('userID', uid);
                //window.localStorage.setItem('userEmail', email);
                // ...
                window.localStorage.setItem('emailForSignIn', loginEmail);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error);
                // ...
            });
        }
        else{
            setLoginEmailError("Invalid email address.")
        }
    }

    const googleLogin = async()=>{
        let provider = new props.firebase.auth.GoogleAuthProvider();
        props.firebaseAuth.signInWithPopup(provider)
        .then((result) => {
            /** @type {props.firebaseAuth.OAuthCredential} */
            //var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            //var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            props.setUserEmail(user.email);
            props.setUserID(user.uid);
            props.setLoading(false);
            window.localStorage.setItem('userID', user.uid);
            window.localStorage.setItem('userEmail', user.email);
        }).catch((error) => {
            var errorCode = error.code;
            if(errorCode==="auth/account-exists-with-different-credential"){
                props.setMessageType(2);
                props.setMessage(error.email+" was registered by other service providers [Eg: facebook, email-password/link]. Try other methods to log in.");
            }
        });
    }

    const facebookLogin = async()=>{
        let provider = new props.firebase.auth.FacebookAuthProvider();
        props.firebaseAuth.signInWithPopup(provider)
        .then((result) => {
            /** @type {props.firebaseAuth.OAuthCredential} */
            //var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            //var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            props.setUserEmail(user.email);
            props.setUserID(user.uid);
            props.setLoading(false);
            console.log(user);
            window.localStorage.setItem('userID', user.uid);
            window.localStorage.setItem('userEmail', user.email);
          // ...
        }).catch((error) => {
            var errorCode = error.code;
            if(errorCode==="auth/account-exists-with-different-credential"){
                props.setMessageType(2);
                props.setMessage(error.email+" was registered by other service providers [Eg: gmail, email-password/link]. Try other methods to log in.");
            }
        });
    }
    return(
        <div className={(props.loading)?"loadingScreenContainer visibility":"loadingScreenContainer"}>
            <div className="loadingAnimationContainer">
                <div className="Intro">
                    <div className="IntroTitle">
                        NotePad
                    </div>
                    <div className="IntroBy">
                        By Dheeraj Gadwala 
                    </div>
                </div>
                <img src = {loadingGIF} className={`loadingAnimation ${props.userID?"visible":""}`}/>
                <div className={`loginSignupContainer ${!props.userID?"visible":""}`}>
                    <div className="loginSignupSelectors">
                        <div className={`titleSelector ${active==="login"?"active":""}`} onClick={()=>{setActive("login")}}>Login</div>
                        <div className={`titleSelector ${active==="signup"?"active":""}`} onClick={()=>{setActive("signup")}}>Signup</div>
                    </div>
                    <div className="ActionType">
                        <div className={`ActionTypeIcon ${actionType==="email"?"selectedActionTypeIcon":""}`} onClick={()=>{setActionType("email")}}>
                            <img src={Email}/>
                            <span>Email</span>
                        </div>
                        <div className={`ActionTypeIcon ${actionType==="facebook"?"selectedActionTypeIcon":""}`} onClick={()=>{setActionType("facebook"); facebookLogin()}}>
                            <img src={Facebook}/>
                            <span>Facebook</span>
                        </div>
                        <div className={`ActionTypeIcon ${actionType==="gmail"?"selectedActionTypeIcon":""}`} onClick={()=>{setActionType("gmail"); googleLogin()}}>
                            <img src={Gmail}/>
                            <span>Gmail</span>
                        </div>
                    </div>
                    <div className="formConatiner">
                        <div className={`loginForm Form ${active==="login"?"visibility":""}`}>
                            <div>
                                <input type="text" required onChange={(e)=>{setLoginEmailError("");setLoginEmail(e.target.value)}}/>
                                <span>Email</span>
                                <label>{loginEmailError}</label>
                            </div>
                            <div>
                                <input type="password" required onChange={(e)=>{setLoginPasswordError("");setLoginPassword(e.target.value)}}/>
                                <span>Password</span>
                                <label>{loginPasswordError}</label>
                            </div>
                            <div className="LoginButton" onClick={login}>
                                Login
                            </div>
                            <div className="LoginWithEmailLinkButton" onClick={loginWithEmailLink}>
                                Login with Email Link
                            </div>
                        </div>
                        <div className={`signupForm Form ${active==="signup"?"visibility":""}`}>
                            <div>
                                <input type="text" required onChange={(e)=>{setSignupEmailError("");setSignupEmail(e.target.value)}}/>
                                <span>Email</span>
                                <label>{signupEmailError}</label>
                            </div>
                            <div>
                                <input type="password" required onChange={(e)=>{setSignupPasswordError("");setSignupPassword(e.target.value)}}/>
                                <span>Password</span>
                                <label>{signupPasswordError}</label>
                            </div>
                            <div>
                                <input type="password" required onChange={(e)=>{setSignupConfirmPasswordError("");setSignupConfirmPassword(e.target.value)}}/>
                                <span>Confirm Password</span>
                                <label>{signupConfirmPasswordError}</label>
                            </div>
                            <div className="SignupButton" onClick={signUp}>
                                SignUp
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;