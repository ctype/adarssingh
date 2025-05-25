import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_MY_CARTS } from "@/graphql/query/cart/cart.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { ADD_TO_CART, REMOVE_FROM_CART } from "@/graphql/mutation/cart/cart.mutation";

const initialState: IBaseSliceInitialState & {
  carts: CartResponse[];
} = {
  carts: [],
  error: null,
  isPending: false,
}

export const fetchCarts = createAsyncThunk(
  "cart/fetchCarts",
  async ({ userId }: { userId: number }) => {
    return await apolloClientQuery(FETCH_MY_CARTS, { userId });
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ fileId, licenseId }: { fileId: number, licenseId: number }) => {
    return await apolloClientMutate(ADD_TO_CART, { fileId, licenseId }, {}, { suppressGlobalError: true });
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id: number) => {
    return await apolloClientMutate(REMOVE_FROM_CART, { id }, {}, { suppressGlobalError: true });
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCarts(state) {
      state.carts = [];
    },
    setCarts(state, action) {
      state.carts = action.payload;
    }
  },
  extraReducers: (builder) => {
    return builder.addCase(fetchCarts.pending, (state) => {
      state.isPending = true;
    }).addCase(fetchCarts.fulfilled, (state, action) => {
      state.isPending = false;
      state.carts = action.payload.myCarts;
    })
      // .addCase(fetchCarts.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(addToCart.pending, (state) => {
        state.isPending = true;
      }).addCase(addToCart.fulfilled, (state, action) => {
        state.isPending = false;
        state.carts.push(action.payload.addToCart);
      })
      // .addCase(addToCart.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(removeFromCart.pending, (state) => {
        state.isPending = true;
      }).addCase(removeFromCart.fulfilled, (state, action) => {
        state.isPending = false;
        const filteredCarts = state.carts.filter((c) => c.id !== action.payload.removeFromCart)
        state.carts = filteredCarts;
      })
    // .addCase(removeFromCart.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setCarts, clearCarts } = CartSlice.actions;
export default CartSlice.reducer;
