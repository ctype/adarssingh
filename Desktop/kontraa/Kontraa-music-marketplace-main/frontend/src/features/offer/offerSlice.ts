
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_OFFERS } from "@/graphql/query/offer_system/offer.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_OFFER, DELETE_OFFER, UPDATE_OFFER } from "@/graphql/mutation/offer_system/offer.mutation";

const initialState: IBaseSliceInitialState & {
  offers: Offer[],
} = {
  offers: [],
  error: null,
  isPending: false,
}

export const fetchOffers = createAsyncThunk(
  "offers/fetchOffers",
  async ({ type = "all" }: { type: string }) => {
    return apolloClientQuery(FETCH_OFFERS, { type })
  }
);

export const createOffer = createAsyncThunk(
  "offers/createOffer",
  async ({ data }: { data: Partial<Offer> }) => {
    return apolloClientMutate(CREATE_OFFER, { data }, {}, { suppressGlobalError: true })
  }
);

export const updateOffer = createAsyncThunk(
  "offers/updateOffer",
  async ({ data, id }: { data: Partial<Offer>, id: number }) => {
    return apolloClientMutate(UPDATE_OFFER, { data, id }, {}, { suppressGlobalError: true })
  }
);

export const deleteOffer = createAsyncThunk(
  "offers/deleteOffer",
  async ({ id }: { id: number }) => {
    return apolloClientMutate(DELETE_OFFER, { id })
  }
);

const OfferSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    setOffers(state, action) {
      state.offers = action.payload;
    }
  },
  extraReducers: (builder) => {
    return builder.addCase(fetchOffers.pending, (state) => {
      state.isPending = true;
    }).addCase(fetchOffers.fulfilled, (state, action) => {
      state.isPending = false;
      state.offers = action.payload.offers.map((o: dynamicObj) => {
        const timePeriod = o.timePeriod as string | null;
        const isDateString = !!timePeriod && timePeriod.split("-").length > 1;

        return {
          ...o,
          timePeriod: timePeriod ? new Date(isDateString ? timePeriod : Number(timePeriod)).toISOString() : null
        }
      });
    })
      // .addCase(fetchOffers.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // create offer
      .addCase(createOffer.pending, (state) => {
        state.isPending = true;
      }).addCase(createOffer.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          // state.error = action.payload.errors;
          return;
        }
        state.offers = [{
          ...action.payload.createOffer,
          timePeriod: action.payload.createOffer.timePeriod ? new Date(Number(action.payload.createOffer.timePeriod)).toISOString() : null,
        }, ...state.offers];
      })
      // .addCase(createOffer.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // update offer
      .addCase(updateOffer.pending, (state) => {
        state.isPending = true;
      }).addCase(updateOffer.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          // state.error = action.payload.errors;
          return;
        }
        const updatedOffers = state.offers.map((o) => {
          if (o.id === action.payload.updateOffer.id) {
            return {
              ...action.payload.updateOffer,
              timePeriod: action.payload.updateOffer.timePeriod ? new Date(Number(action.payload.updateOffer.timePeriod)).toISOString() : null,
            };
          }
          return o;
        })
        state.offers = updatedOffers;
      })
      // .addCase(updateOffer.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // delete offers
      .addCase(deleteOffer.pending, (state) => {
        state.isPending = true;
      }).addCase(deleteOffer.fulfilled, (state, action) => {
        state.isPending = false;
        state.offers = state.offers.filter((o) => o.id !== action.payload.deleteOffer);
      })
    // .addCase(deleteOffer.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setOffers } = OfferSlice.actions;
export default OfferSlice.reducer;
