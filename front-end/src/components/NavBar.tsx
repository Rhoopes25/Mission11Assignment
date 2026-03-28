import { useCart } from '../context/CartContext'; // access cart data
import { useNavigate } from 'react-router-dom'; // for navigating to cart

interface NavBarProps {
  pageNum: number;
  selectedCategory: string;
  pageSize: number;
}

function NavBar({ pageNum, selectedCategory, pageSize }: NavBarProps) {
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // total items in cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // total price

  return (
    <nav className="navbar navbar-dark bg-dark px-4 mb-4"> {/* bootstrap navbar */}
<span className="navbar-brand" style={{ color: "white" }}>
  Bookstore
</span>      <button
        className="btn btn-outline-light d-flex align-items-center gap-2"
        onClick={() => navigate('/cart', { state: { pageNum, selectedCategory, pageSize } })} // go to cart with state
      >
        🛒
        <span className="badge bg-primary">{totalItems}</span> {/* badge showing item count - bootstrap badge! */}
        <span>${totalPrice.toFixed(2)}</span>
      </button>
    </nav>
  );
}

export default NavBar;