"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
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
import { Authorize } from "@/app/ui/components/security/authorize";
import { debugLog, isDebug } from "@/app/lib/utils/debug";
import { useFormDebug } from "@/app/lib/hooks/useFormDebug";

export default function BrandForm({ lang, brand }: { lang: string; brand: Brand }) {
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

        if (brand.uuid === null) {
            setIsEditMode(true);
        }

    }, [dispatch, brand]);

    // Watch the entire form and log errors when present (debug only)
    useFormDebug(formContext);

    const onSubmit: SubmitHandler<z.infer<typeof BrandSchema>> = (formData: z.infer<typeof BrandSchema>) => {
        setIsEditMode(false);

        let brand: Brand = mapFormToEntity(formData, brandState.brand);

        if (brand.uuid === null) {
            createBrand(brand);
        } else {
            saveBrand(brand);
        }
    }

    const uploadLogo = async (brandUuid: string, logo: Blob) => {
        const formData = new FormData();
        formData.append('file', logo);

        let response = await uploadBrandLogo(brandUuid, formData);

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
                    formContext.setError("code", { type: "manual", message: "brand.validation.alreadyExists" });
                    showResultToast(false, t("action.saveError"), undefined);
                    setIsEditMode(true);
                } else {
                    dispatch(updateBrandState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/admin/brands/${entity.uuid}`);
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
            brand, `/${lang}/admin/brands/${brand.uuid}`,
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
            const logoUri = await uploadLogo(brand.uuid, logoToUpload);
            brand.logoUri = logoUri;
            setLogoToUpload(undefined);
        }
    }

    const activateBrand = (brand: Brand) => {
        activateEntity(
            brand, `/${lang}/admin/brands/${brand.uuid}`,
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
            brand, `/${lang}/admin/brands/${brand.uuid}`,
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
            brand, `/${lang}/admin/brands/${brand.uuid}`,
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

        if (brandState.brand.uuid === null) {
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
        if (brandState.brand.uuid !== null) {
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
        if (brandState.brand.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }

    // Update mapEntityToForm to return the schema-compatible object (exclude non-schema properties)
    function mapEntityToForm(brand: Brand): z.infer<typeof BrandSchema> {
        return {
            code: brand.code,
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
            code: formData.code,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            note: formData.note,
            phoneNumbers: formData.phoneNumbers,
            contacts: formData.contacts,
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
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="brand_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <Authorize roles="admin">
                                    <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={brandState.brand.uuid == null ? true : brandState.brand.isActive}
                                        isEditDisable={isEditMode} isDeleteDisable={(brandState.brand.uuid == null ? true : false)} isActivationDisabled={(brandState.brand.uuid == null ? true : false)} isActivating={isActivating} />
                                    <hr className="mt-1" />
                                </Authorize>
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
        </>
    );
}
