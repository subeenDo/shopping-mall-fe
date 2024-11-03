import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size, navigate }, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.post("/cart", { productId:id, size, qty:1});

      if (response.status !== 200) throw new Error(response.error);

      const userResponse = window.confirm("카트에 아이템이 추가되었습니다. 장바구니로 이동하시겠습니까?");
      if (userResponse) {
        navigate("/cart"); 
      } else {
        navigate("/"); 
      }
      return response.data.cartItemQty;
    
    }catch(error){
      dispatch(
        showToastMessage({
          message:"카트에 아이템이 추가 실패(중복 등록)", 
          status:"error"
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      
      dispatch(showToastMessage({ message: "Success delete Item", status: "success" }));
      dispatch(getCartQty());  
      dispatch(getCartList());  

      return response.data.data;

    }catch(error){
      dispatch(showToastMessage({ message: "Error delete Item", status: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, qty, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty, size });
      if (response.status !== 200) throw new Error(response.error);
      dispatch(getCartQty());
      dispatch(getCartList()); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/cart/cartItemQty');
      if(response.status !== 200) throw new Error(response.error);
      else return response.data.qty;
    } catch (error) {
      dispatch(showToastMessage(error.error || 'An error occurred', "error"));
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getCartQty.pending, (state) => {
        console.log('pending',);
        state.loading = true;
        state.error = '';
      })
      .addCase(getCartQty.fulfilled, (state, action) => {  
        console.log('fulfilled',);
        state.loading = false;
        state.error = '';
        console.log('action.payload',action.payload);
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state,action)=> {
        console.log('rejectedd',);
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default cartSlice.reducer;
export const { initialCart, resetCart } = cartSlice.actions;
