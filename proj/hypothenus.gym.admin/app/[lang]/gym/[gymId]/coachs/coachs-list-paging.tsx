"use client"

import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { CoachsStatePaging, firstPage, nextPage, previousPage } from "@/app/lib/store/slices/coachs-state-paging-slice";
import { Coach } from "@/src/lib/entities/coach";
import { Page } from "@/src/lib/entities/page";
import { AxiosRequestConfig } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../lib/hooks/useStore";
import ErrorBoundary from "../../../components/errors/error-boundary";
import Loader from "../../../components/navigation/loader";
import PagingNavigation from "../../../components/navigation/paging-navigation";
import CoachsList from "./coachs-list";

export default function CoachsListPaging({ gymId }: { gymId: string }) {
  const coachsStatePaging: CoachsStatePaging = useSelector((state: any) => state.coachsStatePaging);
  const dispatch = useAppDispatch();

  const [pageOfCoachs, setPageOfCoachs] = useState<Page<Coach>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCoachsPage(coachsStatePaging.page, coachsStatePaging.pageSize, coachsStatePaging.includeInactive);

  }, [coachsStatePaging]);

  const fetchCoachsPage = async (page: number, pageSize: number, includeInactive: boolean) => {
    setIsLoading(true);

    const requestContext: AxiosRequestConfig =
    {
      params: {
        page: page,
        pageSize: pageSize,
        includeInactive: includeInactive
      }
    };

    let response = await axiosInstance.get(`/api/gyms/${gymId}/coachs`, requestContext);

    let pageOfCoachs: Page<Coach> = response.data;

    setPageOfCoachs(pageOfCoachs);
    if (pageOfCoachs?.content && pageOfCoachs?.pageable) {
      setTotalPages(pageOfCoachs.totalPages);
    }

    setIsLoading(false);
  }

  const onFirstPage = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(firstPage());
  }

  const onPreviousPage = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(previousPage());
  }

  const onNextPage = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(nextPage());
  }

  return (
    <ErrorBoundary>
      <div className="d-flex flex-column justify-content-start w-100 h-100 page-part">
        <div>
          <PagingNavigation page={coachsStatePaging.page + 1} totalPages={totalPages}
            onFirstPage={onFirstPage} onPreviousPage={onPreviousPage} onNextPage={onNextPage}
            searchActive={false} />
        </div>
        <div>
          <hr />
        </div>

        {isLoading &&
          <div className="flex-fill w-100 h-100">
            <Loader />
          </div>
        }

        {!isLoading &&
          <div className="overflow-auto flex-fill w-100 h-100">
            <CoachsList pageOfCoachs={pageOfCoachs} />
          </div>
        }

      </div>
    </ErrorBoundary>
  );
}