import React, {useRef, useState, useEffect} from 'react';
import './style.css';
import search from './images/search.png';
import save from './images/save.png';

const SearchBar = (props)=>{

    const searchBarRef = useRef(null);
    const navigateUpRef = useRef(null);
    const addNoteRef = useRef(null);
    const saveRef = useRef(null);

    const [dropDownOpen, setDropDownOpen] = useState(false);

    document.onclick = (e)=>{
        if( !
            (   
                e.target.classList.contains("option")
                ||
                e.target.classList.contains("dropDownArrowContainer")
                ||
                e.target.classList.contains("searchByFilter")
            )
            &&
            dropDownOpen)
            dropDownToggle();
    }

    window.onscroll = ()=>{
        if(!navigateUpRef.current.classList.contains("navigateUpVisibility") && window.pageYOffset >= 85){
            navigateUpRef.current.style.animation = "addNavigateUp 0.5s";
            addNoteRef.current.style.animation = "addNoteMoveLeft 0.5s";
            saveRef.current.style.animation = "saveMoveLeft 0.5s";  
            navigateUpRef.current.classList.add("navigateUpVisibility");
            addNoteRef.current.classList.add("addNotePosition");
            saveRef.current.classList.add("savePosition");
        }
        else if(navigateUpRef.current.classList.contains("navigateUpVisibility") && window.pageYOffset < 85){
            navigateUpRef.current.style.animation = "removeNavigateUp 0.5s"; 
            addNoteRef.current.style.animation = "addNoteMoveRight 0.5s";
            saveRef.current.style.animation = "saveMoveRight 0.5s";
            navigateUpRef.current.classList.remove("navigateUpVisibility");
            addNoteRef.current.classList.remove("addNotePosition");
            saveRef.current.classList.remove("savePosition");
        }
    }

    const addNote = ()=>{
        if(!props.loading){
            let data = [...props.data];
            data.push("Title");
            data.push("Notes");
            data.push("0");
            props.setData(data);
            props.setChanges(true);
        }
    }

    const logout = ()=>{
        if(props.changes)
            {
                props.setMessageType(1);
                props.setMessage("If you logout, the changes you made will not be saved. Are you sure you want to logout?");
            }
        else
            {
                props.setMessageType(1);
                props.setMessage("Are you sure that you want to log out?");
            }
    }

    const saveData = async ()=>{
        if(props.changes && !props.loading){
            props.setLoading(true);
            props.setChanges(false);
            await props.firebaseDB.collection("Users").doc(props.userID).set({data: props.data})
            .then(() => {
            }).catch((error) => {
                console.log(error);
                props.setChanges(true);
                props.setMessageType(2);
                props.setMessage("Data was not saved: "+error.message);
            });
            props.setLoading(false);
        }
    }

    const dropDownToggle = ()=>{
        var o1 = document.getElementById("option1");
        var o2 = document.getElementById("option2");
        var o3 = document.getElementById("option3");
        if(!o1.classList.contains("option1")){
            o1.style.animation = "option1OpenAnimate 0.5s ease-in";
            o2.style.animation = "option2OpenAnimate 0.5s ease-in";
            o3.style.animation = "option3OpenAnimate 0.5s ease-in";
            document.getElementById("option1").classList.toggle('option1');
            document.getElementById("option2").classList.toggle('option2');
            document.getElementById("option3").classList.toggle('option3');
            setDropDownOpen(true);
        }
        else{
            o1.style.animation = "option1CloseAnimate 0.5s ease-in";
            o2.style.animation = "option2CloseAnimate 0.5s ease-in";
            o3.style.animation = "option3CloseAnimate 0.5s ease-in";
            document.getElementById("option1").classList.toggle('option1');
            document.getElementById("option2").classList.toggle('option2');
            document.getElementById("option3").classList.toggle('option3');
            setDropDownOpen(false);
        }
    }

    const setColours = (e)=>{
        const id = parseInt(e.target.id[e.target.id.length-1]);
        const tempTargetClassList = e.target.classList;
        const tempColorData = [...props.colorsFilterData];
        tempColorData[id] = !tempColorData[id];
        tempTargetClassList.toggle("notSelected");
        props.setColorsFilterData(tempColorData);
    }

    const checkSearchValue = (val)=>{
        return val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    }
    const highlight = ()=>{
        props.setSearchData(document.querySelector("#searchBar").value);
        let searchValue = document.querySelector("#searchBar").value.trim();
        let searchValueWithEscapes = checkSearchValue(searchValue);
        if(searchValue!==""){
            document.querySelectorAll(".note").forEach(note=>{
                let id = parseInt(note.id);
                let title = document.querySelector("#titleInput"+id);
                let content = document.querySelector("#contentInput"+id);
                let reTitle = new RegExp(`(${searchValueWithEscapes})+(?![^<]*>)+(?![^&]*b*s*p*;)`, "gi");
                let reContent = new RegExp(`(${searchValueWithEscapes})+(?![^<]*>)+(?![^&]*b*s*p*;)`, "g");
                let stateTitle = props.data[id];
                let stateContent = props.data[id+1];
                let highlightedTitle, highlightedContent;
                if(props.searchFilterData==="All"){
                    highlightedTitle = stateTitle.replaceAll(reTitle, `<mark>${searchValue}</mark>`);
                    highlightedContent = stateContent.replaceAll(reContent, `<mark>${searchValue}</mark>`);
                    title.innerHTML = highlightedTitle;
                    content.innerHTML = highlightedContent;

                }
                else if(props.searchFilterData==="Titles"){
                    highlightedTitle = stateTitle.replace(reTitle, `<mark>${searchValue}</mark>`);
                    title.innerHTML = highlightedTitle;
                    document.querySelector("#contentInput"+id).innerHTML = props.data[id+1];
                }
                else if(props.searchFilterData==="Content"){
                    highlightedContent = stateContent.replace(reContent, `<mark>${searchValue}</mark>`);
                    content.innerHTML = highlightedContent;
                    document.querySelector("#titleInput"+id).innerHTML = props.data[id];
                }
            });
        }
        else{
            document.querySelectorAll(".note").forEach(note=>{
                let id = parseInt(note.id);
                document.querySelector("#titleInput"+id).innerHTML = props.data[id];
                document.querySelector("#contentInput"+id).innerHTML = props.data[id+1];
            });
        }
    }

    useEffect(()=>{
        highlight();
        props.setNoChangesOnBlur(false);
    }, [props]);

    return (
    <>
        <div className="searchBarArea" ref={searchBarRef}>
            <div className="searchBarAndFiltersContainer">
                <div className = "searchByFilterContainer">
                    <div className = "searchByFilter" onClick={dropDownToggle}>
                        Filter : {props.searchFilterData}
                    </div>
                    <div className = "dropDownArrowContainer" onClick={dropDownToggle}>
                        <div className="bar1 hov"></div>
                        <div className="bar2 hov"></div>
                        <div className="bar3 hov"></div>
                    </div>
                    <div className="option" id="option1" onClick={()=>{props.setSearchFilterData("All"); dropDownToggle();}}>All</div>
                    <div className="option" id="option2" onClick={()=>{props.setSearchFilterData("Titles"); dropDownToggle();}}>Titles</div>
                    <div className="option" id="option3" onClick={()=>{props.setSearchFilterData("Content"); dropDownToggle();}}>Content</div>
                </div>
                <div className="searchBarBox">
                    <input className="searchBar" id="searchBar" placeholder="Search" type="text" onChange={highlight}/>
                    <div className="iconContainer" onClick={()=>{document.querySelector("#searchBar").focus()}}>
                        <img className="searchIcon" src={search}/>
                    </div>
                </div>
                <div className="colorBoxes">
                    <div className="colorBox" onClick={setColours} id="c0">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                    <div className="colorBox" onClick={setColours} id="c1">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                    <div className="colorBox" onClick={setColours} id="c2">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                    <div className="colorBox" onClick={setColours} id="c3">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                    <div className="colorBox" onClick={setColours} id="c4">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                </div>
                <div className="logoutButton" onClick={logout}>
                    Logout
                </div>
            </div>
        </div>
        <div className="navigateUp" ref={navigateUpRef} onClick={()=>{window.scrollTo({top:0, left:0, behavior:'smooth'})}}>
            <div className="navigateUpLeftBar">
            </div>
            <div className="navigateUpRightBar">
            </div>
            <div className="navigateUpBottomBar">
            </div>
        </div>
        <div className={props.loading?window.pageYOffset>85?"addNote addNotePosition disabled":"addNote disabled":window.pageYOffset>85?"addNote addNotePosition":"addNote"} ref={addNoteRef} onClick = {addNote}>
            <div className="addNoteVerticalBar">
            </div>
            <div className="addNoteHorizontalBar">
            </div>
        </div>
        <div className={props.changes?window.pageYOffset>85?"save savePosition":"save":window.pageYOffset>85?"save noChanges savePosition":"save noChanges"} ref={saveRef} onClick = {saveData}>
            <img className="saveIcon" src={save}/>
        </div>
    </>
    );
}

export default SearchBar;