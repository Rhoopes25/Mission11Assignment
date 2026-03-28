import { useCart } from '../context/CartContext'; // access cart data
import { useNavigate } from 'react-router-dom'; // for navigating to cart

interface CartSummaryProps {
  pageNum: number; // current page to pass to cart
  selectedCategory: string; // current category to pass to cart
  pageSize: number; 

}

function CartSummary({ pageNum, selectedCategory, pageSize }: CartSummaryProps) {
    const { cart } = useCart(); // get cart array
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // total number of books
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // total price

  return (
    <div
      style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }} // fixed to top right corner
      className="bg-dark text-white p-3 rounded shadow"
    >
      <div
        className="d-flex align-items-center gap-2"
        style={{ cursor: 'pointer' }} // makes it look clickable
        onClick={() => navigate('/cart', { state: { pageNum, selectedCategory, pageSize } })}
        >
        🛒
        <span className="badge bg-primary">{totalItems} items</span> {/* bootstrap badge - new! */}
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartSummary;