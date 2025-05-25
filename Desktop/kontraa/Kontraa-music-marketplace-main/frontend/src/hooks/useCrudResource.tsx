/* eslint-disable @typescript-eslint/no-empty-object-type */
import { useAppDispatch } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import { convertGenericErrorToValidationError } from "@/helper/errorHelper";
import {
  // ActionCreatorWithoutPayload,
  AsyncThunkAction,
} from "@reduxjs/toolkit";
import { useState } from "react";

type CrudResourceThunk<Returned, ThunkArg> = (
  arg: ThunkArg
) => AsyncThunkAction<Returned, ThunkArg, {}>;

type FetchResourceThunk<Returned, ThunkArg = void> = ThunkArg extends void
  ? () => AsyncThunkAction<Returned, ThunkArg, {}>
  : (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, {}>;
// resetReducer: ActionCreatorWithoutPayload

export function useCrudResource({
  resourceName,
  dupkeyName,
  onSuccess,
  onError,
}: {
  resourceName: string;
  dupkeyName?: string;
  onSuccess?: () => void | ((d: dynamicStringObj) => void);
  onError?: (error: GraphqlErrorObj) => void;
}) {
  const dispatch = useAppDispatch();
  const [validationError, setValidationError] = useState<{
    [key: string]: string;
  }>({});

  const clearValidationError = () => setValidationError({});

  async function fetchResource<Returned, ThunkArg = void>(
    thunk: FetchResourceThunk<Returned, ThunkArg>,
    payload?: ThunkArg extends void ? [] : [ThunkArg]
  ) {
    await dispatch(thunk(...(payload as [ThunkArg]))).unwrap();
  }

  async function createResource<Returned, ThunkArg>(
    thunk: CrudResourceThunk<Returned, ThunkArg>,
    payload: ThunkArg
  ) {
    await dispatch(thunk(payload))
      .unwrap()
      .then((d) => {
        if (d && typeof d === "object" && "errors" in d) {
          if (
            (d.errors as GraphqlErrorObj).message ===
            "Unauthorized: No token provided"
          ) {
            toaster.error({
              title: "Session Expired",
              description: "Please login to continue.",
            });
            setTimeout(() => {
              const currentLocation = document.location.href;
              document.location.href = `/auth/login?redirect=${currentLocation}`;
            }, 1500);
          }
          setValidationError(
            convertGenericErrorToValidationError(
              d.errors as GraphqlErrorObj,
              dupkeyName
            )
          );
          if (onError) onError(d.errors as GraphqlErrorObj);
        } else {
          clearValidationError();
          if (onSuccess) onSuccess();
          toaster.create({
            type: "success",
            title: "Created resource",
            description: `Successfully created ${resourceName}`,
          });
        }
      });
  }

  async function updateResource<Returned, ThunkArg>(
    thunk: CrudResourceThunk<Returned, ThunkArg>,
    payload: ThunkArg
  ) {
    await dispatch(thunk(payload))
      .unwrap()
      .then((d) => {
        if (d && typeof d === "object" && "errors" in d) {
          if (
            (d.errors as GraphqlErrorObj).message ===
            "Unauthorized: No token provided"
          ) {
            toaster.error({
              title: "Session Expired",
              description: "Please login to continue.",
            });
            setTimeout(() => {
              const currentLocation = document.location.href;
              document.location.href = `/auth/login?redirect=${currentLocation}`;
            }, 1500);
          }
          setValidationError(
            convertGenericErrorToValidationError(
              d.errors as GraphqlErrorObj,
              dupkeyName
            )
          );
          if (onError) onError(d.errors as GraphqlErrorObj);
        } else {
          clearValidationError();
          if (onSuccess) onSuccess();
          toaster.create({
            type: "success",
            title: "Updated resource",
            description: `Successfully updated ${resourceName}`,
          });
        }
      });
  }

  async function deleteResource<Returned, ThunkArg>(
    thunk: CrudResourceThunk<Returned, ThunkArg>,
    payload: ThunkArg
  ) {
    await dispatch(thunk(payload))
      .unwrap()
      .then((d) => {
        if (d && typeof d === "object" && "errors" in d) {
          if (
            (d.errors as GraphqlErrorObj).message ===
            "Unauthorized: No token provided"
          ) {
            toaster.error({
              title: "Session Expired",
              description: "Please login to continue.",
            });
            setTimeout(() => {
              const currentLocation = document.location.href;
              document.location.href = `/auth/login?redirect=${currentLocation}`;
            }, 1500);
          }
          if (onError) onError(d.errors as GraphqlErrorObj);
        } else {
          clearValidationError();
          if (onSuccess) onSuccess();
          toaster.create({
            type: "success",
            title: "Deleted resource",
            description: `Successfully deleted ${resourceName}`,
          });
        }
      });
  }

  return {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    setValidationError,
    clearValidationError,
  };
}
