import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCartQty } from '../cart/cartSlice';
import api from '../../utils/api';
import { showToastMessage } from '../common/uiSlice';

// 초기 상태 정의
const initialState = {
  orderList: [],
  orderNum: '',
  selectedOrder: {},
  error: '',
  loading: false,
  statusLoading: false,
  totalPageNum: 1,
};

// 주문 생성 액션
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/order', payload);
      dispatch(getCartQty());
      return res.data.orderNum;
    } catch (error) {
      //console.log('Error response:', error?.response);
      // 오류 메시지가 서버에서 반환한 message에 있다면 그 메시지를 사용
      const errorMessage = error?.response?.data?.message 
      || error?.message 
      || "재고가 부족합니다.";
      
      // 정확한 오류 메시지 사용자에게 표시
      dispatch(showToastMessage({ status: 'error', message: errorMessage }));
      
      return rejectWithValue(errorMessage); // 메시지를 전달하여 더 나중에 처리할 수 있도록 함
    }
  }
);



// 주문 가져오기 액션
export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/order');
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

// 주문 목록 가져오기 액션
export const getOrderList = createAsyncThunk(
  'order/getOrderList',
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get('/order', { params: { ...query } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

// 주문 상태 업데이트 액션
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

// orderSlice
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
        })
        .addCase(getOrder.pending, (state) => {
          state.loading = true;
        })
        .addCase(getOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.error = '';
          state.orderList = action.payload;
        })
        .addCase(getOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(getOrderList.pending, (state) => {
          state.loading = true;
        })
        .addCase(getOrderList.fulfilled, (state, action) => {
          state.loading = false;
          state.error = '';
          state.orderList = action.payload.orders;
          state.totalPageNum = action.payload.pages;
        })
        .addCase(getOrderList.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(updateOrder.pending, (state) => {
          state.statusLoading = true;
        })
        .addCase(updateOrder.fulfilled, (state) => {
          state.statusLoading = false;
        })
        .addCase(updateOrder.rejected, (state, action) => {
          state.statusLoading = false;
          state.error = action.payload;
        });
    },
    
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
