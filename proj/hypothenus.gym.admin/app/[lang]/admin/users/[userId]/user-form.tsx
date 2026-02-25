"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { UserState, clearUserState, updateUserState } from "@/app/lib/store/slices/user-state-slice";
import { User, UserSchema, RoleEnum } from "@/src/lib/entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from 'zod';
import { activateUserAction, createUserAction, deactivateUserAction, deleteUserAction, saveUserAction } from "./actions";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { Authorize } from "@/app/ui/components/security/authorize";
import UserInfo from "@/app/ui/components/user/user-info";
import { RoleSelectedItem } from "@/src/lib/entities/ui/role-selected-item";

export interface UserFormData {
    user: z.infer<typeof UserSchema>;
    selectedRoleItems: RoleSelectedItem[];
}

export const UserFormSchema = z.object({
    user: UserSchema,
    selectedRoleItems: z.any().array().min(1)
});

export default function UserForm({ lang, user, initialAvailableRoleItems, initialSelectedRoleItems }:
    {
        lang: string,
        user: User,
        initialAvailableRoleItems: RoleSelectedItem[],
        initialSelectedRoleItems: RoleSelectedItem[]
    }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const userState: UserState = useSelector((state: any) => state.userState);
    const dispatch = useAppDispatch();

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [isRoleItemsInitialized, setIsRoleItemsInitialized] = useState<boolean>(false);
    const [availableRoleItems, setAvailableRoleItems] = useState<RoleSelectedItem[]>([]);
    const [originalSelectedRoleItems, setOriginalSelectedRoleItems] = useState<RoleSelectedItem[]>([]);
    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<User>({
        actions: {
            create: createUserAction,
            save: saveUserAction,
            activate: activateUserAction,
            deactivate: deactivateUserAction,
            delete: deleteUserAction
        }
    });

    const formContext = useForm<UserFormData>({
        defaultValues: {
            user: mapEntityToForm(user),
            selectedRoleItems: initialSelectedRoleItems
        },
        mode: "all",
        resolver: zodResolver(UserFormSchema)
    });

    const { fields } = useFieldArray({
        control: formContext.control,
        name: "selectedRoleItems"
    });

    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    useEffect(() => {
        dispatch(updateUserState(user));

        if (user.uuid === null) {
            setIsEditMode(true);
        }

        // Initialize Roles Items
        if (!isRoleItemsInitialized) {
            setOriginalSelectedRoleItems(initialSelectedRoleItems);
            setAvailableRoleItems(initialAvailableRoleItems);

            setIsRoleItemsInitialized(true);
        }
    }, [dispatch, user, initialAvailableRoleItems, initialSelectedRoleItems, isRoleItemsInitialized]);

    const onSubmit: SubmitHandler<UserFormData> = (formData: z.infer<typeof UserFormSchema>) => {
        setIsEditMode(false);

        let user: User = mapFormToEntity(formData, userState.user);

        if (user.uuid === null) {
            createUser(user);
        } else {
            saveUser(user);
        }
    }

    const createUser = (user: User) => {
        createEntity(
            user,
            async (entity) => {
                // before save (none)
            },
            (entity) => {
                dispatch(updateUserState(entity));
                showResultToast(true, t("action.saveSuccess"));
                router.push(`/${lang}/admin/users/${entity.uuid}`);
            },
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveUser = (user: User) => {
        saveEntity(
            user, `/${lang}/admin/users/${user.uuid}`,
            async (entity) => {
                // before save (none)
            },
            (entity) => {
                dispatch(updateUserState(entity));
                showResultToast(true, t("action.saveSuccess"));
                setIsEditMode(true);
            },
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const activateUser = (user: User) => {
        activateEntity(
            user, `/${lang}/admin/users/${user.uuid}`,
            (entity) => {
                dispatch(updateUserState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateUser = (user: User) => {
        deactivateEntity(
            user, `/${lang}/admin/users/${user.uuid}`,
            (entity) => {
                dispatch(updateUserState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteUser = (user: User) => {
        deleteEntity(
            user, `/${lang}/admin/users/${user.uuid}`,
            () => {
                dispatch(clearUserState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/users`);
                }, 1000);
            },
            (result) => {
                showResultToast(false, t("action.deleteError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    function onCancel() {
        setIsEditMode(false);
        setIsCancelling(true);

        formContext.reset({
            user: userState.user,
            selectedRoleItems: originalSelectedRoleItems
        },);

        if (userState.user.uuid === null) {
            router.push(`/${lang}/admin/users`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateUser(userState.user);
        } else {
            deactivateUser(userState.user);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (userState.user.uuid !== null) {
            if (isEditMode === true) {
                onCancel();
            } else {
                setIsEditMode(true);
                setIsCancelling(false);
            }
        }
    }

    function onDelete(confirmation: boolean) {
        if (confirmation) {
            deleteUser(userState.user);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (userState.user.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(user: User) {
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            roles: user.roles
        };
    }
    
    function mapFormToEntity(formData: z.infer<typeof UserFormSchema>, user: User): User {
        return {
            ...user,
            firstname: formData.user.firstname,
            lastname: formData.user.lastname,
            email: formData.user.email,
            roles: formData.selectedRoleItems.map(item => {
                return item.value as RoleEnum;
            }),
        };
    }

    return (
        <>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>
                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="w-100 h-100">
                        <FormProvider {...formContext} >
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="user_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <Authorize roles={["admin", "manager"]}>
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={userState.user.uuid == null ? true : userState.user.isActive}
                                        isEditDisable={isEditMode} isDeleteDisable={(userState.user.uuid == null ? true : false)} isActivationDisabled={(userState.user.uuid == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                </Authorize>
                                <UserInfo formRolesStateField="selectedRoleItems" availableRoleItems={availableRoleItems} isEditMode={isEditMode} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="user_info_form" />
                            </Form>
                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                            <ModalConfirmation title={t("user.deleteConfirmation.title", { email: userState.user.email })} text={t("user.deleteConfirmation.text")}
                                yesText={t("user.deleteConfirmation.yes")} noText={t("user.deleteConfirmation.no")}
                                actionText={t("user.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />
                        </FormProvider>
                    </div>
                </div>
            </div>
        </>
    );
}
