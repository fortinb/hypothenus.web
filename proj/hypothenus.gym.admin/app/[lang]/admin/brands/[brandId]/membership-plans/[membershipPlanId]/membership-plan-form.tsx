"use client"

import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { clearMembershipPlanState, MembershipPlanState, updateMembershipPlanState } from "@/app/lib/store/slices/membership-plan-state-slice";
import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { MembershipPlan, MembershipPlanSchema, getMembershipPlanName } from "@/src/lib/entities/membership-plan";
import { LanguageEnum } from "@/src/lib/entities/enum/language-enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, Resolver, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { useFormDebug } from "@/app/lib/hooks/useFormDebug";
import { activateMembershipPlanAction, createMembershipPlanAction, deactivateMembershipPlanAction, deleteMembershipPlanAction, saveMembershipPlanAction } from "./actions";
import { CourseSelectedItem } from "@/src/lib/entities/ui/course-selected-item";
import { GymSelectedItem } from "@/src/lib/entities/ui/gym-selected-item";
import { Gym } from "@/src/lib/entities/gym";
import { Course } from "@/src/lib/entities/course";
import MembershipPlanInfo from "@/app/ui/components/membership-plan/membership-plan-info";

export interface MembershipPlanFormData {
    membershipPlan: z.infer<typeof MembershipPlanSchema>;
    selectedGymItems: GymSelectedItem[];
    selectedCourseItems: CourseSelectedItem[];
}

export const MembershipPlanFormSchema = z.object({
    membershipPlan: MembershipPlanSchema,
    selectedGymItems: z.any().array().min(1, { message: "membershipPlan.validation.includedGymsRequired" }),
    selectedCourseItems: z.any().array().min(1, { message: "membershipPlan.validation.includedCoursesRequired" })
});

export default function MembershipPlanForm({ lang, membershipPlan, initialAvailableGymItems, initialSelectedGymItems, initialAvailableCourseItems, initialSelectedCourseItems }:
    {
        lang: string;
        membershipPlan: MembershipPlan,
        initialAvailableGymItems: GymSelectedItem[],
        initialSelectedGymItems: GymSelectedItem[],
        initialAvailableCourseItems: CourseSelectedItem[],
        initialSelectedCourseItems: CourseSelectedItem[],
    }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const membershipPlanState: MembershipPlanState = useSelector((state: any) => state.membershipPlanState);
    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form state
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [isGymItemsInitialized, setIsGymItemsInitialized] = useState<boolean>(false);
    const [availableGymItems, setAvailableGymItems] = useState<GymSelectedItem[]>([]);
    const [originalSelectedGymItems, setOriginalSelectedGymItems] = useState<GymSelectedItem[]>([]);
    const [isCourseItemsInitialized, setIsCourseItemsInitialized] = useState<boolean>(false);
    const [availableCourseItems, setAvailableCourseItems] = useState<CourseSelectedItem[]>([]);
    const [originalSelectedCourseItems, setOriginalSelectedCourseItems] = useState<CourseSelectedItem[]>([]);

    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<MembershipPlan>({
        actions: {
            create: createMembershipPlanAction,
            save: saveMembershipPlanAction,
            activate: activateMembershipPlanAction,
            deactivate: deactivateMembershipPlanAction,
            delete: deleteMembershipPlanAction
        }
    });

    const formContext = useForm<MembershipPlanFormData>({
        defaultValues: {
            membershipPlan: mapEntityToForm(membershipPlan),
            selectedGymItems: initialSelectedGymItems,
            selectedCourseItems: initialSelectedCourseItems
        },
        mode: "all",
        resolver: zodResolver(MembershipPlanFormSchema) as Resolver<MembershipPlanFormData>
    });

    const { fields: gymFields } = useFieldArray({
        control: formContext.control,
        name: "selectedGymItems"
    });

    const { fields: courseFields } = useFieldArray({
        control: formContext.control,
        name: "selectedCourseItems"
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    // Watch the entire form and log errors when present (debug only)
    useFormDebug(formContext);

    useEffect(() => {
        dispatch(updateMembershipPlanState(membershipPlan));

        if (membershipPlan.uuid === null) {
            setIsEditMode(true);
        }

        // Initialize Gym Items
        if (!isGymItemsInitialized) {
            setOriginalSelectedGymItems(initialSelectedGymItems);
            setAvailableGymItems(initialAvailableGymItems);

            setIsGymItemsInitialized(true);
        }

        // Initialize Course Items
        if (!isCourseItemsInitialized) {
            setOriginalSelectedCourseItems(initialSelectedCourseItems);
            setAvailableCourseItems(initialAvailableCourseItems);

            setIsCourseItemsInitialized(true);
        }
    }, [dispatch, membershipPlan, initialAvailableGymItems, initialSelectedGymItems, initialAvailableCourseItems, initialSelectedCourseItems, isGymItemsInitialized, isCourseItemsInitialized]);

    const onSubmit: SubmitHandler<MembershipPlanFormData> = (formData: z.infer<typeof MembershipPlanFormSchema>) => {
        setIsEditMode(false);

        let membershipPlan: MembershipPlan = mapFormToEntity(formData, membershipPlanState.membershipPlan);

        if (membershipPlan.uuid === null) {
            createMembershipPlan(membershipPlan, formData.selectedGymItems, formData.selectedCourseItems);
        } else {
            saveMembershipPlan(membershipPlan, formData.selectedGymItems, formData.selectedCourseItems);
        }
    }

    const createMembershipPlan = (membershipPlan: MembershipPlan, selectedGymItems: GymSelectedItem[], selectedCourseItems: CourseSelectedItem[]) => {
        membershipPlan.brandUuid = brandState.brand.uuid;

        createEntity(
            membershipPlan,
            // Before save
            (_entity) => {
            },
            // Success
            async (entity) => {
                dispatch(updateMembershipPlanState(entity));
                showResultToast(true, t("action.saveSuccess"));

                setOriginalSelectedGymItems(selectedGymItems);
                setOriginalSelectedCourseItems(selectedCourseItems);
                router.push(`/${lang}/admin/brands/${entity.brandUuid}/membership-plans/${entity.uuid}`);
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveMembershipPlan = (membershipPlan: MembershipPlan, selectedGymItems: GymSelectedItem[], selectedCourseItems: CourseSelectedItem[]) => {
        saveEntity(
            membershipPlan, `/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`,
            // Before save
            (_entity) => {
            },
            // Success
            async (entity) => {
                dispatch(updateMembershipPlanState(entity));
                setOriginalSelectedGymItems(selectedGymItems);
                setOriginalSelectedCourseItems(selectedCourseItems);

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

    const activateMembershipPlan = (membershipPlan: MembershipPlan) => {
        activateEntity(
            membershipPlan, `/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`,
            (entity) => {
                dispatch(updateMembershipPlanState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateMembershipPlan = (membershipPlan: MembershipPlan) => {
        deactivateEntity(
            membershipPlan, `/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`,
            (entity) => {
                dispatch(updateMembershipPlanState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteMembershipPlan = (membershipPlan: MembershipPlan) => {
        deleteEntity(
            membershipPlan, `/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans/${membershipPlan.uuid}`,
            () => {
                dispatch(clearMembershipPlanState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${membershipPlan.brandUuid}/membership-plans`);
                }, 1000);
            },
            (result) => {
                showResultToast(false, t("action.deleteError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    function onCancel() {
        setIsCancelling(true);
        setIsEditMode(false);

        formContext.reset({
            membershipPlan: mapEntityToForm(membershipPlanState.membershipPlan),
            selectedGymItems: originalSelectedGymItems,
            selectedCourseItems: originalSelectedCourseItems
        },);

        if (membershipPlanState.membershipPlan.uuid === null) {
            router.push(`/${lang}/admin/brands/${membershipPlanState.membershipPlan.brandUuid}/membership-plans`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateMembershipPlan(membershipPlanState.membershipPlan);
        } else {
            deactivateMembershipPlan(membershipPlanState.membershipPlan);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (membershipPlanState.membershipPlan.uuid !== null) {

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
            deleteMembershipPlan(membershipPlanState.membershipPlan);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (membershipPlanState.membershipPlan.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }
    function mapEntityToForm(membershipPlan: MembershipPlan): z.infer<typeof MembershipPlanSchema> {
        return {
            name: membershipPlan.name,
            title: membershipPlan.title,
            description: membershipPlan.description,
            numberOfClasses: membershipPlan.numberOfClasses,
            period: membershipPlan.period,
            billingFrequency: membershipPlan.billingFrequency,
            cost: {
                amount: membershipPlan.cost.amount
            },
            durationInMonths: membershipPlan.durationInMonths,
            guestPrivilege: membershipPlan.guestPrivilege,
            isPromotional: membershipPlan.isPromotional,
            isGiftCard: membershipPlan.isGiftCard,
            includedGyms: membershipPlan.includedGyms?.map((gym) => {
                return {
                    uuid: gym.uuid,
                    brandUuid: gym.brandUuid,
                }
            }),
            includedCourses: membershipPlan.includedCourses?.map((course) => {
                return {
                    uuid: course.uuid,
                    brandUuid: course.brandUuid,
                }
            })
        };
    }
    function mapFormToEntity(formData: z.infer<typeof MembershipPlanFormSchema>, membershipPlan: MembershipPlan): MembershipPlan {
        return {
            ...membershipPlan,  // Preserve original properties like id, isActive, messages, etc.
            name: formData.membershipPlan.name,
            title: formData.membershipPlan.title,
            description: formData.membershipPlan.description,
            numberOfClasses: formData.membershipPlan.numberOfClasses,
            period: formData.membershipPlan.period,
            billingFrequency: formData.membershipPlan.billingFrequency,
            cost: {
                ...membershipPlan.cost,
                amount: formData.membershipPlan.cost.amount
            },
            durationInMonths: formData.membershipPlan.durationInMonths,
            guestPrivilege: formData.membershipPlan.guestPrivilege,
            isPromotional: formData.membershipPlan.isPromotional,
            isGiftCard: formData.membershipPlan.isGiftCard,
            includedGyms: formData.selectedGymItems.map((item) => {
                return item.gym as Gym;
            }),
            includedCourses: formData.selectedCourseItems.map((item) => {
                return item.course as Course;
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
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="membershipPlan_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={membershipPlanState.membershipPlan.uuid == null ? true : membershipPlanState.membershipPlan.isActive}
                                    isEditDisable={isEditMode} isDeleteDisable={(membershipPlanState.membershipPlan.uuid == null ? true : false)} isActivationDisabled={(membershipPlanState.membershipPlan.uuid == null ? true : false)} isActivating={isActivating} />
                                {<MembershipPlanInfo lang={lang}
                                    currency={membershipPlanState.membershipPlan.cost?.currency ?? { code: "", symbol: "" }}
                                    formGymsStateField="selectedGymItems"
                                    availableGymItems={availableGymItems}
                                    formCoursesStateField="selectedCourseItems"
                                    availableCourseItems={availableCourseItems}
                                    isEditMode={isEditMode} isCancelling={isCancelling}
                                />}
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="membershipPlan_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                            <ModalConfirmation title={t("membershipPlan.deleteConfirmation.title", { name: getMembershipPlanName(membershipPlanState.membershipPlan, lang as LanguageEnum) })} text={t("membershipPlan.deleteConfirmation.text")}
                                yesText={t("membershipPlan.deleteConfirmation.yes")} noText={t("membershipPlan.deleteConfirmation.no")}
                                actionText={t("membershipPlan.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />

                        </FormProvider>
                    </div>
                </div>
            </div>
        </>
    );
}
