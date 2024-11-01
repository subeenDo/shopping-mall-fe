import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import LoadingSpinner from "../../common/component/LoadingSpinner";

const LandingPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 로딩 상태 추가

  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");

  useEffect(() => {
    setLoading(true);
    dispatch(getProductList({ name })).then(() => {
      setLoading(false);
      setIsInitialLoad(false); // 첫 로딩 후 초기 로딩 상태를 false로 변경
    });
  }, [dispatch, name]);

  return (
    <Container>
      <Row>
        {loading ? (
          <LoadingSpinner />
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          !isInitialLoad && ( // 초기 로딩이 아닐 때만 "결과 없음" 메시지 표시
            <div className="text-align-center empty-bag">
              {name === "" ? (
                <h2>등록된 상품이 없습니다!</h2>
              ) : (
                <h2>{name}과 일치한 상품이 없습니다!</h2>
              )}
            </div>
          )
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
