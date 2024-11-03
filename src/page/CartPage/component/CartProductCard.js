import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { updateCartItem, deleteCartItem } from "../../../features/cart/cartSlice";
import LoadingSpinner from "../../../common/component/LoadingSpinner"; // Import your spinner component

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.cart.loading); // Access loading state from Redux

  const handleSizeChange = (id, size) => {
    handleUpdateItem(id, 1, size); 
  };

  const handleQtyChange = (id, qty) => {
    handleUpdateItem(id, qty, item.size); 
  };
  
  const handleUpdateItem = (id, qty, size) => {
    dispatch(updateCartItem({ id, qty, size }));
  };

  const deleteCart = (id) => {
    dispatch(deleteCartItem(id));
  };

  const availableSizes = Object.keys(item.productId.stock);
  const maxStock = item.productId.stock[item.size] || 1; 

  return (
    <div className="product-card-cart">
      {loading ? ( // Show spinner if loading is true
        <LoadingSpinner />
      ) : (
        <Row>
          <Col md={2} xs={12}>
            <img src={item.productId.image} width={112} alt="product" />
          </Col>
          <Col md={10} xs={12}>
            <div className="display-flex space-between">
              <h3>{item.productId.name}</h3>
              <button className="trash-button">
                <FontAwesomeIcon
                  icon={faTrash}
                  width={24}
                  onClick={() => deleteCart(item._id)}
                />
              </button>
            </div>
            <div>
              <strong>₩ {currencyFormat(item.productId.price)}</strong>
            </div>
            <div className="update-container">
              <span>Size:</span>
              <Form.Select
                value={item.size}
                onChange={(event) => handleSizeChange(item._id, event.target.value)}
              >
                {availableSizes.map((size) => (
                  <option key={size} value={size} disabled={item.productId.stock[size] === 0}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="update-container">
              Quantity:
              <Form.Control
                type="number"
                min={1}
                max={maxStock}
                value={item.qty}
                onChange={(event) => handleQtyChange(item._id, event.target.value)}
                className="qty-spinner"
              />
            </div>
            <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartProductCard;
