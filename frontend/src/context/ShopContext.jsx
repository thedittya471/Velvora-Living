import { createContext, useState, useEffect } from "react";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₨'
    const delivery_fee = 60;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [userLoading, setUserLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('token') || null)

    const API = "https://velvora-living-backend.vercel.app/api/v1";

    const authConfig = () => ({
        headers: { Authorization: `Bearer ${token}` }
    })

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
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Fetch current user whenever token changes
    useEffect(() => {
        if (token) {
            fetchCurrentUser()
        } else {
            setCurrentUser(null)
            setUserLoading(false)
        }
    }, [token])

    const fetchCurrentUser = async () => {
        try {
            setUserLoading(true)
            const res = await axios.get(`${API}/users/current-user`, authConfig())
            setCurrentUser(res?.data?.data || null)
        } catch (err) {
            console.error('Error fetching current user:', err)
            // token likely expired or invalid
            setCurrentUser(null)
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            setToken(null)
        } finally {
            setUserLoading(false)
        }
    }

    const value = {
        products,
        loading,
        error,
        currency,
        delivery_fee,
        currentUser,
        userLoading,
        token,
        setToken,
        fetchCurrentUser,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;