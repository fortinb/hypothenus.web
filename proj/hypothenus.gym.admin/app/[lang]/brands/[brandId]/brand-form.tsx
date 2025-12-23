"use client"

import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import BrandInfo from "@/app/ui/components/brand/brand-info";
import ToastSuccess from "@/app/ui/components/notifications/toast-success";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { BrandState, updateBrandState } from "@/app/lib/store/slices/brand-state-slice";
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

export default function BrandForm({ lang, brandId, brand }: { lang: string; brandId: string; brand: Brand }) {
    const t = useTranslations("entity");

    const router = useRouter();
    const pathname = usePathname();

    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    const [isSaving, startTransitionSave] = useTransition();
    const [isActivating, startTransitionActivate] = useTransition();
    const [isDeleting, startTransitionDelete] = useTransition();
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const toggleSuccess = () => setSuccess(false);

    const formContext = useForm<Brand>({
        defaultValues: brand,
        resolver: zodResolver(BrandSchema),
    });

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

        let brand: Brand = mapForm(formData, brandState.brand);

        if (brandId === "new") {
            createBrand(brand);
        } else {
            saveBrand(brand);
        }
    }

    const createBrand = (brand: Brand) => {

        startTransitionSave(async () => {
            let result: Brand = await createBrandAction(brand, `/${lang}/brands/${brand.brandId}`);
            const duplicate = result.messages?.find(m => m.code == DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST)
            if (duplicate) {
                formContext.setError("brandId", { type: "manual", message: t("brand.validation.alreadyExists") });
                setIsEditMode(true);
            } else {
                setSuccess(true);
                setTextSuccess(t("action.saveSuccess"));
                dispatch(updateBrandState(result));

                router.push(`/${lang}/brands/${result.brandId}`);
            }

        });
    }

    const saveBrand = (brand: Brand) => {

        startTransitionSave(async () => {
            let result: Brand = await saveBrandAction(brandId, brand, `/${lang}/brands/${brand.brandId}`);
            dispatch(updateBrandState(result));

            setTextSuccess(t("action.saveSuccess"));
            setSuccess(true);

            setIsEditMode(true);
        });
    }

    const activateBrand = async (brandId: string) => {
        startTransitionActivate(async () => {
            let brand: Brand = await activateBrandAction(brandId, `/${lang}/brands/${brandId}`);
            dispatch(updateBrandState(brand));
            setTextSuccess(t("action.activationSuccess"));
            setSuccess(true);
        });
    }

    const deactivateBrand = async (brandId: string) => {
        startTransitionActivate(async () => {
            let brand: Brand = await deactivateBrandAction(brandId, `/${lang}/brands/${brandId}`);
            dispatch(updateBrandState(brand));
            setTextSuccess(t("action.deactivationSuccess"));
            setSuccess(true);
        });
    }

    const deleteBrand = async (brandId: string) => {
        startTransitionDelete(async () => {
            await deleteBrandAction(brandId);
            setTextSuccess(t("action.deleteSuccess"));
            setSuccess(true);
            setShowDeleteConfirmation(false);

            setTimeout(function () {
                router.push(`/${lang}/brands`);
            }, 1000);
        });
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
            activateBrand(brandState.brand.brandId);
        } else {
            deactivateBrand(brandState.brand.brandId);
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
            deleteBrand(brandState.brand.brandId);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (brandState.brand.id !== "") {
            setShowDeleteConfirmation(true);
        }
    }

    function mapForm(formData: z.infer<typeof BrandSchema>, brand: Brand): Brand {
        let updatedBrand: Brand = {
            id: brand.id,
            brandId: formData.brandId,
            name: formData.name,
            address: formData.address,
            email: formData.email,
            isActive: brand.isActive,
            note: formData.note,
            contacts: formData.contacts,
            phoneNumbers: formData.phoneNumbers,
            messages: undefined,
            createdBy: undefined,
            modifiedBy: undefined
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

                            <ToastSuccess show={success} text={textSuccess} toggleShow={toggleSuccess} />
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
