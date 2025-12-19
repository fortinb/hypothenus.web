"use client"

import { Brand } from "@/src/lib/entities/brand";
import { Page } from "@/src/lib/entities/page";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import Loader from "@/app/ui/components/navigation/loader";
import PagingNavigation from "@/app/ui/components/navigation/paging-navigation";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { BrandsStatePaging, firstPage, nextPage, previousPage, resetSearchCriteria, setSearchCriteria } from "@/app/lib/store/slices/brands-state-paging-slice";
import BrandsList from "./brands-list";
import { clearBrandState } from "@/app/lib/store/slices/brand-state-slice";
import { fetchBrands, searchBrands } from "@/app/lib/data/brands-data-service";

export default function BrandsListPaging() {
  const brandsStatePaging: BrandsStatePaging = useSelector((state: any) => state.brandsStatePaging);
  const dispatch = useAppDispatch();

  const [pageOfBrands, setPageOfBrands] = useState<Page<Brand>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Reset brand state
    dispatch(clearBrandState());

    if (brandsStatePaging.searchActive) {
      searchBrandsPage(brandsStatePaging.page, brandsStatePaging.pageSize, brandsStatePaging.includeInactive, brandsStatePaging.searchCriteria);
    } else {
      fetchBrandsPage(brandsStatePaging.page, brandsStatePaging.pageSize, brandsStatePaging.includeInactive);
    }

  }, [dispatch, brandsStatePaging]);

  const fetchBrandsPage = async (page: number, pageSize: number, includeInactive: boolean) => {
    setIsLoading(true);

    const pageOfBrands: Page<Brand> = await fetchBrands(page, pageSize, includeInactive);

    setPageOfBrands(pageOfBrands);
    if (pageOfBrands?.content && pageOfBrands?.pageable) {
      setTotalPages(pageOfBrands.totalPages);
    }

    setIsLoading(false);
  }

  const searchBrandsPage = async (page: number, pageSize: number, includeInactive: boolean, criteria: String) => {
    setIsLoading(true);

    const pageOfBrands: Page<Brand> = await searchBrands(page, pageSize, includeInactive, criteria);

    setPageOfBrands(pageOfBrands);

    if (pageOfBrands?.content && pageOfBrands?.pageable) {
      setTotalPages(0); // Force 0 since we don"t know the total count of the search
    }

    setIsLoading(false);
  }

  function onSearchInput(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    if (e?.currentTarget?.value == "") {
      dispatch(resetSearchCriteria());
    }
  }

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (e.currentTarget) {
      const formData = new FormData(e.currentTarget);

      const searchCriteria = formData.get("searchCriteria")?.valueOf()?.toString() ?? "";
      if (searchCriteria?.length >= 2) {
        dispatch(setSearchCriteria(searchCriteria));
      }
      if (searchCriteria == "") {
        dispatch(resetSearchCriteria());
      }
    }
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
          <PagingNavigation page={brandsStatePaging.page + 1} totalPages={totalPages}
            onFirstPage={onFirstPage} onPreviousPage={onPreviousPage} onNextPage={onNextPage}
            searchActive={true} onSearch={onSearch} onSearchInput={onSearchInput} />
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
            <BrandsList pageOfBrands={pageOfBrands} />
          </div>
        }

      </div>
    </ErrorBoundary>
  );
}