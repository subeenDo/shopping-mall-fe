import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });
      //console.log("rr",response); // 응답 데이터 확인
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/product", formData);

      dispatch(showToastMessage({ message: "Success add new Item", status: "success" }));
      dispatch(getProductList({page: 1}));
      return response.data.data;
    } catch (err) {
      dispatch(showToastMessage({ message: "Error add new Item", status: "error" }));
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.delete(`/product/${id}`);
      
      dispatch(showToastMessage({ message: "Success delete Item", status: "success" }));
      dispatch(getProductList({page: 1}));
        
      return response.data.data;

    }catch(error){
      dispatch(showToastMessage({ message: "Error delete Item", status: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.put(`/product/${id}`, formData);

      dispatch(showToastMessage({ message: "Success edit new Item", status: "success" }));
      dispatch(getProductList({page: 1}));
      
      return response.data.data;

    }catch(error){
      dispatch(showToastMessage({ message: "Error edit new Item", status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);


// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
    categories: [],
    categoryLoading: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createProduct.pending, (state) => {
      state.loading = true;
    })
    .addCase(createProduct.fulfilled, (state, action) => {
      state.error = "";
      state.loading = false;
      state.success = true;
    })
    .addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(getProductList.pending, (state) => {
      state.loading = true;
    })
    .addCase(getProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.productList = action.payload.products;
      state.totalPageNum = action.payload.totalPageNum;
      //console.log('Total Page Num:', state.totalPageNum);
      state.error = "";
    })
    .addCase(getProductList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(editProduct.pending, (state) => {
      state.loading = true;
    })
    .addCase(editProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.success = true;
    })
    .addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase(getProductDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getProductDetail.fulfilled, (state, action) => {
      state.selectedProduct = action.payload;
      state.loading = false;
    })
    .addCase(getProductDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;