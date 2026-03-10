import { createContext, useState, useEffect } from "react";
import axios from 'axios'


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₨'
    const delivery_fee = 60;


    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const API = "https://velvora-living-backend.vercel.app/api/v1";

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API}/products/get-products`);
                setProducts(response.data.data.products);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching products", error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const value = {
        products,
        loading,
        error,
        currency
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}



export default ShopContextProvider;