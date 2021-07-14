import React, {useEffect, useState} from 'react';
import './style.css';
import Note from './note';

const Notes = (props)=>{

    const [ret, setRet] = useState([]);

    useEffect(()=>{
        
        let ret = [];
        let i=0;
        let toBeShown=[];

        const checkSearchValue = (val)=>{
            return val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        }

        let re, reCaps;
        if(props.searchData!==""){
            re = new RegExp(`(${checkSearchValue(props.searchData)})+(?![^<]*>)+(?![^&]*b*s*p*;)`, ""); //searchData but not in angular brackets
            reCaps = new RegExp(`(${checkSearchValue(props.searchData)})+(?![^<]*>)+(?![^&]*b*s*p*;)`, "i");
        }
        
        while(i<props.data.length){            
            if
            (
                (
                    (
                        props.searchFilterData==="All" 
                        && 
                        (   props.searchData===""
                            ||
                            reCaps.test(props.data[i]) 
                            || 
                            re.test(props.data[i+1])
                        )
                    )//if filter data is 'All' then search in both titles and content 
                    ||
                    (
                        props.searchFilterData==="Titles" 
                        && 
                        (
                            props.searchData===""
                            ||
                            reCaps.test(props.data[i])
                        )
                        
                    )//if filter data is 'Titles' then search in titles 
                    ||
                    (
                        props.searchFilterData==="Content" 
                        && 
                        (
                            props.searchData===""
                            ||
                            re.test(props.data[i+1])
                        )
                    )//if filter data is 'Content' then search in content
                ) 
                &&
                props.colorsFilterData[parseInt(props.data[i+2])] //check if color is present in filtered colors
            )
            {
                ret.push(
                    <Note
                    key = {i/3}
                    id = {i}
                    data = {props.data}
                    setData = {props.setData}
                    loading = {props.loading}
                    changes = {props.changes}
                    setChanges = {props.setChanges}
                    displayIDs = {props.displayIDs}
                    setDisplayIDs = {props.setDisplayIDs}
                    searchData = {props.searchData}
                    noChangesOnBlur = {props.noChangesOnBlur}
                    setNoChangesOnBlur = {props.setNoChangesOnBlur}

                    />
                );
                toBeShown.push(i);
            }
            i+=3;
        }
        setRet(ret);
        if(toBeShown.length === props.displayIDs.length){
            for(var j=0; j<toBeShown.length; j++){
                if(toBeShown[j]!==props.displayIDs[j]){
                    props.setDisplayIDs(toBeShown);
                }
            }
        }
        else{
            props.setDisplayIDs(toBeShown);
        }
    }, [props.searchFilterData, props.colorsFilterData, props.data, props.loading, props.displayIDs, props.searchData]);

    return (
    <div className="notesArea">
        {ret}
    </div>
    );
}

export default Notes;