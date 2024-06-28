"use client"

import { Suspense } from "react";
import { useSelector } from "react-redux";
import { GymsPagingState } from "../lib/store/slices/gymsPagingSlice";
import GymsList from "./gyms-list";
import GymsListPending from "./gyms-list-pending";
import ErrorBoundary from "../lib/components/errors/error-boundary";


export default function GymsListPaging() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging?.value);
  //const dispatch = useDispatch();

  return (

    <Suspense fallback={<GymsListPending />}>
      <ErrorBoundary>
        <GymsList pageNumber={gymsPagingState.pageNumber} pageSize={gymsPagingState.pageSize} />
      </ErrorBoundary>
    </Suspense>
  );
}