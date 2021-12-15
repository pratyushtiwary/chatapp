import Image from "next/image";
import { Typography, TextField } from "@material-ui/core";
import Divider from "./Divider";
import UserCard from "./UserCard";
import { APPNAME } from "../globals";
import styles from "../styles/components/SideBar.module.css";
import { useState } from "react";

let k = undefined;
export default function SideBar({ onUserCardClick, onSearch, onReset, hide, users }){
    const [searchVal,setSearchVal] = useState("");
        
    function Search(e){
        clearTimeout(k);
        let term = e.currentTarget.value;
        setSearchVal(term);
        if(term===""){
            k = setTimeout(()=>{
                onReset && onReset();
                clearTimeout(k);
            },1000);
        }
        else{
            k = setTimeout(()=>{
                onSearch && onSearch(term);
                clearTimeout(k);
            },1000);
        }
    }

    const userCardClick = (index) => () => {
        onUserCardClick && onUserCardClick(index);
    }

    return (
        <>
            {
                hide!==true && (
                    <div className={styles.sideBar}>
                        <div className={styles.branding}>
                            <Image
                                src="/logo.svg"
                                alt={APPNAME+" logo"}
                                width={50}
                                height={50}
                            />
                            <Typography variant="h3" className={styles.appname}>{APPNAME}</Typography>
                        </div>
                        <Divider/>
                        <TextField
                            type="search"
                            variant="outlined"
                            placeholder="Search..."
                            className={styles.searchInput}
                            value={searchVal}
                            onChange={Search}
                        />
                        <Divider/>
                        <div className={styles.users}>
                            {
                                users && users.map((user, index)=>(
                                    <UserCard
                                        data = {{
                                            ...user
                                        }}
                                        delay={index/10}
                                        key={index}
                                        index={index}
                                        onClick={userCardClick(index)}
                                    />
                                ))
                            }
                            {
                                !users && (
                                    <div className="error">
                                        <div
                                            className={"error-img "+styles.errorImg}
                                        >
                                            <Image
                                                src="/error/1.svg"
                                                layout="fill"
                                                alt="No Result Found"
                                            />
                                        </div>
                                        <Typography variant="h5" style={{color: "#FFFFFF"}} className="error-txt">No Result Found</Typography>
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>
                )
            }
        </>
    )
}