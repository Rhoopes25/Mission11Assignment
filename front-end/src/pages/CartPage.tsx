import { useCart } from '../context/CartContext'; // access the cart
import { useNavigate, useLocation } from 'react-router-dom'; // for navigation and reading state

function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart(); // pull cart data and functions
  const navigate = useNavigate();
  const location = useLocation(); // read state passed from book list
  const { pageNum, selectedCategory, pageSize } = location.state || { pageNum: 1, selectedCategory: '', pageSize: 5 };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // calculate grand total

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <>
            <p className="text-muted">Your cart is empty!</p>
            <button className="btn btn-primary" onClick={() => navigate('/', { state: { pageNum, selectedCategory, pageSize } })}>
            Continue Shopping
            </button>
        </>
        ) : (
        <>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.bookID}>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    {/* quantity - and + buttons */}
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.bookID); // remove if quantity hits 0
                          } else {
                            updateQuantity(item.bookID, item.quantity - 1); // decrease by 1
                          }
                        }}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.bookID, item.quantity + 1)} // increase by 1
                      >+</button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td> {/* subtotal */}
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.bookID)} // remove whole item
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* total and action buttons */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h4>Total: ${total.toFixed(2)}</h4>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/', { state: { pageNum, selectedCategory, pageSize } })}
                >
                Continue Shopping
              </button>
              <button className="btn btn-danger" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;