import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { ADD_FEATURE_TO_PACKAGE, CREATE_PACKAGE_FEATURE_LABEL_VALUE, CREATE_SUBSCRIPTION_FEATURE, CREATE_SUBSCRIPTION_PACKAGE, DELETE_SUBSCRIPTION_FEATURE, DELETE_SUBSCRIPTION_PACKAGE, REMOVE_FEATURE_TO_PACKAGE, UPDATE_PACKAGE_FEATURE_LABEL_VALUE, UPDATE_SUBSCRIPTION_FEATURE, UPDATE_SUBSCRIPTION_PACKAGE } from "@/graphql/mutation/subscription/subscription.mutation";
import { FETCH_SUBSCRIPTION_ACCESSES, FETCH_SUBSCRIPTION_FEATURES, FETCH_SUBSCRIPTION_PACKAGES } from "@/graphql/query/proPackage/proPackage.query";

const initialState: IBaseSliceInitialState & {
  subscriptionPackages: UserPackage[];
  subscriptionFeatures: SubscriptionFeature[];
  subscriptionAccesses: SubscriptionAccess[];
  // subscriptionPermissions: SubscriptionPermissions[];
  isUploading: boolean;
} = {
  subscriptionPackages: [],
  subscriptionAccesses: [],
  subscriptionFeatures: [],
  // subscriptionPermissions: [],
  error: null,
  isPending: false,
  isUploading: false,
}

// Packages
export const fetchSubscriptionPackages = createAsyncThunk(
  "subscription/fetchSubscriptionPackages",
  async () => {
    return await apolloClientQuery(FETCH_SUBSCRIPTION_PACKAGES, {});
  }
);

export const createSubscriptionPackage = createAsyncThunk(
  "subscription/createSubscriptionPackage",
  async (data: Partial<UserPackage>) => {
    return await apolloClientMutate(CREATE_SUBSCRIPTION_PACKAGE, { data }, {}, { suppressGlobalError: true });
  }
);

export const updateSubscriptionPackage = createAsyncThunk(
  "subscription/updateSubscriptionPackage",
  async ({ id, data }: { data: Partial<UserPackage>, id: number }) => {
    return await apolloClientMutate(UPDATE_SUBSCRIPTION_PACKAGE, { data, id }, {}, { suppressGlobalError: true });
  }
);

export const deleteSubscriptionPackage = createAsyncThunk(
  "subscription/deleteSubscriptionPackage",
  async (id: number) => {
    return await apolloClientMutate(DELETE_SUBSCRIPTION_PACKAGE, { id }, {}, { suppressGlobalError: true });
  }
);

// Features
export const fetchSubscriptionFeatures = createAsyncThunk(
  "subscription/fetchSubscriptionFeatures",
  async () => {
    return await apolloClientQuery(FETCH_SUBSCRIPTION_FEATURES, {});
  }
);

export const createSubscriptionFeature = createAsyncThunk(
  "subscription/createSubscriptionFeature",
  async (data: Partial<SubscriptionFeature>) => {
    return await apolloClientMutate(CREATE_SUBSCRIPTION_FEATURE, { data }, {}, { suppressGlobalError: true });
  }
);

export const updateSubscriptionFeature = createAsyncThunk(
  "subscription/updateSubscriptionFeature",
  async ({ id, data }: { data: Partial<SubscriptionFeature>, id: number }) => {
    return await apolloClientMutate(UPDATE_SUBSCRIPTION_FEATURE, { data, id }, {}, { suppressGlobalError: true });
  }
);

export const deleteSubscriptionFeature = createAsyncThunk(
  "subscription/deleteSubscriptionFeature",
  async (id: number) => {
    return await apolloClientMutate(DELETE_SUBSCRIPTION_FEATURE, { id });
  }
);

// Permissions
// export const fetchSubscriptionPermissions = createAsyncThunk(
//   "subscription/fetchSubscriptionPermissions",
//   async () => {
//     return await apolloClientQuery(FETCH_SUBSCRIPTION_PERMISSIONS, {});
//   }
// );

// Accesses
export const fetchSubscriptionAccesses = createAsyncThunk(
  "subscription/fetchSubscriptionAccesses",
  async () => {
    return await apolloClientQuery(FETCH_SUBSCRIPTION_ACCESSES, {})
  }
);

// Package feature
export const addFeatureToPackage = createAsyncThunk(
  "subscription/addFeatureToPackage",
  async ({ packageId, featureId }: { packageId: number, featureId: number }) => {
    return await apolloClientMutate(ADD_FEATURE_TO_PACKAGE, { packageId, featureId }, {}, { suppressGlobalError: true });
  }
);

export const removeFeatureToPackage = createAsyncThunk(
  "subscription/removeFeatureToPackage",
  async ({ packageId, featureId }: { packageId: number, featureId: number }) => {
    return await apolloClientMutate(REMOVE_FEATURE_TO_PACKAGE, { packageId, featureId }, {}, { suppressGlobalError: true });
  }
);

// Package Feature Label value
export const createPackageFeatureLabelValue = createAsyncThunk(
  "subscription/createPackageFeatureLabelValue",
  async ({ data }: { data: Partial<SubscriptionPackageFeatureLabelValue> }) => {
    return await apolloClientMutate(CREATE_PACKAGE_FEATURE_LABEL_VALUE, { data }, {}, { suppressGlobalError: true })
  }
);

export const updatePackageFeatureLabelValue = createAsyncThunk(
  "subscription/updatePackageFeatureLabelValue",
  async ({ data, id }: { id: number, data: Partial<SubscriptionPackageFeatureLabelValue> }) => {
    return await apolloClientMutate(UPDATE_PACKAGE_FEATURE_LABEL_VALUE, { data, id }, {}, { suppressGlobalError: true })
  }
);

const SubscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setPending: (state, action) => {
      state.isPending = action.payload;
    }
  },
  extraReducers: (builder) => {
    return builder
      // fetch packages
      .addCase(fetchSubscriptionPackages.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchSubscriptionPackages.fulfilled, (state, action) => {
        state.isPending = false;
        state.subscriptionPackages = action.payload.subscriptionPackages;
      })
      // .addCase(fetchSubscriptionPackages.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message ?? null;
      // })
      // create package
      .addCase(createSubscriptionPackage.pending, (state) => {
        state.isUploading = true;
      }).addCase(createSubscriptionPackage.fulfilled, (state, action) => {
        state.isUploading = false;
        const newPackage = action.payload.createSubscriptionPackage;
        if (newPackage.isPreferred) {
          state.subscriptionPackages = [...state.subscriptionPackages.map((s) => ({ ...s, isPreferred: false })), newPackage]
        } else {
          state.subscriptionPackages = [...state.subscriptionPackages, action.payload.createSubscriptionPackage];
        }
      })
      //.addCase(createSubscriptionPackage.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      // update package
      .addCase(updateSubscriptionPackage.pending, (state) => {
        state.isUploading = true;
      }).addCase(updateSubscriptionPackage.fulfilled, (state, action) => {
        state.isUploading = false;
        const updatedPackage = action.payload.updateSubscriptionPackage;
        state.subscriptionPackages = state.subscriptionPackages.map((pp) => {
          if (pp.id === updatedPackage.id) {
            return updatedPackage;
          }
          if (updatedPackage.isPreferred) {
            return { ...pp, isPreferred: false }
          }
          return pp;
        });
      })
      // .addCase(updateSubscriptionPackage.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      // delete package
      .addCase(deleteSubscriptionPackage.pending, (state) => {
        state.isPending = true;
      }).addCase(deleteSubscriptionPackage.fulfilled, (state, action) => {
        state.isPending = false;
        state.subscriptionPackages = state.subscriptionPackages.filter((pp) => pp.id !== action.payload.deleteSubscriptionPackage);
      })
      // .addCase(deleteSubscriptionPackage.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message ?? null;
      // })
      // fetch features
      .addCase(fetchSubscriptionFeatures.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchSubscriptionFeatures.fulfilled, (state, action) => {
        state.isPending = false;
        state.subscriptionFeatures = action.payload.subscriptionFeatures;
      })
      // .addCase(fetchSubscriptionFeatures.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message ?? null;
      // })
      // create feature
      .addCase(createSubscriptionFeature.pending, (state) => {
        state.isUploading = true;
      }).addCase(createSubscriptionFeature.fulfilled, (state, action) => {
        state.isUploading = false;
        state.subscriptionFeatures = [...state.subscriptionFeatures, action.payload.createSubscriptionFeature];
      })
      // .addCase(createSubscriptionFeature.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      // update feature
      .addCase(updateSubscriptionFeature.pending, (state) => {
        state.isUploading = true;
      }).addCase(updateSubscriptionFeature.fulfilled, (state, action) => {
        state.isUploading = false;
        state.subscriptionFeatures = state.subscriptionFeatures.map((pf) => {
          if (pf.id === action.payload.updateSubscriptionFeature.id) {
            return action.payload.updateSubscriptionFeature;
          }
          return pf;
        });
      })
      // .addCase(updateSubscriptionFeature.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      // delete feature
      .addCase(deleteSubscriptionFeature.pending, (state) => {
        state.isPending = true;
      }).addCase(deleteSubscriptionFeature.fulfilled, (state, action) => {
        state.isPending = false;
        state.subscriptionFeatures = state.subscriptionFeatures.filter((pf) => pf.id !== action.payload.deleteSubscriptionFeature);
      })
      // .addCase(deleteSubscriptionFeature.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message ?? null;
      // })
      // fetch permissions
      // .addCase(fetchSubscriptionPermissions.pending, (state) => {
      //   state.isPending = true;
      // }).addCase(fetchSubscriptionPermissions.fulfilled, (state, action) => {
      //   state.isPending = false;
      //   state.subscriptionPermissions = action.payload.subscriptionPermissions;
      // }).addCase(fetchSubscriptionPermissions.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message ?? null;
      // })
      // feature and package
      .addCase(addFeatureToPackage.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(addFeatureToPackage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.subscriptionPackages = state.subscriptionPackages.map((pp) => {
          if (pp.id === action.payload.addFeatureToPackage.id) {
            return action.payload.addFeatureToPackage;
          }
          return pp;
        });
      })
      // .addCase(addFeatureToPackage.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      .addCase(removeFeatureToPackage.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(removeFeatureToPackage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.subscriptionPackages = state.subscriptionPackages.map((pp) => {
          if (pp.id === action.payload.removeFeatureToPackage.id) {
            return action.payload.removeFeatureToPackage;
          }
          return pp;
        });
      })
      // .addCase(removeFeatureToPackage.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      // fetch accesses
      .addCase(fetchSubscriptionAccesses.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchSubscriptionAccesses.fulfilled, (state, action) => {
        state.isPending = false;
        state.subscriptionAccesses = action.payload.subscriptionAccess;
      })
      // .addCase(fetchSubscriptionAccesses.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // label value
      .addCase(createPackageFeatureLabelValue.pending, (state) => {
        state.isUploading = true;
      }).addCase(createPackageFeatureLabelValue.fulfilled, (state, action) => {
        state.isUploading = false;
        const labelValue = action.payload.createPackageFeatureLabelValue;
        state.subscriptionPackages = state.subscriptionPackages.map((pp) => {
          if (pp.id === labelValue.packageId.id) {
            return ({ ...pp, packageFeatureValues: [labelValue, ...(pp.packageFeatureValues ?? [])] })
          }
          return pp;
        });
      })
      // .addCase(createPackageFeatureLabelValue.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message ?? null;
      // })
      .addCase(updatePackageFeatureLabelValue.pending, (state) => {
        state.isUploading = true;
      }).addCase(updatePackageFeatureLabelValue.fulfilled, (state, action) => {
        state.isUploading = false;
        const labelValue = action.payload.updatePackageFeatureLabelValue;
        state.subscriptionPackages = state.subscriptionPackages.map((pp) => {
          if (pp.id === labelValue.packageId.id) {
            const newPkgValues = pp.packageFeatureValues?.map((pf: SubscriptionPackageFeatureLabelValue) => {
              if (pf.id === labelValue.id) {
                return labelValue;
              }
              return pf;
            })
            return ({ ...pp, packageFeatureValues: [labelValue, ...newPkgValues] })
          }
          return pp;
        });
      })
    // .addCase(updatePackageFeatureLabelValue.rejected, (state, action) => {
    //   state.isUploading = false;
    //   state.error = action.error.message ?? null;
    // });
  }
});

export const { setPending } = SubscriptionSlice.actions;
export default SubscriptionSlice.reducer;
