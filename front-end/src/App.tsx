import { BrowserRouter, Routes, Route } from 'react-router-dom'; // handles navigation between pages
import { CartProvider } from './context/CartContext'; // gives cart access to whole app
import BookListPage from './pages/BookListPage';

function App() {
  return (
    <CartProvider> {/* everything inside here can access the cart */}
      <BrowserRouter> {/* enables page routing */}
        <Routes> {/* container for all our routes */}
          <Route path="/" element={<BookListPage />} /> {/* main page */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;