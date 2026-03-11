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

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('accessToken') || null)
    const [refreshToken, setRefreshToken] = useState(() => sessionStorage.getItem('refreshToken') || null)

    // cart state
    const [cartItems, setCartItems] = useState([])
    const [cartLoading, setCartLoading] = useState(false)

    const API = "https://velvora-living-backend.vercel.app/api/v1";

    const authConfig = (tokenOverride = null) => ({
        withCredentials: true,
        ...((tokenOverride || accessToken) ? { headers: { Authorization: `Bearer ${tokenOverride || accessToken}` } } : {})
    })

    const setSessionTokens = (nextAccessToken, nextRefreshToken) => {
        const access = nextAccessToken || null
        const refresh = nextRefreshToken || null

        setAccessToken(access)
        setRefreshToken(refresh)

        if (access) sessionStorage.setItem('accessToken', access)
        else sessionStorage.removeItem('accessToken')

        if (refresh) sessionStorage.setItem('refreshToken', refresh)
        else sessionStorage.removeItem('refreshToken')
    }

    const refreshAccessToken = async (refreshTokenOverride = null) => {
        try {
            const tokenToUse = refreshTokenOverride || refreshToken
            const payload = tokenToUse ? { refreshToken: tokenToUse } : {}
            const res = await axios.post(`${API}/users/refresh-token`, payload, authConfig())
            const newAccessToken = res?.data?.data?.accessToken || null
            const newRefreshToken = res?.data?.data?.refreshToken || tokenToUse || null

            if (!newAccessToken) return null

            setSessionTokens(newAccessToken, newRefreshToken)
            return newAccessToken
        } catch {
            return null
        }
    }

    const requestWithAuthRetry = async (requestFn, refreshTokenOverride = null) => {
        try {
            return await requestFn()
        } catch (err) {
            if (err?.response?.status !== 401) {
                throw err
            }

            const canTryRefresh = Boolean(isAuthenticated || currentUser || refreshToken || refreshTokenOverride)
            if (!canTryRefresh) {
                throw err
            }

            const refreshed = await refreshAccessToken(refreshTokenOverride)
            if (!refreshed) {
                throw err
            }

            return await requestFn()
        }
    }

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

    // Bootstrap auth state from backend cookie session
    useEffect(() => {
        const initAuth = async () => {
            if (!accessToken && !refreshToken) {
                setCurrentUser(null)
                setIsAuthenticated(false)
                setUserLoading(false)
                return
            }

            const user = await fetchCurrentUser()
            if (user) {
                await fetchCart()
            }
        }
        initAuth()
    }, [])

    const fetchCurrentUser = async (tokenOverride = null, refreshTokenOverride = null) => {
        try {
            setUserLoading(true)
            const res = await requestWithAuthRetry(
                () => axios.get(`${API}/users/current-user`, authConfig(tokenOverride)),
                refreshTokenOverride
            )
            const user = res?.data?.data || null
            setCurrentUser(user)
            setIsAuthenticated(Boolean(user))
            return user
        } catch (err) {
            if (err?.response?.status !== 401) {
                console.error('Error fetching current user:', err)
            }
            setCurrentUser(null)
            setIsAuthenticated(false)
            setSessionTokens(null, null)
            return null
        } finally {
            setUserLoading(false)
        }
    }

    // cart methods
    const fetchCart = async (tokenOverride = null, refreshTokenOverride = null) => {
        try {
            setCartLoading(true)
            const res = await requestWithAuthRetry(
                () => axios.get(`${API}/cart/get-cart`, authConfig(tokenOverride)),
                refreshTokenOverride
            )
            setCartItems(res?.data?.data?.items || [])
        } catch (err) {
            console.error('Error fetching cart:', err)
            setCartItems([])
        } finally {
            setCartLoading(false)
        }
    }

    const refreshAuthState = async (tokenOverride = null, refreshTokenOverride = null) => {
        const user = await fetchCurrentUser(tokenOverride, refreshTokenOverride)
        if (user) {
            await fetchCart(tokenOverride, refreshTokenOverride)
        } else {
            setCartItems([])
        }
    }

    const clearAuthState = () => {
        setCurrentUser(null)
        setIsAuthenticated(false)
        setSessionTokens(null, null)
        setCartItems([])
    }

    const getProductStock = (productId) => {
        if (!productId) return null

        const normalizedId = typeof productId === 'object' ? productId?._id : productId
        const product = products.find((item) => item?._id === normalizedId)
        if (product?.stock === undefined || product?.stock === null) return null

        return Number(product.stock)
    }

    const getCartItemQuantity = (productId) => {
        if (!productId) return 0

        const normalizedId = typeof productId === 'object' ? productId?._id : productId
        const cartItem = cartItems.find((item) => {
            const itemProductId = typeof item?.product === 'object' ? item?.product?._id : item?.product
            return itemProductId === normalizedId
        })

        return Number(cartItem?.quantity || 0)
    }

    const isProductOutOfStock = (productId, fallbackStock = null) => {
        const availableStock = fallbackStock ?? getProductStock(productId)
        if (availableStock === null || Number.isNaN(Number(availableStock))) return false
        if (availableStock <= 0) return true

        return getCartItemQuantity(productId) >= availableStock
    }

    const addToCart = async (productId) => {
    if (!productId) {
        console.error('addToCart: productId missing')
        return
    }

    if (!isAuthenticated) {
        console.error('addToCart: user not logged in')
        alert('Please login to add items to cart')
        return
    }

    try {
        const res = await requestWithAuthRetry(() =>
            axios.post(
                `${API}/cart/add-to-cart`,
                { productId },
                authConfig()
            )
        )

        // backend returns full cart in data
        const items = res?.data?.data?.items || []
        setCartItems(items)

        // optional hard refresh from server
        await fetchCart()
    } catch (err) {
        console.error('Add to cart error:', err?.response?.data || err.message)
        const message = err?.response?.data?.message
        if (message) {
            alert(message)
        }
    }
}

    // quantity must be 1 or -1 (as per your backend)
    const updateCartItem = async (productId, quantity) => {
        if (!isAuthenticated) return
        try {
            const res = await requestWithAuthRetry(() =>
                axios.put(`${API}/cart/update-cart-item/${productId}`, { quantity }, authConfig())
            )
            setCartItems(res?.data?.data?.items || [])
        } catch (err) {
            console.error('Update cart error:', err)
            const message = err?.response?.data?.message
            if (message) {
                alert(message)
            }
        }
    }

    const clearCart = async () => {
        if (!isAuthenticated) return
        try {
            const res = await requestWithAuthRetry(() => axios.delete(`${API}/cart/clear-cart`, authConfig()))
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

        isAuthenticated,
        accessToken,
        setIsAuthenticated,
        setSessionTokens,
        refreshAccessToken,
        fetchCurrentUser,
        refreshAuthState,
        clearAuthState,

        cartItems,
        cartLoading,
        fetchCart,
        addToCart,
        updateCartItem,
        clearCart,
        getCartCount,
        getCartTotal,
        getProductStock,
        getCartItemQuantity,
        isProductOutOfStock
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;