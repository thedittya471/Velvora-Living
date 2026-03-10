import { createContext, useState, useEffect } from "react";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₨'
    const delivery_fee = 60;


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://velvora-living-backend.vercel.app/api/v1/products/get-products');
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
        currency,
        delivery_fee
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;