import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MembershipPlanForm from '../membership-plan-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createMembershipPlanAction, saveMembershipPlanAction, deleteMembershipPlanAction, activateMembershipPlanAction, deactivateMembershipPlanAction } from '../actions';
import { useRouter } from 'next/navigation';
import { MembershipPlan, newMembershipPlan } from '@/src/lib/entities/membership-plan';
import { success } from '@/app/lib/http/handle-result';
import {
    logFormValidationErrors
} from '@/app/lib/test-utils/form-test-helpers';
import { newGym } from '@/src/lib/entities/gym';
import { newCourse } from '@/src/lib/entities/course';
import { MembershipPlanPeriodEnum } from '@/src/lib/entities/enum/membership-plan-period-enum';
import { BillingFrequencyEnum } from '@/src/lib/entities/enum/billing-frequency-enum';
import { newCurrency } from '@/src/lib/entities/pricing/currency';
import { LanguageEnum } from '@/src/lib/entities/enum/language-enum';
import moment from 'moment';

export const TEST_AVAILABLE_GYMS = [
    { gym: { ...newGym(), uuid: "gym1-uuid", brandUuid: "test-brand" }, label: "gymLabel1", value: 'gym1-uuid' },
    { gym: { ...newGym(), uuid: "gym2-uuid", brandUuid: "test-brand" }, label: "gymLabel2", value: 'gym2-uuid' },
    { gym: { ...newGym(), uuid: "gym3-uuid", brandUuid: "test-brand" }, label: "gymLabel3", value: 'gym3-uuid' }
];

export const TEST_AVAILABLE_COURSES = [
    { course: { ...newCourse(), uuid: "course1-uuid", brandUuid: "test-brand" }, label: "courseLabel1", value: 'course1-uuid' },
    { course: { ...newCourse(), uuid: "course2-uuid", brandUuid: "test-brand" }, label: "courseLabel2", value: 'course2-uuid' },
    { course: { ...newCourse(), uuid: "course3-uuid", brandUuid: "test-brand" }, label: "courseLabel3", value: 'course3-uuid' }
];

export const TEST_SELECTED_GYMS = [
    { gym: { ...newGym(), uuid: "gym1-uuid", brandUuid: "test-brand" }, label: "gymLabel1", value: 'gym1-uuid' },
    { gym: { ...newGym(), uuid: "gym3-uuid", brandUuid: "test-brand" }, label: "gymLabel3", value: 'gym3-uuid' }
];

export const TEST_SELECTED_COURSES = [
    { course: { ...newCourse(), uuid: "course1-uuid", brandUuid: "test-brand" }, label: "courseLabel1", value: 'course1-uuid' },
    { course: { ...newCourse(), uuid: "course3-uuid", brandUuid: "test-brand" }, label: "courseLabel3", value: 'course3-uuid' }
];

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en', membershipPlanId: 'test-membershipPlan' }),
}));

jest.mock('../actions', () => ({
    createMembershipPlanAction: jest.fn(),
    saveMembershipPlanAction: jest.fn(),
    activateMembershipPlanAction: jest.fn(),
    deactivateMembershipPlanAction: jest.fn(),
    deleteMembershipPlanAction: jest.fn(),
}));

jest.mock('@/app/lib/hooks/useToastResult', () => ({
    useToastResult: () => ({
        resultStatus: true,
        showResult: false,
        resultText: '',
        resultErrorTextCode: '',
        showResultToast: jest.fn(),
        toggleShowResult: jest.fn()
    }),
}));

jest.mock('@/app/ui/components/security/authorize', () => ({
    Authorize: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockMembershipPlan: MembershipPlan = newMembershipPlan();
mockMembershipPlan.uuid = null;

describe('MembershipPlanForm Integration Test', () => {
    const mockPush = jest.fn();

    // Test data constants
    const TEST_MEMBERSHIP_PLAN = {
        name: [
            { language: LanguageEnum.en, text: 'John' },
            { language: LanguageEnum.fr, text: 'Jean' }
        ],
        description: [
            { language: LanguageEnum.en, text: 'Doe' },
            { language: LanguageEnum.fr, text: 'Dupont' }
        ],
        title: [
            { language: LanguageEnum.en, text: 'Doe' },
            { language: LanguageEnum.fr, text: 'Dupont' }
        ],
        numberOfClasses: 20,
        period: MembershipPlanPeriodEnum.classes,
        billingFrequency: BillingFrequencyEnum.oneTime,
        cost: {
            amount: 199.99,
            currency: newCurrency()
        },
        durationInMonths: 12,
        guestPrivilege: true,
        isPromotional: true,
        isGiftCard: true,
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().add(1, 'year').format("YYYY-MM-DD"),
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createMembershipPlanAction as jest.Mock).mockImplementation(async (data: MembershipPlan) => success(data));
        (saveMembershipPlanAction as jest.Mock).mockImplementation(async (data: MembershipPlan) => success(data));
        (deleteMembershipPlanAction as jest.Mock).mockImplementation(async (data: MembershipPlan) => success(data));
        (activateMembershipPlanAction as jest.Mock).mockImplementation(async (data: MembershipPlan) => success(data));
        (deactivateMembershipPlanAction as jest.Mock).mockImplementation(async (data: MembershipPlan) => success(data));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    // Helper function to create a membershipPlan with uuid and full data from constants
    const createMockMembershipPlanWithData = (uuid: string): MembershipPlan => {
        const mockMembershipPlanWithData: MembershipPlan = newMembershipPlan();
        mockMembershipPlanWithData.uuid = uuid;

        mockMembershipPlanWithData.name[0].text = TEST_MEMBERSHIP_PLAN.name[0].text;
        mockMembershipPlanWithData.name[1].text = TEST_MEMBERSHIP_PLAN.name[1].text;
        mockMembershipPlanWithData.description[0].text = TEST_MEMBERSHIP_PLAN.description[0].text;
        mockMembershipPlanWithData.description[1].text = TEST_MEMBERSHIP_PLAN.description[1].text;
        mockMembershipPlanWithData.title[0].text = TEST_MEMBERSHIP_PLAN.title[0].text;
        mockMembershipPlanWithData.title[1].text = TEST_MEMBERSHIP_PLAN.title[1].text;
        mockMembershipPlanWithData.numberOfClasses = TEST_MEMBERSHIP_PLAN.numberOfClasses;
        mockMembershipPlanWithData.period = TEST_MEMBERSHIP_PLAN.period;
        mockMembershipPlanWithData.billingFrequency = TEST_MEMBERSHIP_PLAN.billingFrequency;
        mockMembershipPlanWithData.cost = TEST_MEMBERSHIP_PLAN.cost;
        mockMembershipPlanWithData.durationInMonths = TEST_MEMBERSHIP_PLAN.durationInMonths;
        mockMembershipPlanWithData.guestPrivilege = TEST_MEMBERSHIP_PLAN.guestPrivilege;
        mockMembershipPlanWithData.isPromotional = TEST_MEMBERSHIP_PLAN.isPromotional;
        mockMembershipPlanWithData.isGiftCard = TEST_MEMBERSHIP_PLAN.isGiftCard;
        mockMembershipPlanWithData.startDate = TEST_MEMBERSHIP_PLAN.startDate;
        mockMembershipPlanWithData.endDate = TEST_MEMBERSHIP_PLAN.endDate;
        return mockMembershipPlanWithData;
    };

    const fillBaseMembershipPlanFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const nameInputs = await screen.findAllByLabelText(/membershipPlan\.name/i);
        const descInputs = await screen.findAllByLabelText(/membershipPlan\.description/i);

        await user.type(nameInputs[0], TEST_MEMBERSHIP_PLAN.name[0].text);
        await user.type(nameInputs[1], TEST_MEMBERSHIP_PLAN.name[1].text);
        await user.type(descInputs[0], TEST_MEMBERSHIP_PLAN.description[0].text);
        await user.type(descInputs[1], TEST_MEMBERSHIP_PLAN.description[1].text);

        await user.selectOptions(screen.getByLabelText(/membershipPlan.period/i), TEST_MEMBERSHIP_PLAN.period);
        await user.selectOptions(screen.getByLabelText(/membershipPlan.billingFrequency/i), TEST_MEMBERSHIP_PLAN.billingFrequency);

        await user.type(screen.getByLabelText(/membershipPlan.numberOfClasses/i), TEST_MEMBERSHIP_PLAN.numberOfClasses.toString());
        const costAmount = await screen.findByLabelText(/membershipPlan.cost.amount/i);
        await user.clear(costAmount);
        await user.type(costAmount, TEST_MEMBERSHIP_PLAN.cost.amount.toString());

        await user.type(screen.getByLabelText(/membershipPlan.durationInMonths/i), TEST_MEMBERSHIP_PLAN.durationInMonths.toString());

        await user.click(screen.getByLabelText(/membershipPlan.guestPrivilege/i));
        await user.click(screen.getByLabelText(/membershipPlan.isPromotional/i));
        await user.click(screen.getByLabelText(/membershipPlan.isGiftCard/i));

        const titlesAccordionButton = await screen.findByText(/membershipPlan.titlesSection/i);
        await user.click(titlesAccordionButton);

        const titleInputs = await screen.findAllByLabelText(/membershipPlan\.title/i);
        await user.type(titleInputs[0], TEST_MEMBERSHIP_PLAN.title[0].text);
        await user.type(titleInputs[1], TEST_MEMBERSHIP_PLAN.title[1].text);

        const startDateInput = await screen.findByLabelText(/membershipPlan.startDate/i);
        const endDateInput = await screen.findByLabelText(/membershipPlan.endDate/i);

        await user.clear(startDateInput);
        await user.type(startDateInput, TEST_MEMBERSHIP_PLAN.startDate);
        await user.clear(endDateInput);
        await user.type(endDateInput, TEST_MEMBERSHIP_PLAN.endDate);
    };

    // Helper method to update membershipPlan fields with _update_ suffix
    const updateMembershipPlanFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const nameInputs = await screen.findAllByLabelText(/membershipPlan\.name/i);
        const descInputs = await screen.findAllByLabelText(/membershipPlan\.description/i);
        await user.clear(nameInputs[0]);
        await user.type(nameInputs[0], `${TEST_MEMBERSHIP_PLAN.name[0].text}_update_`);
        await user.clear(nameInputs[1]);
        await user.type(nameInputs[1], `${TEST_MEMBERSHIP_PLAN.name[1].text}_update_`);
        await user.clear(descInputs[0]);
        await user.type(descInputs[0], `${TEST_MEMBERSHIP_PLAN.description[0].text}_update_`);
        await user.clear(descInputs[1]);
        await user.type(descInputs[1], `${TEST_MEMBERSHIP_PLAN.description[1].text}_update_`);

        await user.selectOptions(screen.getByLabelText(/membershipPlan.period/i), MembershipPlanPeriodEnum.monthly);
        await user.selectOptions(screen.getByLabelText(/membershipPlan.billingFrequency/i), BillingFrequencyEnum.monthly);

        const numberOfClasses = await screen.findByLabelText(/membershipPlan.numberOfClasses/i);
        const costAmount = await screen.findByLabelText(/membershipPlan.cost.amount/i);
        const durationInMonths = await screen.findByLabelText(/membershipPlan.durationInMonths/i);

        await user.clear(numberOfClasses);
        await user.type(numberOfClasses, `99`);
        await user.clear(costAmount);
        await user.type(costAmount, `999.99`);
        await user.clear(durationInMonths);
        await user.type(durationInMonths, `3`);

        await user.click(screen.getByLabelText(/membershipPlan.guestPrivilege/i));
        await user.click(screen.getByLabelText(/membershipPlan.isPromotional/i));
        await user.click(screen.getByLabelText(/membershipPlan.isGiftCard/i));

        const titlesAccordionButton = await screen.findByText(/membershipPlan.titlesSection/i);
        await user.click(titlesAccordionButton);

        const titleInputs = await screen.findAllByLabelText(/membershipPlan\.title/i);
        await user.clear(titleInputs[0]);
        await user.type(titleInputs[0], `${TEST_MEMBERSHIP_PLAN.title[0].text}_update_`);
        await user.clear(titleInputs[1]);
        await user.type(titleInputs[1], `${TEST_MEMBERSHIP_PLAN.title[1].text}_update_`);

        // Expand dates accordion to access startDate/endDate fields
        const datesAccordionButton = await screen.findByText(/membershipPlan.datesSection/i);
        await user.click(datesAccordionButton);

        const startDateInput = await screen.findByLabelText(/membershipPlan.startDate/i);
        const endDateInput = await screen.findByLabelText(/membershipPlan.endDate/i);

        await user.clear(startDateInput);
        await user.type(startDateInput, moment().add(7, 'days').format("YYYY-MM-DD"));
        await user.clear(endDateInput);
        await user.type(endDateInput, moment().add(1, 'months').format("YYYY-MM-DD"));
    };

    it('new membershipPlan', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlan}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        // Act - fill the form
        await fillBaseMembershipPlanFields(user);

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(createMembershipPlanAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (createMembershipPlanAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly mapped
        expect(submittedData.name[0].text).toBe(TEST_MEMBERSHIP_PLAN.name[0].text);
        expect(submittedData.name[1].text).toBe(TEST_MEMBERSHIP_PLAN.name[1].text);
        expect(submittedData.description[0].text).toBe(TEST_MEMBERSHIP_PLAN.description[0].text);
        expect(submittedData.description[1].text).toBe(TEST_MEMBERSHIP_PLAN.description[1].text);
        expect(submittedData.period).toBe(TEST_MEMBERSHIP_PLAN.period);
        expect(submittedData.billingFrequency).toBe(TEST_MEMBERSHIP_PLAN.billingFrequency);
        expect(submittedData.numberOfClasses).toBe(TEST_MEMBERSHIP_PLAN.numberOfClasses);
        expect(submittedData.cost.amount).toBe(TEST_MEMBERSHIP_PLAN.cost.amount);
        expect(submittedData.durationInMonths).toBe(TEST_MEMBERSHIP_PLAN.durationInMonths);
        expect(submittedData.guestPrivilege).toBe(TEST_MEMBERSHIP_PLAN.guestPrivilege);
        expect(submittedData.isPromotional).toBe(TEST_MEMBERSHIP_PLAN.isPromotional);
        expect(submittedData.isGiftCard).toBe(TEST_MEMBERSHIP_PLAN.isGiftCard);
        expect(submittedData.title[0].text).toBe(TEST_MEMBERSHIP_PLAN.title[0].text);
        expect(submittedData.title[1].text).toBe(TEST_MEMBERSHIP_PLAN.title[1].text);
        expect(moment(submittedData.startDate).format("YYYY-MM-DD")).toBe(moment(TEST_MEMBERSHIP_PLAN.startDate).format("YYYY-MM-DD"));
        expect(moment(submittedData.endDate).format("YYYY-MM-DD")).toBe(moment(TEST_MEMBERSHIP_PLAN.endDate).format("YYYY-MM-DD"));

    }, 15000);

    it('update membershipPlan', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a membershipPlan with uuid and full data for update mode
        const mockMembershipPlanForUpdate = createMockMembershipPlanWithData('existing-membershipPlan-uuid');

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlanForUpdate}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/membershipPlan.period/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateMembershipPlanFields(user);

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert saveMembershipPlanAction was called (not createMembershipPlanAction since uuid exists)
        await waitFor(() => { expect(saveMembershipPlanAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (saveMembershipPlanAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly updated with _update_ suffix
        expect(submittedData.name[0].text).toBe(TEST_MEMBERSHIP_PLAN.name[0].text + '_update_');
        expect(submittedData.name[1].text).toBe(TEST_MEMBERSHIP_PLAN.name[1].text + '_update_');
        expect(submittedData.description[0].text).toBe(TEST_MEMBERSHIP_PLAN.description[0].text + '_update_');
        expect(submittedData.description[1].text).toBe(TEST_MEMBERSHIP_PLAN.description[1].text + '_update_');
        expect(submittedData.period).toBe(MembershipPlanPeriodEnum.monthly);
        expect(submittedData.billingFrequency).toBe(BillingFrequencyEnum.monthly);
        expect(submittedData.numberOfClasses).toBe(99);
        expect(submittedData.cost.amount).toBe(999.99);
        expect(submittedData.durationInMonths).toBe(3);
        expect(submittedData.guestPrivilege).toBe(false);
        expect(submittedData.isPromotional).toBe(false);
        expect(submittedData.isGiftCard).toBe(false);
        expect(submittedData.title[0].text).toBe(TEST_MEMBERSHIP_PLAN.title[0].text + '_update_');
        expect(submittedData.title[1].text).toBe(TEST_MEMBERSHIP_PLAN.title[1].text + '_update_');
        expect(moment(submittedData.startDate).format("YYYY-MM-DD")).toBe(moment().add(7, 'days').format("YYYY-MM-DD"));
        expect(moment(submittedData.endDate).format("YYYY-MM-DD")).toBe(moment().add(1, 'months').format("YYYY-MM-DD"));


    }, 15000);

    it('cancel edit', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a membershipPlan with uuid and full data for update mode
        const mockMembershipPlanForCancel = createMockMembershipPlanWithData('existing-membershipPlan-uuid-cancel');

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlanForCancel}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/membershipPlan.period/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateMembershipPlanFields(user);

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/membershipPlan.period/i)).toBeDisabled();

        // Verify all fields have been reset to original values
        const nameInputsAfterCancel = await screen.findAllByLabelText(/membershipPlan\.name/i);
        const descInputsAfterCancel = await screen.findAllByLabelText(/membershipPlan\.description/i);
        const periodAfterCancel = await screen.findByLabelText(/membershipPlan.period/i);
        const billingFrequencyAfterCancel = await screen.findByLabelText(/membershipPlan.billingFrequency/i);
        const numberOfClassesAfterCancel = await screen.findByLabelText(/membershipPlan.numberOfClasses/i);
        const costAmountAfterCancel = await screen.findByLabelText(/membershipPlan.cost.amount/i);
        const durationInMonthsAfterCancel = await screen.findByLabelText(/membershipPlan.durationInMonths/i);
        const guestPrivilegeAfterCancel = await screen.findByLabelText(/membershipPlan.guestPrivilege/i);
        const isPromotionalAfterCancel = await screen.findByLabelText(/membershipPlan.isPromotional/i);
        const isGiftCardAfterCancel = await screen.findByLabelText(/membershipPlan.isGiftCard/i);
        const startDateAfterCancel = await screen.findByLabelText(/membershipPlan.startDate/i);
        const endDateAfterCancel = await screen.findByLabelText(/membershipPlan.endDate/i);

        expect(nameInputsAfterCancel[0]).toHaveValue(TEST_MEMBERSHIP_PLAN.name[0].text);
        expect(nameInputsAfterCancel[1]).toHaveValue(TEST_MEMBERSHIP_PLAN.name[1].text);
        expect(descInputsAfterCancel[0]).toHaveValue(TEST_MEMBERSHIP_PLAN.description[0].text);
        expect(descInputsAfterCancel[1]).toHaveValue(TEST_MEMBERSHIP_PLAN.description[1].text);
        expect(periodAfterCancel).toHaveValue(TEST_MEMBERSHIP_PLAN.period);
        expect(billingFrequencyAfterCancel).toHaveValue(TEST_MEMBERSHIP_PLAN.billingFrequency);
        expect(numberOfClassesAfterCancel).toHaveValue(TEST_MEMBERSHIP_PLAN.numberOfClasses.toString());
        expect(costAmountAfterCancel).toHaveValue(TEST_MEMBERSHIP_PLAN.cost.amount.toString());
        expect(durationInMonthsAfterCancel).toHaveValue(TEST_MEMBERSHIP_PLAN.durationInMonths.toString());
        expect(guestPrivilegeAfterCancel).toBeChecked();
        expect(isPromotionalAfterCancel).toBeChecked();
        expect(isGiftCardAfterCancel).toBeChecked();
        expect(startDateAfterCancel).toHaveValue(moment(TEST_MEMBERSHIP_PLAN.startDate).format('YYYY-MM-DD'));
        expect(endDateAfterCancel).toHaveValue(moment(TEST_MEMBERSHIP_PLAN.endDate).format('YYYY-MM-DD'));

        const titlesAccordionButton = await screen.findByText(/membershipPlan.titlesSection/i);
        await user.click(titlesAccordionButton);

        const titleInputs = await screen.findAllByLabelText(/membershipPlan\.title/i);
        expect(titleInputs[0]).toHaveValue(TEST_MEMBERSHIP_PLAN.title[0].text);
        expect(titleInputs[1]).toHaveValue(TEST_MEMBERSHIP_PLAN.title[1].text);

        // Verify that neither action was called (no save occurred)
        expect(createMembershipPlanAction).not.toHaveBeenCalled();
        expect(saveMembershipPlanAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete membershipPlan', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a membershipPlan with uuid and full data
        const mockMembershipPlanForDelete = createMockMembershipPlanWithData('existing-membershipPlan-uuid-delete');

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlanForDelete}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        // Click the delete button (available when uuid exists)
        const deleteButton = screen.getByRole('button', { name: /form.bar.delete/i });
        expect(deleteButton).toBeEnabled();
        await user.click(deleteButton);

        // Wait for confirmation modal to appear
        expect(await screen.findByText(/membershipPlan.deleteConfirmation.title/i)).toBeInTheDocument();

        // Verify the modal text is present
        expect(await screen.findByText(/membershipPlan.deleteConfirmation.text/i)).toBeInTheDocument();

        // Verify confirmation buttons are present
        const yesButton = screen.getByText(/membershipPlan.deleteConfirmation.yes/i);
        const noButton = screen.getByText(/membershipPlan.deleteConfirmation.no/i);
        expect(yesButton).toBeInTheDocument();
        expect(noButton).toBeInTheDocument();

        // Click the Yes button to confirm deletion
        await user.click(yesButton);

        // Assert that deleteMembershipPlanAction was called

        await waitFor(() => { expect(deleteMembershipPlanAction).toHaveBeenCalledTimes(1); });

        // Verify the membershipPlan data was passed to the delete action
        const deletedMembershipPlan = (deleteMembershipPlanAction as jest.Mock).mock.calls[0][0];
        expect(deletedMembershipPlan.uuid).toBe(mockMembershipPlanForDelete.uuid);
    }, 15000);

    it('activate membershipPlan', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a membershipPlan with uuid and full data, initially inactive
        const mockMembershipPlanForActivate = createMockMembershipPlanWithData('existing-membershipPlan-uuid-activate');
        mockMembershipPlanForActivate.isActive = false;

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlanForActivate}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).not.toBeChecked(); // Initially inactive
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to activate the membershipPlan
        await user.click(activateCheckbox);

        // Assert that activateMembershipPlanAction was called
        await waitFor(() => { expect(activateMembershipPlanAction).toHaveBeenCalledTimes(1); });

        // Verify the membershipPlan data was passed to the activate action
        const activatedMembershipPlan = (activateMembershipPlanAction as jest.Mock).mock.calls[0][0];
        expect(activatedMembershipPlan.uuid).toBe(mockMembershipPlanForActivate.uuid);

        // Verify deactivateMembershipPlanAction was NOT called
        expect(deactivateMembershipPlanAction).not.toHaveBeenCalled();
    }, 15000);

    it('deactivate membershipPlan', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a membershipPlan with uuid and full data, initially active
        const mockMembershipPlanForDeactivate = createMockMembershipPlanWithData('existing-membershipPlan-uuid-deactivate');
        mockMembershipPlanForDeactivate.isActive = true;

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlanForDeactivate}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).toBeChecked(); // Initially active
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to deactivate the membershipPlan
        await user.click(activateCheckbox);

        // Assert that deactivateMembershipPlanAction was called
        await waitFor(() => { expect(deactivateMembershipPlanAction).toHaveBeenCalledTimes(1); });

        // Verify the membershipPlan data was passed to the deactivate action
        const deactivatedMembershipPlan = (deactivateMembershipPlanAction as jest.Mock).mock.calls[0][0];
        expect(deactivatedMembershipPlan.uuid).toBe(mockMembershipPlanForDeactivate.uuid);

        // Verify activateMembershipPlanAction was NOT called
        expect(activateMembershipPlanAction).not.toHaveBeenCalled();
    }, 15000);

    it('validates Zod schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlan}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );


        // Fill form with INVALID data
        const periodInput = await screen.findByLabelText(/membershipPlan.period/i);
        const durationInMonthsInput = await screen.findByLabelText(/membershipPlan.durationInMonths/i);
        const numberOfClassesInput = await screen.findByLabelText(/membershipPlan.numberOfClasses/i);
        const costAmountInput = await screen.findByLabelText(/membershipPlan.cost.amount/i);
        const startDateInput = screen.getByLabelText(/membershipPlan.startDate/i);
        const endDateInput = screen.getByLabelText(/membershipPlan.endDate/i);

        await user.clear(startDateInput);
        await user.type(startDateInput, moment().add(7, 'days').format("YYYY-MM-DD"));
        // End date before start date to trigger validation error
        await user.type(endDateInput, moment().add(1, 'days').format("YYYY-MM-DD"));

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/membershipPlan.validation.endDateGreaterThanStartDate/i)).toBeInTheDocument();

        await user.clear(startDateInput);
        await user.type(startDateInput, moment().format("YYYY-MM-DD"));
        await user.clear(endDateInput);
        await user.type(endDateInput, moment().format("YYYY-MM-DD"));
        await user.click(saveButton);

        expect(await screen.findByText(/membershipPlan.validation.endDateGreaterThanToday/i)).toBeInTheDocument();

        // Invalid 
        await user.type(numberOfClassesInput, "text-instead-of-number");
        await user.type(durationInMonthsInput, "text-instead-of-number");
        await user.type(costAmountInput, "text-instead-of-number");
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findAllByText(/validation.numericValue/i)).toHaveLength(2);
        await user.clear(numberOfClassesInput);
        await user.clear(durationInMonthsInput);
        await user.clear(costAmountInput);
        await user.type(numberOfClassesInput, "1");
        await user.type(durationInMonthsInput, "0");
        await user.type(costAmountInput, "1");

        await user.selectOptions(periodInput, MembershipPlanPeriodEnum.trial);
        await user.clear(numberOfClassesInput);
        await user.type(numberOfClassesInput, "2");
        await user.click(saveButton);
        expect(await screen.findByText(/membershipPlan.validation.onlyOneTrial/i)).toBeInTheDocument();

        await user.selectOptions(periodInput, MembershipPlanPeriodEnum.classes);
        await user.clear(durationInMonthsInput);
        await user.type(durationInMonthsInput, "-1");
        await user.click(saveButton);
        expect(await screen.findByText(/membershipPlan.validation.durationInMonthsInterval/i)).toBeInTheDocument();
        await user.clear(durationInMonthsInput);
        await user.type(durationInMonthsInput, "13");
        await user.click(saveButton);
        expect(await screen.findByText(/membershipPlan.validation.durationInMonthsInterval/i)).toBeInTheDocument();

        await user.selectOptions(periodInput, MembershipPlanPeriodEnum.classes);
        await user.clear(durationInMonthsInput);
        await user.type(durationInMonthsInput, "2.3");
        await user.clear(numberOfClassesInput);
        await user.type(numberOfClassesInput, "10.3");
        await user.click(saveButton);
        expect(await screen.findAllByText(/validation.integerValue/i)).toHaveLength(2);

        await waitFor(() => { expect(createMembershipPlanAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <MembershipPlanForm lang="en"
                    membershipPlan={mockMembershipPlan}
                    initialAvailableGymItems={TEST_AVAILABLE_GYMS}
                    initialAvailableCourseItems={TEST_AVAILABLE_COURSES}
                    initialSelectedCourseItems={TEST_SELECTED_COURSES}
                    initialSelectedGymItems={TEST_SELECTED_GYMS}
                />
            </Provider>
        );

        const titlesAccordionButton = await screen.findByText(/membershipPlan.titlesSection/i);
        await user.click(titlesAccordionButton);

        const startDateInput = screen.getByLabelText(/membershipPlan.startDate/i);
        await user.clear(startDateInput);

        // Try to submit without filling required fields
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect(await screen.findAllByText(/membershipPlan.validation.nameRequired/i)).toHaveLength(2);
        expect(await screen.findAllByText(/membershipPlan.validation.descriptionRequired/i)).toHaveLength(2);
        expect(await screen.findByText(/membershipPlan.validation.numberOfClassesRequired/i)).toBeInTheDocument();
        expect(await screen.findAllByText(/membershipPlan.validation.titleRequired/i)).toHaveLength(2);

        await waitFor(() => { expect(createMembershipPlanAction).not.toHaveBeenCalled(); });
    }, 15000);
});
