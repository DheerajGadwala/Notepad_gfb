import React from 'react';
import './style.css';

const MessageBox = (props)=>{

    const performAtionYES = ()=>{
        if( props.message==="Are you sure that you want to log out?" 
            ||
            props.message==="If you logout, the changes you made will not be saved. Are you sure you want to logout?"
            ){
            props.setUserID("");
            props.setUserEmail("");
            props.setData([]);
            props.setLoading(true);
            window.localStorage.removeItem('userID');
            window.localStorage.removeItem('userEmail');
        }
        clearMessage();
    }
    const clearMessage = ()=>{
        props.setMessage("");
        props.setMessageType(null);
    }
    return (
        <div className={props.message?"messageBox visibility":"messageBox"}>
            <div className="messageContainer">
                <div className="messageText">
                    {props.message}
                </div>
                <div className="answerContainer">
                    <div className={`messageButton ${props.messageType===1?"showButton":""}`} onClick={performAtionYES}>
                        <div>
                            YES
                        </div>
                    </div>
                    <div className={`messageButton ${props.messageType===1?"showButton":""}`} onClick={clearMessage}>
                        <div>
                            NO
                        </div>
                    </div>
                    <div className={`messageButton ${props.messageType===2?"showButton":""}`} onClick={clearMessage}>
                        <div>
                            OKAY
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageBox;