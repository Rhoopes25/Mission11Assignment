import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookListPage from './pages/BookListPage';
import CartPage from './pages/CartPage';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;