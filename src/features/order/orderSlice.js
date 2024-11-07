import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCartQty } from '../cart/cartSlice';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// Define initial state
const initialState = {
  orderList: [],
  orderNum: '',
  selectedOrder: {},
  error: '',
  loading: false,
  statusLoading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/order', payload);
      dispatch(getCartQty());
      return res.data.orderNum;
    } catch (error) {
      dispatch(showToastMessage({ status: 'error', message: error.error ?? error.message }));
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get('/order');
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const getOrderList = createAsyncThunk(
  'order/getOrderList',
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get('/order', { params: { ...query } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/order/${id}`, { status });
      dispatch(showToastMessage({ status: 'success', message: '주문 상태 변경 완료' }));
      return res.data;
    } catch (error) {
      dispatch(showToastMessage({ status: 'error', message: '주문 상태 변경 실패' })); 
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(getOrder.pending, (state) => {
        state.loading = true;
      }).addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.orderList = action.payload;
      }).addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(getOrderList.pending, (state) => {
        state.loading = true;
      }).addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.orderList = action.payload.orders;
        state.totalPageNum = action.payload.pages;
      }).addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateOrder.pending, (state) => {
        state.statusLoading = true;
      }).addCase(updateOrder.fulfilled, (state) => {
        state.statusLoading = false;
      }).addCase(updateOrder.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;