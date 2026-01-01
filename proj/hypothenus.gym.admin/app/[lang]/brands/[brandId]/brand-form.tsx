"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import BrandInfo from "@/app/ui/components/brand/brand-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { BrandState, clearBrandState, updateBrandState } from "@/app/lib/store/slices/brand-state-slice";
import { Brand, BrandSchema } from "@/src/lib/entities/brand";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState, useTransition } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { activateBrandAction, createBrandAction, deactivateBrandAction, deleteBrandAction, saveBrandAction } from "./actions";
import { DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";

export default function BrandForm({ lang, brandId, brand }: { lang: string; brandId: string; brand: Brand }) {
    const t = useTranslations("entity");

    const router = useRouter();
    const pathname = usePathname();

    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form State
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<Brand>({
        actions: {
            create: createBrandAction,
            save: saveBrandAction,
            activate: activateBrandAction,
            deactivate: deactivateBrandAction,
            delete: deleteBrandAction
        }
    });

    const formContext = useForm<Brand>({
        defaultValues: mapEntityToForm(brand),
        resolver: zodResolver(BrandSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    useEffect(() => {
        dispatch(updateBrandState(brand));

        if (brandId === "new") {
            setIsEditMode(true);
        }

        //  initBreadcrumb(brandState.brand?.name);
    }, [brand]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            reset: false,
            id: "brand.[brandId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const onSubmit: SubmitHandler<Brand> = (formData: z.infer<typeof BrandSchema>) => {
        setIsEditMode(false);

        let brand: Brand = mapFormToEntity(formData, brandState.brand);

        if (brandId === "new") {
            createBrand(brand);
        } else {
            saveBrand(brand);
        }
    }

    const createBrand = (brand: Brand) => {
        createEntity(
            brand,
            (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("brandId", { type: "manual", message: t("brand.validation.alreadyExists") });
                    setIsEditMode(true);
                } else {
                    dispatch(updateBrandState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/brands/${entity.brandId}`);
                }
            },
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveBrand = (brand: Brand) => {
        saveEntity(
            brandId, brand, `/${lang}/brands/${brand.brandId}`,
            (entity) => {
                dispatch(updateBrandState(entity));
                showResultToast(true, t("action.saveSuccess"));
                setIsEditMode(true);
            },
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const activateBrand = (brand: Brand) => {
        activateEntity(
            brandId, brand, `/${lang}/brands/${brand.brandId}`,
            (entity) => {
                dispatch(updateBrandState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateBrand = (brand: Brand) => {
        deactivateEntity(
            brandId, brand, `/${lang}/brands/${brand.brandId}`,
            (entity) => {
                dispatch(updateBrandState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteBrand = (brand: Brand) => {
        deleteEntity(
            brandId, brand, `/${lang}/brands/${brand.brandId}`,
            () => {
                dispatch(clearBrandState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/brands`);
                }, 1000);
            },
            (result) => {
                showResultToast(false, t("action.deleteError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    function onCancel() {
        setIsEditMode(false);
        formContext.reset(brandState.brand);

        if (brandId == "new") {
            router.push(`/${lang}/brands`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateBrand(brandState.brand);
        } else {
            deactivateBrand(brandState.brand);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (brandState.brand.id !== "") {
            if (isEditMode === true) {
                onCancel();
            } else {
                setIsEditMode(true);
            }
        }
    }

    function onDelete(confirmation: boolean) {
        if (confirmation) {
            deleteBrand(brandState.brand);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (brandState.brand.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(brand: Brand): z.infer<typeof BrandSchema> {
        return {
            brandId: brand.brandId,
            name: brand.name,
            address: brand.address,
            email: brand.email,
            note: brand.note,
            contacts: brand.contacts,
            phoneNumbers: brand.phoneNumbers
        };
    }

    function mapFormToEntity(formData: z.infer<typeof BrandSchema>, brand: Brand): Brand {
        let updatedBrand: Brand = {
            id: brand.id,
            brandId: formData.brandId,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            note: formData.note,
            contacts: formData.contacts,
            phoneNumbers: formData.phoneNumbers,
            isActive: brand.isActive,
            messages: undefined,
            createdBy: brand.createdBy,
            modifiedBy: brand.modifiedBy
        };

        return updatedBrand;
    }

    return (
        <ErrorBoundary>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>

                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="w-100 h-100">
                        <FormProvider {...formContext} >
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="brand_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={brandState.brand.brandId == "" ? true : brandState.brand.isActive}
                                    isEditDisable={isEditMode} isDeleteDisable={(brandState.brand.id == "" ? true : false)} isActivationDisabled={(brandState.brand.brandId == "" ? true : false)} isActivating={isActivating} />
                                <hr className="mt-1" />
                                <BrandInfo brand={brandState.brand} isEditMode={isEditMode} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="brand_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                            <ModalConfirmation title={t("brand.deleteConfirmation.title", { name: brandState.brand.name })} text={t("brand.deleteConfirmation.text")}
                                yesText={t("brand.deleteConfirmation.yes")} noText={t("brand.deleteConfirmation.no")}
                                actionText={t("brand.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />

                        </FormProvider>
                    </div>
                </div>

            </div>
        </ErrorBoundary>
    );
}
