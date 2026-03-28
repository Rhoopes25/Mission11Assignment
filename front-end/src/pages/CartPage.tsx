import { useCart } from '../context/CartContext'; // access the cart
import { useNavigate } from 'react-router-dom'; // for continue shopping button

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart(); // pull cart data and functions
  const navigate = useNavigate(); // for navigation

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // calculate grand total

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        // show this if cart is empty
        <p className="text-muted">Your cart is empty!</p>
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
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td> {/* subtotal per item */}
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.bookID)} // remove this item
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* total and actions */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h4>Total: ${total.toFixed(2)}</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate('/')}> {/* go back to book list */}
                Continue Shopping
              </button>
              <button className="btn btn-danger" onClick={clearCart}> {/* empty the cart */}
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