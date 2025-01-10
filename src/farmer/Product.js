import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/compo/nav';

const Product = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      fetchAllProducts(savedToken);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchProductById = async (id, token) => {
    try {
      const response = await fetch(`http://localhost:5456/farmers/product?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.status === 201) {
        setProduct(data.product);
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      alert('Failed to fetch product. Please try again.');
    }
  };

  const fetchAllProducts = async (token) => {
    try {
      const response = await fetch('http://localhost:5456/farmers/product/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.status === 201) {
        setAllProducts(data.productList || []);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
      alert('Failed to fetch products. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (productId && token) {
      fetchProductById(productId, token);
    }
  };

  const getImageUrl = (imageName) => {
    // console.log(imageName);
    const image = `http://localhost:5456${imageName}`;
    // console.log(image);
    return image;
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <h2>Search Product by ID</h2>
            <form onSubmit={handleSearch}>
              <div className="form-group mb-3">
                <label>Product ID:</label>
                <input
                  type="text"
                  className="form-control"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            {product && (
              <div className="mt-3">
                <h3>Product Details</h3>
                <img
                  src={getImageUrl(product.prod_Img)}
                  alt={product.prod_Name}
                  className="img-fluid mb-3"
                />
                <p><strong>Name:</strong> {product.prod_Name}</p>
                <p><strong>Description:</strong> {product.prod_Description}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Stock:</strong> {product.prod_Stock}</p>
                <p><strong>Quantity:</strong> {product.prod_Quantity}</p>
                <p><strong>Price:</strong> {product.prod_Price}</p>
                <p><strong>Listing Date:</strong> {product.listing_Date}</p>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <h2>All Products</h2>
            <div className="list-group">
              {allProducts.map((prod) => (
                <div key={prod.prod_id} className="list-group-item">
                  <img
                    src={getImageUrl(prod.prod_Img)}
                    alt={prod.prod_Name}
                    className="img-fluid mb-3"
                  />
                  <h5>{prod.prod_Name}</h5>
                  <p>{prod.prod_Description}</p>
                  <p><strong>Price:</strong> {prod.prod_Price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
