import { useEffect, useState } from "react";
import Item from "../Item/Item";
import "./NewCollection.css";

const API_URL = process.env.REACT_APP_API_URL || "https://yaxso-e-commerce-gijy.onrender.com";

const NewCollections = () => {
    const [newCollection, setNewCollection] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/newcollections`)
            .then((response) => response.json())
            .then((data) => setNewCollection(data))
            .catch((error) => console.error("Error fetching new collections:", error));
    }, []);

    return (
        <div className="newcollections">
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {newCollection.map((item, i) => (
                    <Item key={i} {...item} />
                ))}
            </div>
        </div>
    );
};

export default NewCollections;





// import { useEffect, useState } from 'react'
// import Item from '../Item/Item'
// import './NewCollection.css'

// const NewCollections = () => {

//     const [new_collection,setNew_collection] = useState([]);
//     const url = process.env.REACT_APP_API_URL || "http://localhost:4000";

//     useEffect(()=>{
//         if (!url) {
//             console.error("API URL is missing! Check your .env file.");
//             return;
//         }


//         fetch(`${url}/newcollections`)
//         .then((response)=>response.json())
//         .then((data)=>setNew_collection(data));
//     },[url]);

//     return (
//         <div className="newcollections">
//             <h1>NEW COLLECTIONS</h1>
//             <hr />
//             <div className="collections">
//                 {new_collection.map((item, i) => {
//                     return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}></Item>
//                 })}
//             </div>
//         </div>
//     )
// }

// export default NewCollections