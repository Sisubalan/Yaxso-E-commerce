import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const API_URL = process.env.REACT_APP_API_URL || "https://yaxso-e-commerce-gijy.onrender.com";

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch(`${API_URL}/allproducts`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch products");
                return response.json();
            })
            .then((data) => setAllProducts(data))
            .catch((error) => console.error("Error fetching products:", error));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API_URL}/getcart`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) => console.error("Error fetching cart:", error));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API_URL}/addtocart`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            }).catch((error) => console.error("Error adding to cart:", error));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) }));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API_URL}/removefromcart`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            }).catch((error) => console.error("Error removing from cart:", error));
        }
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            if (quantity > 0) {
                const item = allProducts.find((product) => product.id === Number(itemId));
                return total + (item ? quantity * item.new_price : 0);
            }
            return total;
        }, 0);
    };

    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    };

    return (
        <ShopContext.Provider value={{ allProducts, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems }}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;





// import React, { createContext, useEffect, useState } from "react";


// export const ShopContext = createContext(null);
// const url = process.env.REACT_APP_API_URL || "http://localhost:4000";

// const getDefaultCart = () =>{
//     let cart = {};
//     for (let index = 0; index < 300+1; index++) {
//         cart[index] = 0;
//     }
//     return cart;
// }

// const ShopContextProvider = (props) => {

//     const [all_product,setAll_Product] = useState([]);

//     const [cartItems,setCartItems] = useState(getDefaultCart());

//     useEffect(()=>{
//         fetch(url +'/allproducts')
//         .then((response)=>response.json())
//         .then((data)=>setAll_Product(data))

//         if(localStorage.getItem('auth-token')){
//             fetch(url +'/getcart',{
//                 method:'POST',
//                 headers:{
//                     Accept:'application/form-data',
//                     'auth-token':`${localStorage.getItem('auth-token')}`,
//                     'Content-Type':'application/json',
//                 },
//                 body:"",
//             }).then((response)=>response.json())
//             .then((data)=>setCartItems(data));
//         }
//     },[])
    
    
//     const addToCart = (itemId) =>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
//         if(localStorage.getItem('auth-token')){
//             fetch(url +'/addtocart',{
//                 method:'POST',
//                 headers:{
//                     Accept:'application/form-data',
//                     'auth-token':`${localStorage.getItem('auth-token')}`,
//                     'Content-Type':'application/json',
//                 },
//                 body:JSON.stringify({"itemId":itemId})
//             })
//             .then((response)=>response.json())
//             .then((data)=>console.log(data));
//         }
//     }

//     const removeFromCart = (itemId) =>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
//         if(localStorage.getItem('auth-token')){
//             fetch(url +'/removefromcart',{
//                 method:'POST',
//                 headers:{
//                     Accept:'application/form-data',
//                     'auth-token':`${localStorage.getItem('auth-token')}`,
//                     'Content-Type':'application/json',
//                 },
//                 body:JSON.stringify({"itemId":itemId})
//             })
//             .then((response)=>response.json())
//             .then((data)=>console.log(data));

//         }
//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for(const item in cartItems)
//         {
//             if(cartItems[item]>0)
//             {
//                 let itemInfo = all_product.find((product)=>product.id===Number(item))
//                 totalAmount += cartItems[item] * itemInfo.new_price;
//             }
//         }
//         return totalAmount;
//     }

//     const getTotalCartItems = () =>{
//         let totalItem = 0;
//         for(const item in cartItems)
//         {
//             if(cartItems[item]>0)
//             {
//                 totalItem+= cartItems[item];
//             }
//         }
//         return totalItem
//     }

//     const contextValue = {all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems};
//     return (
//         <ShopContext.Provider value={contextValue}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider