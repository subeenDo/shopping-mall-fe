import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearErrors } from "../../features/user/userSlice";
import LoadingSpinner from "../../common/component/LoadingSpinner";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    //이미 로그인을 한 유저는 /login 페이지로 갈 수 없다.
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (user || token) {
      navigate("/"); // 이미 로그인한 경우 홈으로 리디렉션
    }
  }, [user, navigate]);
  

  
  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [navigate]);

  
  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    setLoading(true); // 로딩 시작
    dispatch(loginWithEmail({ email, password }))
      .unwrap()
      .then(() => {
        setLoading(false); 
        const redirectUrl = sessionStorage.getItem("redirectUrl"); //  /product/상품id 가져오기
        sessionStorage.removeItem("redirectUrl"); // 삭제
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        setLoading(false); 
      });
  };
  
  

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
  };

  // if (user) {
  //  navigate("/"); //강사님ver 이미 로그인을 한 유저는 /login 페이지로 갈 수 없다.
  // }
  return (
    <>
    {loading ? (
        <LoadingSpinner />
      ) : (
      <Container className="login-area">
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">{loginError}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit"  disabled={loading}>
              Login
            </Button>
            <div>
              아직 계정이 없으세요?  <Link to="/register">회원가입 하기</Link>{" "}
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>-외부 계정으로 로그인하기-</p>
            <div className="display-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </Form>
      </Container>
      )}
    </>
  );
};

export default Login;
