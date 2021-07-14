import React, {useState, useEffect} from 'react';
import './style.css';
import coloursImage from './images/colours.png';
import deleteImage from './images/delete.png';
import leftImage from './images/left.png';
import rightImage from './images/right.png';

const Note = (props)=>{

    // const [title, setTitle] = useState("");
    // const [content, setContent] = useState("");
    const [colour, setColour] = useState(0);

    useEffect(()=>{
        document.querySelector("#titleInput"+props.id).innerHTML = props.data[props.id];
        document.querySelector("#contentInput"+props.id).innerHTML = props.data[props.id+1];
        setColour(parseInt(props.data[props.id+2]));
        props.setNoChangesOnBlur(true);
    }, []);

    useEffect(()=>{
        setColour(parseInt(props.data[props.id+2]));
    }, [props]);

    // useEffect(()=>{
    //     // setTitle(props.data[props.id]);
    //     //setContent(props.data[props.id+1]);
    // }, []);

    const helper = (delay)=>{
        return new Promise (resolve=>{
            setTimeout(()=>{

                resolve();
            }, delay);
        });
    }
    const setTitle = (e)=>{
        e.target.innerHTML = props.data[props.id];
    }
    const titleChange = (e)=>{
        if(!props.loading && e.target.innerHTML!=props.data[props.id]){
            props.setChanges(true);
            //setTitle(e.target.innerHTML);
            let data = [...props.data];
            data[props.id] = e.target.innerHTML;
            props.setData(data);
        }
        else if(e.target.innerHTML===props.data[props.id]){
            props.setNoChangesOnBlur(true);
        }
    }
    const setContent = (e)=>{
        e.target.innerHTML = props.data[props.id+1];
    }
    const contentChange = (e)=>{
        if(!props.loading && e.target.innerHTML!==props.data[props.id+1]){
            props.setChanges(true);
            //setContent(e.target.value);
            let data = [...props.data];
            data[props.id+1] = e.target.innerHTML;
            props.setData(data);
        }
        else if(e.target.innerHTML===props.data[props.id+1]){
            props.setNoChangesOnBlur(true);
        }
    }
    const colourChange = ()=>{
        if(!props.loading){
            props.setChanges(true);
            setColour((colour+1)%5);
            let data = [...props.data];
            data[props.id+2] = ""+(colour+1)%5;
            props.setData(data);
        }
    }
    const deleteNote = async (e)=>{
        if(!props.loading){
            document.getElementById(props.id).classList.add('deleting');
            await helper(500);
            document.getElementById(props.id).classList.remove("deleting");
            props.setChanges(true);
            let data = [...props.data];
            data.splice(props.id, 3);
            props.setData(data);
        }
    }

    const move = (obj, targetX, targetY)=>{
        return new Promise((resolve)=>{
            var left = 0;
            var top = 0;
            var cnt = 0;
            var id = setInterval(()=>{
                if(Math.round(left)!==targetX)
                    left = targetX*((cnt*cnt)/(2*(cnt*cnt-cnt)+1)); // https://stackoverflow.com/questions/13462001/ease-in-and-ease-out-animation-formula
                if(Math.round(top)!==targetY)                        //parametric function from Creak's answer => sqt/(2*(sqt-t)+1) where sqt = t^2;
                    top = targetY*((cnt*cnt)/(2*(cnt*cnt-cnt)+1));
                obj.style.left = left + 'px';
                obj.style.top = top + 'px';
                cnt+=0.005;
                if((Math.round(left)===targetX)&&(Math.round(top)===targetY)){
                        clearInterval(id);
                        resolve();
                    }
            }, 1);
        });
    }

    const moveRight = ()=>{
        let currentNote = props.displayIDs.indexOf(props.id);
        if(!props.loading && currentNote+1!==props.displayIDs.length){
            let rightNote = props.displayIDs[currentNote+1];
            props.setChanges(true);
            let data = [...props.data];
            let temp;
            temp = data[props.id];
            data[props.id] = data[rightNote];
            data[rightNote] = temp;
            temp = data[props.id+1];
            data[props.id+1] = data[rightNote+1];
            data[rightNote+1] = temp;
            temp = data[props.id+2];
            data[props.id+2] = data[rightNote+2];
            data[rightNote+2] = temp;
            let divA = document.getElementById(""+props.id);
            let divB = document.getElementById(""+(rightNote));
            Promise.all([   move(divA, divB.offsetLeft-divA.offsetLeft, divB.offsetTop-divA.offsetTop), 
                            move(divB, divA.offsetLeft-divB.offsetLeft, divA.offsetTop-divB.offsetTop)
                        ]).then((values) => {
                props.setData(data);
                // document.querySelector("#titleInput"+props.id).innerHTML = data[props.id];
                // document.querySelector("#titleInput"+rightNote).innerHTML = data[rightNote];
                // document.querySelector("#contentInput"+(props.id)).innerHTML = data[props.id+1];
                // document.querySelector("#contentInput"+(rightNote)).innerHTML = data[rightNote+1];
                divA.style.top=0;
                divA.style.left=0;
                divB.style.top=0;
                divB.style.left=0;
                let tempArr = [...props.displayIDs];
                tempArr[currentNote] +=tempArr[rightNote];
                tempArr[rightNote] = tempArr[currentNote]-tempArr[rightNote];
                tempArr[currentNote] -=tempArr[rightNote];
                props.setDisplayIDs(tempArr);
            }); 
        }
    }
    const moveLeft = ()=>{
        let currentNote = props.displayIDs.indexOf(props.id);
        if(!props.loading && currentNote!==0){
            let leftNote = props.displayIDs[currentNote-1];
            props.setChanges(true);
            let data = [...props.data];
            let temp;
            temp = data[props.id];
            data[props.id] = data[leftNote];
            data[leftNote] = temp;
            temp = data[props.id+1];
            data[props.id+1] = data[leftNote+1];
            data[leftNote+1] = temp;
            temp = data[props.id+2];
            data[props.id+2] = data[leftNote+2];
            data[leftNote+2] = temp;
            let divA = document.getElementById(""+props.id);
            let divB = document.getElementById(""+(leftNote));
            Promise.all([   move(divA, divB.offsetLeft-divA.offsetLeft, divB.offsetTop-divA.offsetTop), 
                            move(divB, divA.offsetLeft-divB.offsetLeft, divA.offsetTop-divB.offsetTop)
                        ]).then((values) => {
                props.setData(data);
                // document.querySelector("#titleInput"+props.id).innerHTML = data[props.id];
                // document.querySelector("#titleInput"+leftNote).innerHTML = data[leftNote];
                // document.querySelector("#contentInput"+(props.id)).innerHTML = data[props.id+1];
                // document.querySelector("#contentInput"+(leftNote)).innerHTML = data[leftNote+1];
                divA.style.top=0;
                divA.style.left=0;
                divB.style.top=0;
                divB.style.left=0;
                let tempArr = [...props.displayIDs];
                tempArr[currentNote] +=tempArr[leftNote];
                tempArr[leftNote] = tempArr[currentNote]-tempArr[leftNote];
                tempArr[currentNote] -=tempArr[leftNote];
                props.setDisplayIDs(tempArr);
            }); 
        }
    }

    return(
    <div className="note" colour = {colour} id={props.id}>
        <div className="icons">
            <div>
                <img className={props.loading?"deleteImage loadingEnabledImages":"deleteImage"} src={deleteImage} onClick={deleteNote}/>
            </div>
            <div>
                <img className={props.loading?"leftImage loadingEnabledImages":"leftImage"} src={leftImage} onClick={moveLeft}/>
            </div>
            <div>
                <img className={props.loading?"rightImage loadingEnabledImages":"rightImage"} src={rightImage} onClick={moveRight}/>
            </div>
            <div>
                <img className={props.loading?"coloursImage loadingEnabledImages":"coloursImage"} src={coloursImage} onClick={colourChange}/>
            </div>
        </div>
        <div className="noteTitle">
            {/* <input type="text" className="titleInput" colour = {colour} value={title} onChange={titleChange}/> */}
            <div className="titleInput Input" colour = {colour} contentEditable="true" spellCheck="false" onFocus={setTitle} onBlur={titleChange} id={"titleInput"+props.id}></div>
        </div>
        <div className="bar">
        </div>
        <div className="noteContent">
            {/* <textarea className="contentInput" colour = {colour} value={content} onChange={contentChange}/> */}
            <div className="contentInput Input" colour = {colour} contentEditable="true" spellCheck="false" onFocus={setContent} onBlur={contentChange} id={"contentInput"+props.id}></div>
        </div>
    </div>
    );
}

export default Note;