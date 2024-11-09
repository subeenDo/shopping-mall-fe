import React, { useState } from "react";
import { Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={orderItem.items[0]?.productId?.image}
            alt={orderItem.items[0]?.productId?.image}
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
            <Button className="text-align-center text-12" variant="link" onClick={handleShow}>
              상세정보
            </Button>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 && ` 외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>

        </Col>
      </Row>


      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>주문 상세정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderItem.items.map((item, index) => (
            <div key={index} className="order-item-details mb-3">
              <Row>
                <Col xs={3}>
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    height={96}
                  />
                </Col>
                <Col xs={9}>
                  <strong>{item.productId.name}</strong>
                  <p className="item-details">사이즈 : {item.size}</p>
                  <p className="item-details">수량 : {item.qty}</p>
                  <p className="item-details">가격 : ₩ {currencyFormat(item.productId.price)}</p>
                </Col>
              </Row>
            </div>
          ))}

          {orderItem.items.length > 1 && (
            <div className="mt-3">
              <strong>총 가격:</strong> ₩ {currencyFormat(orderItem.totalPrice)}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};


export default OrderStatusCard;
