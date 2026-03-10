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

    // cart state
    const [cartItems, setCartItems] = useState([])
    const [cartLoading, setCartLoading] = useState(false)

    const API = "https://velvora-living-backend.vercel.app/api/v1";

    const authConfig = () => ({
        headers: { Authorization: `Bearer ${token}` }
    })

    // keep token persisted
    useEffect(() => {
        if (token) localStorage.setItem('token', token)
        else localStorage.removeItem('token')
    }, [token])

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API}/products/get-products`);
                setProducts(response?.data?.data?.products || []);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching products", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // Fetch current user + cart whenever token changes
    useEffect(() => {
        if (token) {
            fetchCurrentUser()
            fetchCart()
        } else {
            setCurrentUser(null)
            setCartItems([])
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
            setCurrentUser(null)
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            setToken(null)
        } finally {
            setUserLoading(false)
        }
    }

    // cart methods
    const fetchCart = async () => {
        if (!token) return
        try {
            setCartLoading(true)
            const res = await axios.get(`${API}/cart/get-cart`, authConfig())
            setCartItems(res?.data?.data?.items || [])
        } catch (err) {
            console.error('Error fetching cart:', err)
        } finally {
            setCartLoading(false)
        }
    }

    const addToCart = async (productId) => {
    if (!productId) {
        console.error('addToCart: productId missing')
        return
    }

    if (!token) {
        console.error('addToCart: user not logged in (token missing)')
        alert('Please login to add items to cart')
        return
    }

    try {
        const res = await axios.post(
            `${API}/cart/add-to-cart`,
            { productId },
            authConfig()
        )

        // backend returns full cart in data
        const items = res?.data?.data?.items || []
        setCartItems(items)

        // optional hard refresh from server
        await fetchCart()
    } catch (err) {
        console.error('Add to cart error:', err?.response?.data || err.message)
    }
}

    // quantity must be 1 or -1 (as per your backend)
    const updateCartItem = async (productId, quantity) => {
        if (!token) return
        try {
            const res = await axios.put(`${API}/cart/update-cart-item/${productId}`, { quantity }, authConfig())
            setCartItems(res?.data?.data?.items || [])
        } catch (err) {
            console.error('Update cart error:', err)
        }
    }

    const clearCart = async () => {
        if (!token) return
        try {
            const res = await axios.delete(`${API}/cart/clear-cart`, authConfig())
            setCartItems(res?.data?.data?.items || [])
        } catch (err) {
            console.error('Clear cart error:', err)
        }
    }

    const getCartCount = () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const getCartTotal = () => cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)

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

        cartItems,
        cartLoading,
        fetchCart,
        addToCart,
        updateCartItem,
        clearCart,
        getCartCount,
        getCartTotal
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;