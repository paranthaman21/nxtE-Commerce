import {Link} from 'react-router-dom'

import './index.css'

const SimilarProductItem = props => {
  const {productData} = props
  return (
    <li className="similar-product-item">
      <Link to={`/products/${productData.id}`} className="similar-product-link">
        <img
          src={productData.image_url}
          alt={`similar product ${productData.title}`}
          className="similar-product-image"
        />
        <h3>{productData.title}</h3>
        <p>{productData.brand}</p>
        <div className="similar-product-footer">
          <strong>Rs {productData.price}/-</strong>
          <span>
            {productData.rating}{' '}
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </span>
        </div>
      </Link>
    </li>
  )
}

export default SimilarProductItem
