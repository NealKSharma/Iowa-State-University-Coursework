// Neal Kaushik Sharma
// nea1@iastate.edu

import React, { useState, useEffect } from "react";
import items from "./data/fashion.json";

const Shop = () => {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const addToCart = (el) => {
        setCart([...cart, el]);
    };

    const removeFromCart = (el) => {
        let itemFound = false;
        const updatedCart = cart.filter((cartItem) => {
            if (cartItem._id === el._id && !itemFound) {
                itemFound = true;
                return false;
            }
            return true;
        });
        if (itemFound) {
            setCart(updatedCart);
        }
    }

    const cartItem = cart.map((el) => (
        <div key={el._id}>
            <img class="img-fluid" src={el.image} width={150} />
            {el.title}
            ${el.price}
        </div>
    ));

    const listItems = items.map((el) => (
        <div key={el._id}>
            <img class="img-fluid" src={el.image} width={150} /> <br />
            {el.title} <br />
            {el.category} <br />
            {el.price} <br />
            <button type="button" onClick={() => removeFromCart(el)}>-</button>{" "}
            <button type="button" variant="light" onClick={() => addToCart(el)}> + </button>
        </div>
    ));

    useEffect(() => {
        total();
    }, [cart]);

    const total = () => {
        let totalVal = 0;
        for (let i = 0; i < cart.length; i++) {
            totalVal += cart[i].price;
        }
        setCartTotal(totalVal);
    };

    return (
        <div>
            <div>{listItems}</div>
            <h1>Items in Cart :</h1>
            <div>{cartItem}</div>
            <h1>Order total to pay :${cartTotal}</h1>
        </div>
    );
}

export default Shop;