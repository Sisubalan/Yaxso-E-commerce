import './Popular.css';
import Item from '../Item/Item';
import { useEffect, useState } from 'react';

const Popular = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const url = process.env.REACT_APP_API_URL || "https://yaxso-e-commerce-backend-neuf.onrender.com"; // Fallback to localhost if undefined

    useEffect(() => {
        if (!url) {
            console.error("API URL is missing! Check your .env file.");
            return;
        }

        fetch(`${url}/popularinwomen`) // Use template literals for better readability
            .then((response) => response.json())
            .then((data) => setPopularProducts(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [url]); // Dependency array includes `url` to re-run when it changes

    return (
        <div className="popular">
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className='popular-item'>
                {popularProducts.map((item, i) => (
                    <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        new_price={item.new_price}
                        old_price={item.old_price}
                    />
                ))}
            </div>
        </div>
    );
};

export default Popular;








// import './Popular.css'
// import Item from '../Item/Item'
// import { useEffect, useState } from 'react'

// const Popular = () =>{

//     const [popularProducts,setPopularProducts] = useState([]);
//     const url = process.env.REACT_APP_API_URL;

//     useEffect(()=>{
//         fetch(url+ "/popularinwomen")
//         .then((response)=>response.json())
//         .then((data)=>setPopularProducts(data));
//     },[])

//     return(
//         <div className="popular">
//             <h1>POPULAR IN WOMEN</h1>
//             <hr />
//             <div className='popular-item'>
//                 {popularProducts.map((item,i)=>{
//                     return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}></Item>
//                 })}
//             </div>
//         </div>
//     )
// }

// export default Popular