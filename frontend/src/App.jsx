import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Wishlist from './pages/Wishlist'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './utils/ProtectedRoute'
 
const App = () => {
  return (
    <div className='px-4 sm:px[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <Routes>

          <Route path='/' element={ <Home /> } />
          <Route path='/collection' element={ <Collection /> } />
          <Route path='/about' element={ <About /> } />
          <Route path='/wishlist' element={ <ProtectedRoute><Wishlist /></ProtectedRoute> } />
          <Route path='/contact' element={ <Contact /> } />
          <Route path='/product/:productId' element={ <Product /> } />
          <Route path='/cart' element={ <ProtectedRoute><Cart /></ProtectedRoute> } />
          <Route path='/place-order' element={ <ProtectedRoute><PlaceOrder /></ProtectedRoute> } />
          <Route path='/orders' element={ <ProtectedRoute><Orders /></ProtectedRoute> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/signUp' element={ <SignUp /> } />

      </Routes>
      <Footer />

    </div>
  )
}

export default App
