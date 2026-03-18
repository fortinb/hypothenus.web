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

// Test data constants for member
export const TEST_AVAILABLE_GYMS = [
    { gym: { ...newGym(), uuid: "gym1-uuid", brandUuid: "test-brand" }, label: "gymLabel1", value: 'gym1-uuid' },
    { gym: { ...newGym(), uuid: "gym2-uuid", brandUuid: "test-brand" }, label: "gymLabel2", value: 'gym2-uuid' },
    { gym: { ...newGym(), uuid: "gym3-uuid", brandUuid: "test-brand" }, label: "gymLabel3", value: 'gym3-uuid' }
];

// Test data constants for member
export const TEST_AVAILABLE_COURSES = [
    { course: { ...newCourse(), uuid: "course1-uuid", brandUuid: "test-brand" }, label: "courseLabel1", value: 'course1-uuid' },
    { course: { ...newCourse(), uuid: "course2-uuid", brandUuid: "test-brand" }, label: "courseLabel2", value: 'course2-uuid' },
    { course: { ...newCourse(), uuid: "course3-uuid", brandUuid: "test-brand" }, label: "courseLabel3", value: 'course3-uuid' }
];

export const TEST_SELECTED_GYMS = [
    { gym: { ...newGym(), uuid: "gym1-uuid", brandUuid: "test-brand" }, label: "gymLabel1", value: 'gym1-uuid' },
    { gym: { ...newGym(), uuid: "gym3-uuid", brandUuid: "test-brand" }, label: "gymLabel3", value: 'gym3-uuid' }
];

// Test data constants for member
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
        isGiftCard: true
    };

    // MembershipPlan-specific invalid test data constants
    const INVALID_MEMBERSHIP_PLAN = {
        durationInMonths: 13,
        numberOfClasses: "shgfhd",
        cost: "-100"
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

        return mockMembershipPlanWithData;
    };

    const fillBaseMembershipPlanFields = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByLabelText(/membershipPlan.code/i), TEST_MEMBERSHIP_PLAN.code);

    };

    // Helper method to update membershipPlan fields with _update_ suffix
    const updateMembershipPlanFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const nameInput = screen.getByLabelText(/membershipPlan.name/i);


        await user.clear(nameInput);
        await user.type(nameInput, TEST_MEMBERSHIP_PLAN.name + '_update_');

    };

    it('new membershipPlan', async () => {
        const user = userEvent.setup();

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
        expect(submittedData.code).toBe(TEST_MEMBERSHIP_PLAN.code);


    }, 15000);



    it('update membershipPlan', async () => {
        const user = userEvent.setup();

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
        expect(await screen.findByLabelText(/membershipPlan.name/i)).not.toBeDisabled();

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
        expect(submittedData.code).toBe(TEST_MEMBERSHIP_PLAN.code);
        expect(submittedData.name).toBe(TEST_MEMBERSHIP_PLAN.name + '_update_');
        expect(submittedData.email).toBe('update_' + TEST_MEMBERSHIP_PLAN.email);
        expect(submittedData.note).toBe(TEST_MEMBERSHIP_PLAN.note + '_update_');


    }, 15000);

    it('cancel edit', async () => {
        const user = userEvent.setup();

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
        expect(await screen.findByLabelText(/membershipPlan.name/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateMembershipPlanFields(user);

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/membershipPlan.name/i)).toBeDisabled();

        // Verify all fields have been reset to original values
        const codeInputAfterCancel = screen.getByLabelText(/membershipPlan.code/i);
        const nameInputAfterCancel = screen.getByLabelText(/membershipPlan.name/i);
        const emailInputAfterCancel = screen.getByLabelText(/membershipPlan.email/i);
        const noteInputAfterCancel = screen.getByLabelText(/membershipPlan.note/i);

        expect(codeInputAfterCancel).toHaveValue(TEST_MEMBERSHIP_PLAN.code);
     
        // Verify that neither action was called (no save occurred)
        expect(createMembershipPlanAction).not.toHaveBeenCalled();
        expect(saveMembershipPlanAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete membershipPlan', async () => {
        const user = userEvent.setup();

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
        expect(deletedMembershipPlan.code).toBe(TEST_MEMBERSHIP_PLAN.code);
        expect(deletedMembershipPlan.name).toBe(TEST_MEMBERSHIP_PLAN.name);
    }, 15000);

    it('activate membershipPlan', async () => {
        const user = userEvent.setup();

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
        const user = userEvent.setup();

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
        const user = userEvent.setup();

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
        const codeInput = screen.getByLabelText(/membershipPlan.code/i);
        const nameInput = screen.getByLabelText(/membershipPlan.name/i);
        const emailInput = screen.getByLabelText(/membershipPlan.email/i);

        //  await user.type(codeInput, INVALID_MEMBERSHIP_PLAN.codeWithSpaces); // Invalid - no spaces allowed
        await user.type(nameInput, TEST_MEMBERSHIP_PLAN.name);
        await user.type(emailInput, INVALID_MEMBERSHIP_PLAN.invalidEmail); // Invalid email format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/membershipPlan.validation.noSpaceAllowed/i)).toBeInTheDocument();
        expect(await screen.findByText(/membershipPlan.validation.emailInvalid/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMembershipPlanAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup();

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

        // Try to submit without filling required fields
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect(await screen.findByText(/membershipPlan.validation.codeRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/membershipPlan.validation.nameRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMembershipPlanAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates code max length with Zod schema', async () => {
        const user = userEvent.setup();

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

        // Fill code with more than 20 characters
        const codeInput = screen.getByLabelText(/membershipPlan.code/i);

        await user.type(codeInput, INVALID_MEMBERSHIP_PLAN.codeTooLong); // 24 characters - exceeds max 20

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify max length validation error appears
        expect(await screen.findByText(/membershipPlan.validation.codeMaxLength/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMembershipPlanAction).not.toHaveBeenCalled(); });
    }, 15000)
});
