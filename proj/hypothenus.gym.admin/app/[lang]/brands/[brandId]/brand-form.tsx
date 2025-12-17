"use client"

import FormActionBar from "@/app/[lang]/components/actions/form-action-bar";
import FormActionButtons from "@/app/[lang]/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/[lang]/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/[lang]/components/errors/error-boundary";
import BrandInfo from "@/app/[lang]/components/brand/brand-info";
import Loader from "@/app/[lang]/components/navigation/loader";
import ToastSuccess from "@/app/[lang]/components/notifications/toast-success";
import i18n, { useTranslation } from "@/app/i18n/i18n";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { Crumb, pushBreadcrumb } from "@/app/lib/store/slices/breadcrumb-state-slice";
import { BrandState, updateBrandState } from "@/app/lib/store/slices/brand-state-slice";
import { Brand, BrandSchema } from "@/src/lib/entities/brand";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { delBrand, postActivateBrand, getBrand, postBrand, putBrand, postDeactivateBrand } from "@/app/lib/data/brands-data-service";

export default function BrandForm({ brandId }: { brandId: string }) {
    const { t } = useTranslation("entity");
    const router = useRouter();
    const pathname = usePathname();

    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState(false);
    const [textSuccess, setTextSuccess] = useState("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isActivating, setIsActivating] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const toggleSuccess = () => setSuccess(false);

    const formContext = useForm<Brand>({
        defaultValues: brandState.brand,
        resolver: zodResolver(BrandSchema),
    });

    useEffect(() => {
        if (isLoading && brandId !== "new") {
           fetchBrand(brandId);
        }

        if (isLoading && brandId == "new") {
            setIsEditMode(true);
            setIsLoading(false);
        }

        if (!isLoading) {
            formContext.reset(brandState.brand);
            initBreadcrumb(brandState.brand?.name);
        }
    }, [brandState]);

    function initBreadcrumb(name: string) {
        const crumb: Crumb = {
            id: "brand.[brandId].page",
            href: pathname,
            crumb: name
        };

        dispatch(pushBreadcrumb(crumb));
    }

    const fetchBrand = async (brandId: string) => {
        let brand: Brand = await getBrand(brandId);
        dispatch(updateBrandState(brand));

        initBreadcrumb(brand?.name);
        setIsLoading(false);
    }

    const onSubmit: SubmitHandler<Brand> = (formData: z.infer<typeof BrandSchema>) => {
        setIsEditMode(false);
        setIsSaving(true);

        if (brandState.brand.id == null) {
            createBrand(formData);
        } else {
            saveBrand(formData);
        }
    }

    const createBrand = async (formData: z.infer<typeof BrandSchema>) => {
        let result: Brand = await postBrand(formData as Brand);

        setSuccess(true);
        setTextSuccess(t("action.saveSuccess"));
        dispatch(updateBrandState(result));
        router.push(`/${i18n.resolvedLanguage}/brands/${result.brandId}`);

        setIsSaving(false);
    }

    const saveBrand = async (formData: z.infer<typeof BrandSchema>) => {
        let updatedBrand: Brand = mapForm(formData, brandState.brand);
        let result: Brand = await putBrand(updatedBrand);
        dispatch(updateBrandState(result));

        setTextSuccess(t("action.saveSuccess"));
        setSuccess(true);
        setIsSaving(false);
    }

    const activateBrand = async (brandId: string) => {
        let brand: Brand = await postActivateBrand(brandId);
        dispatch(updateBrandState(brand));
        setIsActivating(false);
        setTextSuccess(t("action.activationSuccess"));
        setSuccess(true);
    }

    const deactivateBrand = async (brandId: string) => {
        let brand: Brand = await postDeactivateBrand(brandId);
        dispatch(updateBrandState(brand));
        setIsActivating(false);
        setTextSuccess(t("action.deactivationSuccess"));
        setSuccess(true);
    }

    const deleteBrand = async (brandId: string) => {
        await delBrand(brandId);
        setTextSuccess(t("action.deleteSuccess"));
        setSuccess(true);

        setTimeout(function () {
            setShowDeleteConfirmation(false);
            setIsDeleting(false);
            router.push(`/${i18n.resolvedLanguage}/brands`);

        }, 2000);
    }

    function onCancel() {
        setIsEditMode(false);
        formContext.reset(brandState.brand);

        if (brandId == "new") {
            router.push(`/${i18n.resolvedLanguage}/brands`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        setIsActivating(true);
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
            setIsDeleting(true);
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
            brandId: brand.brandId,
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

                {isLoading &&
                    <div className="flex-fill w-100 h-100">
                        <Loader />
                    </div>
                }

                {!isLoading &&
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
                }
            </div>
        </ErrorBoundary>
    );
}
