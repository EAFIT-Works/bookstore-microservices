import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import BookScreen from './screens/BookScreen';
import BookFormScreen from './screens/BookFormScreen';
import AboutScreen from './screens/AboutScreen';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ProfileScreen from './screens/ProfileScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';


const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/about' element={<AboutScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/books/new' element={<BookFormScreen mode="create" />} />
            <Route path='/book/:id/edit' element={<BookFormScreen mode="edit" />} />
            <Route path='/book/:id' element={<BookScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/orders' element={<OrdersScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
