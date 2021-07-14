import React, {useState, useEffect} from "react";
import Firebase from "firebase";
import SearchBar from "./components/searchBar";
import Notes from "./components/notes";
import LoadingScreen from "./components/loadingScreen";
import MessageBox from "./components/messageBox";
import "./App.css";

 const App = ()=>{
      
    const [userEmail, setUserEmail] = useState("");
    const [userID, setUserID] = useState("");
    const [changes, setChanges] = useState(false);
    const [noChangesOnBlur, setNoChangesOnBlur] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchFilterData, setSearchFilterData] = useState("All");
    const [colorsFilterData, setColorsFilterData] = useState([true, true, true, true, true]);
    const [searchData, setSearchData] = useState("");
    const [displayIDs, setDisplayIDs] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(null);
    const [firebase, setFirebase] = useState(null);
    const [firebaseDB, setFirebaseDB] = useState(null);
    const [firebaseAuth, setFirebaseAuth] = useState(null);

    useEffect(() => {
        (async ()=>{
            const firebaseConfig = {
                apiKey: "AIzaSyCNQ_e6alAUWBcTz7aijZMv5-_RX02USgA",
                authDomain: "notepad-1ddc2.firebaseapp.com",
                projectId: "notepad-1ddc2",
                storageBucket: "notepad-1ddc2.appspot.com",
                messagingSenderId: "389051681727",
                appId: "1:389051681727:web:f2fbaa831c9aa49432af0a",
                measurementId: "G-QT7YCSTFZ4"
            };
            await Firebase.initializeApp(firebaseConfig);
            await setFirebaseDB(Firebase.firestore());
            await setFirebaseAuth(Firebase.auth());
            setFirebase(Firebase);
            setUserEmail(window.localStorage.getItem('userEmail'));
            setUserID(window.localStorage.getItem('userID'));
            // Confirm the link is a sign-in with email link.
            if (Firebase.auth().isSignInWithEmailLink(window.location.href)) {
                var email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                email = window.prompt('Please provide your email for confirmation');
                }
                Firebase.auth().signInWithEmailLink(email, window.location.href)
                .then((result) => {
                    window.localStorage.removeItem('emailForSignIn');
                    var user = result.user;
                    setUserEmail(user.email);
                    setUserID(user.uid);
                    setLoading(false);
                    window.localStorage.setItem('userID', user.uid);
                    window.localStorage.setItem('userEmail', user.email);
                })
                .catch((error) => {

                });
            }
        })();
    }, []);

    useEffect(()=>{
        (async ()=>{
            if(userID){
                setLoading(true);
                let docRef = firebaseDB.collection("Users").doc(userID);
                await docRef.get().then((doc) => {
                    if (doc.exists) {
                        setData(doc.data().data);
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
                setLoading(false);
            }
        })();

    }, [userID]);

    return (
        <div className="notePadArea">
            <LoadingScreen
                loading = {loading}
                setLoading = {setLoading}
                firebaseAuth = {firebaseAuth}
                setUserEmail = {setUserEmail}
                userID = {userID}
                setUserID = {setUserID}
                firebase = {firebase}
                setMessage = {setMessage}
                setMessageType = {setMessageType}
            />
            <MessageBox
                message={message}
                setMessage = {setMessage}
                messageType = {messageType}
                setMessageType = {setMessageType}
                setUserEmail = {setUserEmail}
                userID = {userID}
                setUserID = {setUserID}
                setLoading = {setLoading}
                setData = {setData}
                changes = {changes}
            />
            <SearchBar
                data = {data}
                setData = {setData}
                loading = {loading}
                setLoading = {setLoading}
                changes = {changes}
                setChanges = {setChanges}
                searchFilterData = {searchFilterData}
                setSearchFilterData = {setSearchFilterData}
                colorsFilterData = {colorsFilterData}
                setColorsFilterData = {setColorsFilterData}
                searchData = {searchData}
                setSearchData = {setSearchData}
                displayIDs = {displayIDs}
                setDisplayIDs = {setDisplayIDs}
                noChangesOnBlur = {noChangesOnBlur}
                setNoChangesOnBlur = {setNoChangesOnBlur}
                message = {message}
                setMessage = {setMessage}
                setMessageType = {setMessageType}
                firebaseDB = {firebaseDB}
                userID = {userID}
                setUserID = {setUserID}
                setUserEmail = {setUserEmail}
            />
            <Notes
                loading = {loading}
                setLoading = {setLoading}
                data = {data}
                setData = {setData}
                changes = {changes}
                setChanges = {setChanges}
                searchFilterData = {searchFilterData}
                colorsFilterData = {colorsFilterData}
                searchData = {searchData}
                displayIDs = {displayIDs}
                setDisplayIDs = {setDisplayIDs}
                noChangesOnBlur = {noChangesOnBlur}
                setNoChangesOnBlur = {setNoChangesOnBlur}
            />
        </div>
    );
}

export default App;
