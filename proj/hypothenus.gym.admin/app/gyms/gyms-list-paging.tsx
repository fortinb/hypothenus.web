"use client"

import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { GymsPagingState } from "../lib/store/slices/gymsPagingSlice";
import GymsList from "./gyms-list";
import GymsListPending from "./gyms-list-pending";
import ErrorBoundary from "../lib/components/errors/error-boundary";
import { activateSearch, deactivateSearch } from "../lib/store/slices/searchSlice";
import { useAppDispatch } from "../lib/hooks/useStore";

export default function GymsListPaging() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging?.value);
  const dispatch = useAppDispatch()
 
  useEffect(() => {
    dispatch(activateSearch());

    return () => {
      dispatch(deactivateSearch());
    };
  }, []);
  
  return (

    <Suspense fallback={<GymsListPending />}>
      <ErrorBoundary>
        <GymsList pageNumber={gymsPagingState.pageNumber} pageSize={gymsPagingState.pageSize} />
      </ErrorBoundary>
    </Suspense>
  );
}