import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('nxt_cart') || '[]')
    setCartItems(savedItems)
  }, [])

  const updateCart = updatedItems => {
    setCartItems(updatedItems)
    localStorage.setItem('nxt_cart', JSON.stringify(updatedItems))
  }

  const changeQuantity = (id, amount) => {
    const updatedItems = cartItems
      .map(item =>
        item.id === id ? {...item, quantity: item.quantity + amount} : item,
      )
      .filter(item => item.quantity > 0)
    updateCart(updatedItems)
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return (
    <>
      <Header />
      <main className="cart-page">
        <div className="cart-heading-row">
          <div>
            <p className="eyebrow">YOUR BAG</p>
            <h1>Shopping Cart</h1>
          </div>
          <span>{cartItems.length} products</span>
        </div>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-img.png"
              alt="cart"
              className="cart-img"
            />
            <h2>Your cart is empty</h2>
            <p>Save your favorite finds here while you keep exploring.</p>
            <Link to="/products" className="shop-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-items">
              {cartItems.map(item => (
                <li className="cart-item" key={item.id}>
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="cart-item-info">
                    <h2>{item.title}</h2>
                    <p>by {item.brand}</p>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong>Rs {item.price * item.quantity}/-</strong>
                </li>
              ))}
            </ul>
            <aside className="cart-summary">
              <p>ORDER SUMMARY</p>
              <h2>
                Subtotal <span>Rs {total}/-</span>
              </h2>
              <small>Taxes and delivery calculated at checkout.</small>
              <button type="button" className="checkout-button">
                Checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </>
  )
}

export default Cart
