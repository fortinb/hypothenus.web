"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import BrandInfo from "@/app/ui/components/brand/brand-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { BrandState, clearBrandState, updateBrandState } from "@/app/lib/store/slices/brand-state-slice";
import { Brand, BrandSchema } from "@/src/lib/entities/brand";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from 'zod';
import { activateBrandAction, createBrandAction, deactivateBrandAction, deleteBrandAction, saveBrandAction } from "./actions";
import { DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { uploadBrandLogo } from "@/app/lib/services/brands-data-service-client";
import { phoneNumberOrder } from "@/src/lib/entities/phoneNumber";

export default function BrandForm({ lang, brandId, brand }: { lang: string; brandId: string; brand: Brand }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form State
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [logoToUpload, setLogoToUpload] = useState<Blob>();
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

    const formContext = useForm<z.infer<typeof BrandSchema>>({
        defaultValues: mapEntityToForm(brand),
        resolver: zodResolver(BrandSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    function handleLogoToUpload(file: Blob) {
        setLogoToUpload(file);
    }

    useEffect(() => {
        dispatch(updateBrandState(brand));

        if (brandId === "new") {
            setIsEditMode(true);
        }

    }, [dispatch, brand, brandId]);

    const onSubmit: SubmitHandler<z.infer<typeof BrandSchema>> = (formData: z.infer<typeof BrandSchema>) => {
        setIsEditMode(false);

        let brand: Brand = mapFormToEntity(formData, brandState.brand);

        if (brandId === "new") {
            createBrand(brand);
        } else {
            saveBrand(brand);
        }
    }

    const uploadLogo = async (gymId: string, logo: Blob) => {
        const formData = new FormData();
        formData.append('file', logo);

        let response = await uploadBrandLogo(brandId, formData);

        return response;
    }

    const createBrand = (brand: Brand) => {
        createEntity(
            brand,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("brandId", { type: "manual", message: t("brand.validation.alreadyExists") });
                    setIsEditMode(true);
                } else {
                    dispatch(updateBrandState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/admin/brands/${entity.brandId}`);
                }
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveBrand = (brand: Brand) => {
        saveEntity(
            brandId, brand, `/${lang}/admin/brands/${brand.brandId}`,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success            
            (entity) => {
                dispatch(updateBrandState(entity));
                showResultToast(true, t("action.saveSuccess"));
                setIsEditMode(true);
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const beforeSave = async (brand: Brand) => {
        if (logoToUpload) {
            const logoUri = await uploadLogo(brand.brandId, logoToUpload);
            brand.logoUri = logoUri;
            setLogoToUpload(undefined);
        }
    }

    const activateBrand = (brand: Brand) => {
        activateEntity(
            brandId, brand, `/${lang}/admin/brands/${brand.brandId}`,
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
            brandId, brand, `/${lang}/admin/brands/${brand.brandId}`,
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
            brandId, brand, `/${lang}/admin/brands/${brand.brandId}`,
            () => {
                dispatch(clearBrandState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands`);
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
        formContext.reset(brandState.brand);

        if (brandId == "new") {
            router.push(`/${lang}/admin/brands`);
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
                setIsCancelling(false);
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

    // Update mapEntityToForm to return the schema-compatible object (exclude non-schema properties)
    function mapEntityToForm(brand: Brand): z.infer<typeof BrandSchema> {
        return {
            brandId: brand.brandId,
            name: brand.name,
            address: brand.address,
            email: brand.email,
            note: brand.note,
            phoneNumbers: brand.phoneNumbers,  // Assuming sorted as needed
            contacts: brand.contacts,
        };
    }

    // Update mapFormToEntity to map back to full Brand (add missing properties from original brand)
    function mapFormToEntity(formData: z.infer<typeof BrandSchema>, brand: Brand): Brand {
        return {
            ...brand,  // Preserve original properties like id, isActive, messages, etc.
            brandId: formData.brandId,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            note: formData.note,
            phoneNumbers: formData.phoneNumbers,
            contacts: formData.contacts,
        };
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
                                <BrandInfo brand={brandState.brand} isEditMode={isEditMode} uploadHandler={handleLogoToUpload} isCancelling={isCancelling} />
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
