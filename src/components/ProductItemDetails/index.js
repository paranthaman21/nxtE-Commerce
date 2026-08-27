import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: null,
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiStatusConstants.inProgress})

    try {
      const response = await fetch(
        `https://apis.ccbp.in/products/${match.params.id}`,
        {
          headers: {Authorization: `Bearer ${jwtToken}`},
          method: 'GET',
        },
      )
      if (!response.ok) {
        this.setState({apiStatus: apiStatusConstants.failure})
        return
      }

      const product = await response.json()
      this.setState({
        productData: product,
        apiStatus: apiStatusConstants.success,
      })
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  incrementQuantity = () => {
    this.setState(previousState => ({quantity: previousState.quantity + 1}))
  }

  decrementQuantity = () => {
    this.setState(previousState => ({
      quantity: Math.max(1, previousState.quantity - 1),
    }))
  }

  addToCart = () => {
    const {productData, quantity} = this.state
    const cartItem = {
      id: productData.id,
      title: productData.title,
      brand: productData.brand,
      price: productData.price,
      imageUrl: productData.image_url,
      quantity,
    }
    const currentItems = JSON.parse(localStorage.getItem('nxt_cart') || '[]')
    const existingItem = currentItems.find(item => item.id === cartItem.id)
    const updatedItems = existingItem
      ? currentItems.map(item =>
          item.id === cartItem.id
            ? {...item, quantity: item.quantity + quantity}
            : item,
        )
      : [...currentItems, cartItem]
    localStorage.setItem('nxt_cart', JSON.stringify(updatedItems))
    const {history} = this.props
    history.push('/cart')
  }

  renderSuccessView = () => {
    const {productData, quantity} = this.state
    return (
      <main className="product-details-page">
        <div className="product-details-card">
          <img
            src={productData.image_url}
            alt="product"
            className="product-details-image"
          />
          <div className="product-details-content">
            <p className="eyebrow">CURATED FOR YOU</p>
            <h1>{productData.title}</h1>
            <p className="details-price">Rs {productData.price}/-</p>
            <div className="details-rating">
              <span>{productData.rating}</span>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
              <span>{productData.total_reviews} reviews</span>
            </div>
            <p className="details-description">{productData.description}</p>
            <div className="details-meta">
              <p>
                <strong>Brand</strong>
                {productData.brand}
              </p>
              <p>
                <strong>Availability</strong>
                {productData.availability}
              </p>
            </div>
            <div className="quantity-row">
              <span>Quantity</span>
              <button
                type="button"
                data-testid="minus"
                onClick={this.decrementQuantity}
                aria-label="decrease quantity"
              >
                <BsDashSquare />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                type="button"
                data-testid="plus"
                onClick={this.incrementQuantity}
                aria-label="increase quantity"
              >
                <BsPlusSquare />
              </button>
            </div>
            <div className="details-actions">
              <button
                type="button"
                className="add-to-cart-button"
                onClick={this.addToCart}
              >
                Add to Cart
              </button>
              <Link to="/products" className="back-link">
                Back to products
              </Link>
            </div>
          </div>
        </div>
        <section className="similar-products-section">
          <div className="section-heading">
            <p className="eyebrow">KEEP EXPLORING</p>
            <h2>Similar Products</h2>
          </div>
          <ul className="similar-products-list">
            {productData.similar_products.map(product => (
              <SimilarProductItem productData={product} key={product.id} />
            ))}
          </ul>
        </section>
      </main>
    )
  }

  renderFailureView = () => (
    <div className="product-details-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <p>
        We could not find that product. Let us help you find something else.
      </p>
      <Link to="/products" className="shop-button">
        Continue Shopping
      </Link>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        {apiStatus === apiStatusConstants.inProgress && (
          <div data-testid="loader" className="product-details-loader">
            <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
          </div>
        )}
        {apiStatus === apiStatusConstants.success && this.renderSuccessView()}
        {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
      </>
    )
  }
}

export default ProductItemDetails
