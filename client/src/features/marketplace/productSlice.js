import { createSlice } from "@reduxjs/toolkit";

import { fetchProducts, fetchProduct } from "./productThunks";

const initialState = {
  // =====================================================
  // Products
  // =====================================================

  products: [],

  product: null,

  // =====================================================
  // Pagination
  // =====================================================

  currentPage: 1,

  totalPages: 1,

  totalProducts: 0,

  count: 0,

  // =====================================================
  // Loading
  // =====================================================

  loading: false,

  // =====================================================
  // Error
  // =====================================================

  error: null,
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    // ===================================================
    // Clear Selected Product
    // ===================================================

    clearSelectedProduct: (state) => {
      state.product = null;
    },

    // ===================================================
    // Clear Product Error
    // ===================================================

    clearProductError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // Fetch Products
      // =================================================

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.products = action.payload.products || [];

        state.currentPage = action.payload.currentPage || 1;

        state.totalPages = action.payload.totalPages || 1;

        state.totalProducts = action.payload.totalProducts || 0;

        state.count = action.payload.count ?? state.products.length;

        state.error = null;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch products";
      })

      // =================================================
      // Fetch Single Product
      // =================================================

      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.product = action.payload.product || null;

        state.error = null;
      })

      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Failed to fetch product";
      });
  },
});

export const { clearSelectedProduct, clearProductError } = productSlice.actions;

export default productSlice.reducer;
