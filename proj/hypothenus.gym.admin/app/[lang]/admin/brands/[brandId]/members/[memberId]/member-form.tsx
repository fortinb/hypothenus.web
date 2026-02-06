"use client"

import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { uploadMemberPhoto } from "@/app/lib/services/members-data-service-client";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { clearMemberState, MemberState, updateMemberState } from "@/app/lib/store/slices/member-state-slice";
import FormActionBar from "@/app/ui/components/actions/form-action-bar";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import MemberInfo from "@/app/ui/components/member/member-info";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { Member, MemberSchema } from "@/src/lib/entities/member";
import { formatPersonName } from "@/src/lib/entities/person";
import { phoneNumberOrder } from "@/src/lib/entities/phoneNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { activateMemberAction, createMemberAction, deactivateMemberAction, deleteMemberAction, saveMemberAction } from "./actions";
import { DOMAIN_EXCEPTION_MEMBER_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";

export default function MemberForm({ lang, member, gyms }: { lang: string; member: Member; gyms: GymListItem[] }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const memberState: MemberState = useSelector((state: any) => state.memberState);
    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form state
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [photoToUpload, setPhotoToUpload] = useState<Blob>();
    const [availableGymItems] = useState<GymListItem[]>(gyms);
    const { isSaving, isActivating, isDeleting, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<Member>({
        actions: {
            create: createMemberAction,
            save: saveMemberAction,
            activate: activateMemberAction,
            deactivate: deactivateMemberAction,
            delete: deleteMemberAction
        }
    });

    const formContext = useForm<z.infer<typeof MemberSchema>>({
        defaultValues: mapEntityToForm(member),
        resolver: zodResolver(MemberSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    function handlePhotoToUpload(file: Blob) {
        setPhotoToUpload(file);
    }

    // Watch the entire form
    // const formData = formContext.watch();

    /*   useEffect(() => {
           // Log the data to the console every time there is an error
           const hasErrors = Object.keys(formContext?.formState?.errors).length > 0
           if (hasErrors) {
               console.log("Current Form errors:", formContext.formState.errors);
           }
   
           // console.log("Current Form Data:", formData);
       }, [formData]);
       */

    useEffect(() => {
        dispatch(updateMemberState(member));

        if (member.uuid === null) {
            setIsEditMode(true);
        }
    }, [dispatch, member]);

    const onSubmit: SubmitHandler<z.infer<typeof MemberSchema>> = async (formData: z.infer<typeof MemberSchema>) => {
        setIsEditMode(false);

        let member: Member = mapFormToEntity(formData, memberState.member);

        if (member.uuid === null) {
            createMember(member);
        } else {
            saveMember(member);
        }
    }

    const uploadPhoto = async (brandUuid: string, memberUuid: string, photo: Blob) => {
        const formData = new FormData();
        formData.append('file', photo);

        let response = await uploadMemberPhoto(brandUuid, memberUuid, formData);
        return response;
    }

    const createMember = (member: Member) => {
        member.brandUuid = brandState.brand.uuid;

        createEntity(
            member,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            async (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_MEMBER_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("person.email", { type: "manual", message: "member.validation.alreadyExists" });
                    showResultToast(false, t("action.saveError"), undefined);
                    setIsEditMode(true);
                } else {
                    dispatch(updateMemberState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/admin/brands/${entity.brandUuid}/members/${entity.uuid}`);
                }
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    const saveMember = (member: Member) => {
        saveEntity(
            member, `/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`,
            // Before save
            async (entity) => {
                await beforeSave(entity);
            },
            // Success
            async (entity) => {
                dispatch(updateMemberState(entity));

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

    const beforeSave = async (member: Member) => {
        if (photoToUpload) {
            const photoUri = await uploadPhoto(member.brandUuid, member.uuid, photoToUpload);
            member.person.photoUri = photoUri;
            setPhotoToUpload(undefined);
        }
    }

    const activateMember = (member: Member) => {
        activateEntity(
            member, `/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`,
            (entity) => {
                dispatch(updateMemberState(entity));
                showResultToast(true, t("action.activationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.activationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deactivateMember = (member: Member) => {
        deactivateEntity(
            member, `/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`,
            (entity) => {
                dispatch(updateMemberState(entity));
                showResultToast(true, t("action.deactivationSuccess"));
            },
            (result) => {
                showResultToast(false, t("action.deactivationError"), !result.ok ? result.error?.message : undefined);
            }
        );
    }

    const deleteMember = (member: Member) => {
        deleteEntity(
            member, `/${lang}/admin/brands/${member.brandUuid}/members/${member.uuid}`,
            () => {
                dispatch(clearMemberState());
                showResultToast(true, t("action.deleteSuccess"));
                setShowDeleteConfirmation(false);
                setTimeout(function () {
                    router.push(`/${lang}/admin/brands/${member.brandUuid}/members`);
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
        setPhotoToUpload(undefined);

        formContext.reset(memberState.member);

        if (memberState.member.uuid === null) {
            router.push(`/${lang}/admin/brands/${memberState.member.brandUuid}/members`);
        }
    }

    function onActivation(e: ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.checked) {
            activateMember(memberState.member);
        } else {
            deactivateMember(memberState.member);
        }
    }

    function onEdit(e: MouseEvent<HTMLButtonElement>) {
        if (memberState.member.uuid !== null) {

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
            deleteMember(memberState.member);
        } else {
            setShowDeleteConfirmation(false);
        }
    }

    function onDeleteConfirmation(e: MouseEvent<HTMLButtonElement>) {
        if (memberState.member.uuid !== null) {
            setShowDeleteConfirmation(true);
        }
    }

    function mapEntityToForm(member: Member): z.infer<typeof MemberSchema> {
        const person = { ...member.person };

        // Sort the phoneNumbers array by the predefined order (Business -> Mobile -> Home)
        person.phoneNumbers = [...member.person.phoneNumbers].sort((a, b) => {
            const orderA = phoneNumberOrder[a.type];
            const orderB = phoneNumberOrder[b.type];
            return orderA - orderB;
        });

        return {
            person: person,
            memberType: member.memberType,
            preferredGymUuid: member.preferredGymUuid
        };
    }

    function mapFormToEntity(formData: z.infer<typeof MemberSchema>, member: Member): Member {
        return {
            ...member,  // Preserve original properties like id, isActive, messages, etc.
            person: formData.person,
            memberType: formData.memberType,
            preferredGymUuid: formData.preferredGymUuid
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
                            <Form as="form" className="d-flex flex-column justify-content-between w-100 h-100 p-2" id="member_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <FormActionBar onEdit={onEdit} onDelete={onDeleteConfirmation} onActivation={onActivation} isActivationChecked={memberState.member.uuid == null ? true : memberState.member.isActive}
                                    isEditDisable={isEditMode} isDeleteDisable={(memberState.member.uuid == null ? true : false)} isActivationDisabled={(memberState.member.uuid == null ? true : false)} isActivating={isActivating} />
                                <hr className="mt-1" />
                                <MemberInfo isEditMode={isEditMode} availableGymItems={availableGymItems} uploadHandler={handlePhotoToUpload} isCancelling={isCancelling} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="member_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                            <ModalConfirmation title={t("member.deleteConfirmation.title", { name: formatPersonName(memberState.member.person) })} text={t("member.deleteConfirmation.text")}
                                yesText={t("member.deleteConfirmation.yes")} noText={t("member.deleteConfirmation.no")}
                                actionText={t("member.deleteConfirmation.action")}
                                isAction={isDeleting}
                                show={showDeleteConfirmation} handleResult={onDelete} />

                        </FormProvider>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}