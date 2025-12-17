"use client"

import ErrorBoundary from "@/app/[lang]/components/errors/error-boundary";
import Loader from "@/app/[lang]/components/navigation/loader";
import PagingNavigation from "@/app/[lang]/components/navigation/paging-navigation";
import axiosInstance from "@/app/lib/http/axiosInterceptor";
import { CoursesStatePaging, firstPage, nextPage, previousPage } from "@/app/lib/store/slices/courses-state-paging-slice";
import { Course } from "@/src/lib/entities/course";
import { Page } from "@/src/lib/entities/page";
import { AxiosRequestConfig } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import CoursesList from "./courses-list";
import { clearCourseState } from "@/app/lib/store/slices/course-state-slice";
import { fetchCourses } from "@/app/lib/data/courses-data-service";

export default function CoursesListPaging({ brandId, gymId }: { brandId: string; gymId: string }) {
  const coursesStatePaging: CoursesStatePaging = useSelector((state: any) => state.coursesStatePaging);
  const dispatch = useAppDispatch();

  const [pageOfCourses, setPageOfCourses] = useState<Page<Course>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Reset course state
    dispatch(clearCourseState());

    fetchCoursesPage(coursesStatePaging.page, coursesStatePaging.pageSize, coursesStatePaging.includeInactive);

  }, [dispatch, coursesStatePaging]);

  const fetchCoursesPage = async (page: number, pageSize: number, includeInactive: boolean) => {
    setIsLoading(true);

    let pageOfCourses: Page<Course> = await fetchCourses(brandId, gymId, page, pageSize, includeInactive);

    setPageOfCourses(pageOfCourses);
    if (pageOfCourses?.content && pageOfCourses?.pageable) {
      setTotalPages(pageOfCourses.totalPages);
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
          <PagingNavigation page={coursesStatePaging.page + 1} totalPages={totalPages}
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
            <CoursesList pageOfCourses={pageOfCourses} />
          </div>
        }

      </div>
    </ErrorBoundary>
  );
}