"use client"

import { User } from "@/src/lib/entities/user";
import { Page } from "@/src/lib/entities/page";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/app/ui/components/navigation/loader";
import PagingNavigation from "@/app/ui/components/navigation/paging-navigation";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { UsersStatePaging, firstPage, nextPage, previousPage, resetSearchCriteria, setSearchCriteria } from "@/app/lib/store/slices/users-state-paging-slice";
import { clearUserState } from "@/app/lib/store/slices/user-state-slice";
import { fetchUsers, searchUsers } from "@/app/lib/services/users-data-service-client";
import { ActionResult } from "@/app/lib/http/result";
import UsersList from "./users-list";
import { useRouter } from "next/navigation";

export default function UsersListPaging({ lang }: { lang: string }) {
    const usersStatePaging: UsersStatePaging = useSelector((state: any) => state.usersStatePaging);
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    const [pageOfUsers, setPageOfUsers] = useState<Page<User>>();
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsersPage = async (page: number, pageSize: number, includeInactive: boolean) => {
            setIsLoading(true);

            const pageOfUsers: ActionResult<Page<User>> = await fetchUsers(page, pageSize, includeInactive);
            if (pageOfUsers.ok) {
                setPageOfUsers(pageOfUsers.data);
                if (pageOfUsers.data.content && pageOfUsers?.data?.pageable) {
                    setTotalPages(pageOfUsers.data.totalPages);
                }
            } else {
                router.push(`/${lang}/error`);
            }

            setIsLoading(false);
        }

        const searchUsersPage = async (page: number, pageSize: number, includeInactive: boolean, criteria: String) => {
            setIsLoading(true);

            const pageOfUsers: ActionResult<Page<User>> = await searchUsers(page, pageSize, includeInactive, criteria);
            if (pageOfUsers.ok) {
                setPageOfUsers(pageOfUsers.data);

                if (pageOfUsers.data.content && pageOfUsers.data.pageable) {
                    setTotalPages(0); // Force 0 since we don"t know the total count of the search
                }
            } else {
                router.push(`/${lang}/error`);
            }

            setIsLoading(false);
        }

        // Reset user state
        dispatch(clearUserState());

        if (usersStatePaging.searchActive) {
            searchUsersPage(usersStatePaging.page, usersStatePaging.pageSize, usersStatePaging.includeInactive, usersStatePaging.searchCriteria);
        } else {
            fetchUsersPage(usersStatePaging.page, usersStatePaging.pageSize, usersStatePaging.includeInactive);
        }

    }, [dispatch, usersStatePaging]);

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
        <>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-part">
                <div>
                    <PagingNavigation page={usersStatePaging.page + 1} totalPages={totalPages}
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
                        <UsersList lang={lang} pageOfUsers={pageOfUsers} />
                    </div>
                }

            </div>
        </>
    );
}
