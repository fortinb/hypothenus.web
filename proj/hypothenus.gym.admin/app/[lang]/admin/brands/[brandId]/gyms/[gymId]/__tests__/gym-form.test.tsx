import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GymForm from '../gym-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createGymAction, saveGymAction, deleteGymAction, activateGymAction, deactivateGymAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Gym, newGym } from '@/src/lib/entities/gym';
import { success } from '@/app/lib/http/handle-result';
import { DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST } from '@/src/lib/entities/messages';
import { MessageSeverityEnum } from '@/src/lib/entities/messages';
import {
    TEST_ADDRESS,
    TEST_PHONE_NUMBERS,
    TEST_CONTACT,
    INVALID_PHONE,
    fillAddressSection,
    fillPhoneNumbersSection,
    fillContactsSection,
    updateAddressFields,
    updatePhoneNumbersFields,
    updateContactFields,
    logFormValidationErrors
} from '@/app/lib/test-utils/form-test-helpers';
import { newCoach } from '@/src/lib/entities/coach';

export const TEST_AVAILABLE_COACHS = [
    { coach: { ...newCoach(), uuid: "coach1-uuid", brandUuid: "test-brand" }, label: "coachLabel1", value: 'coach1-uuid' },
    { coach: { ...newCoach(), uuid: "coach2-uuid", brandUuid: "test-brand" }, label: "coachLabel2", value: 'coach2-uuid' },
    { coach: { ...newCoach(), uuid: "coach3-uuid", brandUuid: "test-brand" }, label: "coachLabel3", value: 'coach3-uuid' }
];

export const TEST_SELECTED_COACHS = [
    { coach: { ...newCoach(), uuid: "coach1-uuid", brandUuid: "test-brand" }, label: "coachLabel1", value: 'coach1-uuid' },
    { coach: { ...newCoach(), uuid: "coach3-uuid", brandUuid: "test-brand" }, label: "coachLabel3", value: 'coach3-uuid' }
];

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en', brandId: 'test-brand', gymId: 'test-gym' }),
}));

jest.mock('../actions', () => ({
    createGymAction: jest.fn(),
    saveGymAction: jest.fn(),
    activateGymAction: jest.fn(),
    deactivateGymAction: jest.fn(),
    deleteGymAction: jest.fn(),
}));

jest.mock('@/app/lib/hooks/useToastResult', () => ({
    useToastResult: () => ({
        resultStatus: true,
        showResult: false,
        resultText: '',
        resultErrorTextCode: '',
        showResultToast: jest.fn(),
        toggleShowResult: jest.fn(),
    }),
}));

jest.mock('@/app/lib/services/gyms-data-service-client', () => ({
    uploadGymLogo: jest.fn().mockResolvedValue('http://example.com/logo.png'),
}));

jest.mock('@/app/ui/components/security/authorize', () => ({
    Authorize: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockGym: Gym = newGym();
mockGym.uuid = null;
mockGym.phoneNumbers[0].number = '';
mockGym.phoneNumbers[1].number = '';

describe('GymForm Integration Test', () => {
    const mockPush = jest.fn();

    const TEST_GYM = {
        code: 'GYM123',
        name: 'Test Gym Inc.',
        email: 'contact@testgym.com',
        note: 'This is a test gym',
    };
    // Gym-specific invalid test data constants
    const INVALID_GYM = {
        codeWithSpaces: 'GYM CODE SPACES',
        invalidEmail: 'invalid-email',
        codeTooLong: 'VERYLONGGYMCODE123456',
        nameTooLong: 'A'.repeat(101),
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createGymAction as jest.Mock).mockImplementation(async (data: Gym) => success(data));
        (saveGymAction as jest.Mock).mockImplementation(async (data: Gym) => success(data));
        (deleteGymAction as jest.Mock).mockImplementation(async (data: Gym) => success(data));
        (activateGymAction as jest.Mock).mockImplementation(async (data: Gym) => success(data));
        (deactivateGymAction as jest.Mock).mockImplementation(async (data: Gym) => success(data));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const createMockGymWithData = (uuid: string): Gym => {
        const gym: Gym = newGym();
        gym.uuid = uuid;
        gym.code = TEST_GYM.code;
        gym.name = TEST_GYM.name;
        gym.email = TEST_GYM.email;
        gym.note = TEST_GYM.note;
        gym.address.civicNumber = TEST_ADDRESS.civicNumber;
        gym.address.streetName = TEST_ADDRESS.streetName;
        gym.address.city = TEST_ADDRESS.city;
        gym.address.state = TEST_ADDRESS.state;
        gym.address.zipCode = TEST_ADDRESS.zipCode;
        gym.phoneNumbers[0].number = TEST_PHONE_NUMBERS.business;
        gym.phoneNumbers[1].number = TEST_PHONE_NUMBERS.mobile;
        gym.contacts[0].firstname = TEST_CONTACT.firstname;
        gym.contacts[0].lastname = TEST_CONTACT.lastname;
        gym.contacts[0].description = TEST_CONTACT.description;
        return gym;
    };

    const fillBaseGymFields = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByLabelText(/gym.code/i), TEST_GYM.code);
        await user.type(screen.getByLabelText(/gym.name/i), TEST_GYM.name);
        await user.type(screen.getByLabelText(/gym.email/i), TEST_GYM.email);
        await user.type(screen.getByLabelText(/gym.note/i), TEST_GYM.note);
    };

    const updateGymFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const nameInput = screen.getByLabelText(/gym.name/i);
        const emailInput = screen.getByLabelText(/gym.email/i);
        const noteInput = screen.getByLabelText(/gym.note/i);

        await user.clear(nameInput);
        await user.type(nameInput, `${TEST_GYM.name}_update_`);
        await user.clear(emailInput);
        await user.type(emailInput, `update_${TEST_GYM.email}`);
        await user.clear(noteInput);
        await user.type(noteInput, `${TEST_GYM.note}_update_`);
    };

    it('new gym', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en"
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        await fillBaseGymFields(user);
        await fillAddressSection(user, 'gym.address');
        await fillPhoneNumbersSection(user, 'gym.phones');
        await fillContactsSection(user, 'gym.contacts', 'gym-contact-accordion-0');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(createGymAction).toHaveBeenCalledTimes(1); });

        const submittedData = (createGymAction as jest.Mock).mock.calls[0][0];
        expect(submittedData.code).toBe(TEST_GYM.code);
        expect(submittedData.name).toBe(TEST_GYM.name);
        expect(submittedData.email).toBe(TEST_GYM.email);
        expect(submittedData.note).toBe(TEST_GYM.note);

        // Ensure address structure is preserved
        expect(submittedData.address).toBeDefined();
        expect(submittedData.address.civicNumber).toBe(TEST_ADDRESS.civicNumber);
        expect(submittedData.address.streetName).toBe(TEST_ADDRESS.streetName);
        expect(submittedData.address.city).toBe(TEST_ADDRESS.city);
        expect(submittedData.address.state).toBe(TEST_ADDRESS.state);
        expect(submittedData.address.zipCode).toBe(TEST_ADDRESS.zipCode);

        // Validate phone numbers
        expect(submittedData.phoneNumbers).toBeInstanceOf(Array);
        expect(submittedData.phoneNumbers.length).toBeGreaterThanOrEqual(2);
        expect(submittedData.phoneNumbers[0].number).toBe(TEST_PHONE_NUMBERS.business);
        expect(submittedData.phoneNumbers[1].number).toBe(TEST_PHONE_NUMBERS.mobile);

        // Validate contacts
        expect(submittedData.contacts).toBeInstanceOf(Array);
        expect(submittedData.contacts.length).toBeGreaterThanOrEqual(1);
        expect(submittedData.contacts[0].firstname).toBe(TEST_CONTACT.firstname);
        expect(submittedData.contacts[0].lastname).toBe(TEST_CONTACT.lastname);
        expect(submittedData.contacts[0].description).toBe(TEST_CONTACT.description);
    }, 15000);

    it('new duplicate gym', async () => {
        const user = userEvent.setup({ delay: null });

        (createGymAction as jest.Mock).mockImplementation(async (data: Gym) =>
            success({
                ...data,
                messages: [
                    {
                        code: DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST,
                        description: 'Gym code already exists',
                        severity: MessageSeverityEnum.Error,
                    },
                ],
            })
        );

        render(
            <Provider store={store}>
                <GymForm lang="en"
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        await fillBaseGymFields(user);
        await fillAddressSection(user, 'gym.address');
        await fillPhoneNumbersSection(user, 'gym.phones');
        await fillContactsSection(user, 'gym.contacts', 'gym-contact-accordion-0');

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        // Assert
        await waitFor(() => { expect(createGymAction).toHaveBeenCalledTimes(1); });

        // Verify that the duplicate error message appears on the code field
        expect(await screen.findByText(/gym.validation.alreadyExists/i)).toBeInTheDocument();

        // Verify form stays in edit mode (save button should still be enabled)
        const saveButtonAfterError = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButtonAfterError).toBeEnabled();

        // Verify the code field has the error
        const codeInputAfterError = screen.getByLabelText(/gym.code/i);
        expect(codeInputAfterError).toHaveValue(TEST_GYM.code);
    }, 15000);

    it('update gym', async () => {
        const user = userEvent.setup({ delay: null });
        const mockGymForUpdate = createMockGymWithData('existing-gym-uuid');

        render(
            <Provider store={store}>
                <GymForm lang="en"
                    gym={mockGymForUpdate}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />

            </Provider>
        );

        await user.click(screen.getByRole('button', { name: /form.bar.edit/i }));
        expect(await screen.findByLabelText(/gym.name/i)).not.toBeDisabled();

        await updateGymFields(user);
        await updateAddressFields(user, 'gym.address');
        await updatePhoneNumbersFields(user, 'gym.phones', '(514) 111-1111', '(514) 222-2222');
        await updateContactFields(user, 'gym.contacts', 'gym-contact-accordion-0');

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(saveGymAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (saveGymAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly updated with _update_ suffix
        expect(submittedData.code).toBe(TEST_GYM.code);
        expect(submittedData.name).toBe(TEST_GYM.name + '_update_');
        expect(submittedData.email).toBe('update_' + TEST_GYM.email);
        expect(submittedData.note).toBe(TEST_GYM.note + '_update_');

        // Validate address updates
        expect(submittedData.address).toBeDefined();
        expect(submittedData.address.civicNumber).toBe(TEST_ADDRESS.civicNumber + '_update_');
        expect(submittedData.address.streetName).toBe(TEST_ADDRESS.streetName + '_update_');
        expect(submittedData.address.city).toBe(TEST_ADDRESS.city + '_update_');
        expect(submittedData.address.state).toBe(TEST_ADDRESS.state + '_update_');
        expect(submittedData.address.zipCode).toBe(TEST_ADDRESS.zipCode + '_update_');

        // Validate phone numbers updates
        expect(submittedData.phoneNumbers).toBeInstanceOf(Array);
        expect(submittedData.phoneNumbers.length).toBeGreaterThanOrEqual(2);
        expect(submittedData.phoneNumbers[0].number).toBe('(514) 111-1111');
        expect(submittedData.phoneNumbers[1].number).toBe('(514) 222-2222');

        // Validate contacts updates
        expect(submittedData.contacts).toBeInstanceOf(Array);
        expect(submittedData.contacts.length).toBeGreaterThanOrEqual(1);
        expect(submittedData.contacts[0].firstname).toBe(TEST_CONTACT.firstname + '_update_');
        expect(submittedData.contacts[0].lastname).toBe(TEST_CONTACT.lastname + '_update_');
        expect(submittedData.contacts[0].description).toBe(TEST_CONTACT.description + '_update_');
    }, 15000);

    it('cancel edit', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a gym with uuid and full data for update mode
        const mockGymForCancel = createMockGymWithData('existing-gym-uuid-cancel');

        render(
            <Provider store={store}>
                <GymForm lang="en"
                    gym={mockGymForCancel}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/gym.name/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateGymFields(user);
        await updateAddressFields(user, 'gym.address');
        await updatePhoneNumbersFields(user, 'gym.phones', '(514) 999-9999', '(514) 888-8888');
        await updateContactFields(user, 'gym.contacts', 'gym-contact-accordion-0');

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/gym.name/i)).toBeDisabled();

        // Verify all fields have been reset to original values
        const codeInputAfterCancel = screen.getByLabelText(/gym.code/i);
        const nameInputAfterCancel = screen.getByLabelText(/gym.name/i);
        const emailInputAfterCancel = screen.getByLabelText(/gym.email/i);
        const noteInputAfterCancel = screen.getByLabelText(/gym.note/i);

        expect(codeInputAfterCancel).toHaveValue(TEST_GYM.code);
        expect(nameInputAfterCancel).toHaveValue(TEST_GYM.name);
        expect(emailInputAfterCancel).toHaveValue(TEST_GYM.email);
        expect(noteInputAfterCancel).toHaveValue(TEST_GYM.note);

        // Verify address fields have been reset
        // Address accordion should still be visible from before
        const civicNumberInputAfterCancel = screen.getByLabelText(/address.civicNumber/i);
        const streetNameInputAfterCancel = screen.getByLabelText(/address.street/i);
        const cityInputAfterCancel = screen.getByLabelText(/address.city/i);
        const stateInputAfterCancel = screen.getByLabelText(/address.state/i);
        const zipCodeInputAfterCancel = screen.getByLabelText(/address.zipcode/i);

        expect(civicNumberInputAfterCancel).toHaveValue(TEST_ADDRESS.civicNumber);
        expect(streetNameInputAfterCancel).toHaveValue(TEST_ADDRESS.streetName);
        expect(cityInputAfterCancel).toHaveValue(TEST_ADDRESS.city);
        expect(stateInputAfterCancel).toHaveValue(TEST_ADDRESS.state);
        expect(zipCodeInputAfterCancel).toHaveValue(TEST_ADDRESS.zipCode);

        // Verify phone numbers have been reset
        // Expand phone numbers accordion
        const phonesAccordionButton = await screen.findByText(/gym.phones/i);

        // Get the accordion container to scope our queries (avoid conflicts with contact phone fields)
        const phonesSection = phonesAccordionButton.closest('.accordion-item') as HTMLElement;
        if (!phonesSection) throw new Error('Phone accordion section not found');

        expect(await within(phonesSection).findByLabelText(/phoneNumber.business/i)).toBeVisible();

        // Query within the phone section to avoid conflicts with contact phone fields
        const businessPhoneInputAfterCancel = within(phonesSection).getByLabelText(/phoneNumber.business/i);
        const mobilePhoneInputAfterCancel = within(phonesSection).getByLabelText(/phoneNumber.mobile/i);

        expect(businessPhoneInputAfterCancel).toHaveValue(TEST_PHONE_NUMBERS.business);
        expect(mobilePhoneInputAfterCancel).toHaveValue(TEST_PHONE_NUMBERS.mobile);

        // Verify contacts have been reset
        const firstnameInputAfterCancel = screen.getByLabelText(/person.firstname/i);
        const lastnameInputAfterCancel = screen.getByLabelText(/person.lastname/i);
        const descriptionInputAfterCancel = screen.getByLabelText(/person.description/i);

        expect(firstnameInputAfterCancel).toHaveValue(TEST_CONTACT.firstname);
        expect(lastnameInputAfterCancel).toHaveValue(TEST_CONTACT.lastname);
        expect(descriptionInputAfterCancel).toHaveValue(TEST_CONTACT.description);

        // Verify that neither action was called (no save occurred)
        expect(createGymAction).not.toHaveBeenCalled();
        expect(saveGymAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete gym', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a gym with uuid and full data
        const mockGymForDelete = createMockGymWithData('existing-gym-uuid-delete');

        render(
            <Provider store={store}>
                <GymForm lang="en"
                    gym={mockGymForDelete}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        // Click the delete button (available when uuid exists)
        const deleteButton = screen.getByRole('button', { name: /form.bar.delete/i });
        expect(deleteButton).toBeEnabled();
        await user.click(deleteButton);

        // Wait for confirmation modal to appear
        expect(await screen.findByText(/gym.deleteConfirmation.title/i)).toBeInTheDocument();

        // Verify the modal text is present
        expect(await screen.findByText(/gym.deleteConfirmation.text/i)).toBeInTheDocument();

        // Verify confirmation buttons are present
        const yesButton = screen.getByText(/gym.deleteConfirmation.yes/i);
        const noButton = screen.getByText(/gym.deleteConfirmation.no/i);
        expect(yesButton).toBeInTheDocument();
        expect(noButton).toBeInTheDocument();

        // Click the Yes button to confirm deletion
        await user.click(yesButton);

        // Assert that deleteGymAction was called
        await waitFor(() => { expect(deleteGymAction).toHaveBeenCalledTimes(1); }, { timeout: 3000 });

        // Verify the gym data was passed to the delete action
        const deletedGym = (deleteGymAction as jest.Mock).mock.calls[0][0];
        expect(deletedGym.uuid).toBe(mockGymForDelete.uuid);
        expect(deletedGym.code).toBe(TEST_GYM.code);
        expect(deletedGym.name).toBe(TEST_GYM.name);
    }, 15000);

    it('activate gym', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a gym with uuid and full data, initially inactive
        const mockGymForActivate = createMockGymWithData('existing-gym-uuid-activate');
        mockGymForActivate.isActive = false;

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGymForActivate}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).not.toBeChecked(); // Initially inactive
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to activate the gym
        await user.click(activateCheckbox);

        // Assert that activateGymAction was called
        await waitFor(() => { expect(activateGymAction).toHaveBeenCalledTimes(1); }, { timeout: 3000 });

        // Verify the gym data was passed to the activate action
        const activatedGym = (activateGymAction as jest.Mock).mock.calls[0][0];
        expect(activatedGym.uuid).toBe(mockGymForActivate.uuid);

        // Verify deactivateGymAction was NOT called
        expect(deactivateGymAction).not.toHaveBeenCalled();
    }, 15000);

    it('deactivate gym', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a gym with uuid and full data, initially active
        const mockGymForDeactivate = createMockGymWithData('existing-gym-uuid-deactivate');
        mockGymForDeactivate.isActive = true;

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGymForDeactivate}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).toBeChecked(); // Initially active
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to deactivate the gym
        await user.click(activateCheckbox);

        // Assert that deactivateGymAction was called
        await waitFor(() => { expect(deactivateGymAction).toHaveBeenCalledTimes(1); }, { timeout: 3000 });

        // Verify the gym data was passed to the deactivate action
        const deactivatedGym = (deactivateGymAction as jest.Mock).mock.calls[0][0];
        expect(deactivatedGym.uuid).toBe(mockGymForDeactivate.uuid);

        // Verify activateGymAction was NOT called
        expect(activateGymAction).not.toHaveBeenCalled();
    }, 15000);

    it('validates schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        await user.type(screen.getByLabelText(/gym.code/i), INVALID_GYM.codeWithSpaces);
        await user.type(screen.getByLabelText(/gym.name/i), TEST_GYM.name);
        await user.type(screen.getByLabelText(/gym.email/i), INVALID_GYM.invalidEmail);
        await user.click(screen.getByRole('button', { name: /form.buttons.save/i }));

        // Verify validation error messages appear in the DOM
        expect(screen.getByText(/gym.validation.noSpaceAllowed/i)).toBeInTheDocument();
        expect(screen.getByText(/gym.validation.emailInvalid/i)).toBeInTheDocument();

        await waitFor(() => expect(createGymAction).not.toHaveBeenCalled());

    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        await user.click(screen.getByRole('button', { name: /form.buttons.save/i }));

        expect(await screen.findByText(/gym.validation.codeRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/gym.validation.nameRequired/i)).toBeInTheDocument();

        await waitFor(() => expect(createGymAction).not.toHaveBeenCalled());
    }, 15000);

    it('validates code max length', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        await user.type(screen.getByLabelText(/gym.code/i), INVALID_GYM.codeTooLong);
        await user.click(screen.getByRole('button', { name: /form.buttons.save/i }));

        // Verify max length validation error appears
        expect(await screen.findByText(/gym.validation.codeMaxLength/i)).toBeInTheDocument();

        await waitFor(() => expect(createGymAction).not.toHaveBeenCalled());
    }, 15000);

    it('validates name max length', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        await user.type(screen.getByLabelText(/gym.name/i), INVALID_GYM.nameTooLong);
        await user.click(screen.getByRole('button', { name: /form.buttons.save/i }));

        // Verify max length validation error appears
        expect(await screen.findByText(/gym.validation.nameMaxLength/i)).toBeInTheDocument();

        await waitFor(() => expect(createGymAction).not.toHaveBeenCalled());
    }, 15000);

    it('validates phone number format with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        // Expand phone numbers accordion
        const phonesAccordionButton = screen.getByText(/gym.phones/i);
        await user.click(phonesAccordionButton);

        expect(await screen.findByLabelText(/phoneNumber.business/i)).toBeVisible();

        // Fill with INVALID phone number format
        const businessPhoneInput = screen.getByLabelText(/phoneNumber.business/i);
        await user.type(businessPhoneInput, INVALID_PHONE.invalidFormat); // Invalid format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify phone number format validation error appears
        expect(await screen.findByText(/phoneNumber.validation.phoneNumberFormat/i)).toBeInTheDocument();

        await waitFor(() => { expect(createGymAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates contact required fields with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <GymForm lang="en" 
                    gym={mockGym}
                    initialAvailableCoachItems={TEST_AVAILABLE_COACHS}
                    initialSelectedCoachItems={TEST_SELECTED_COACHS}
                />
            </Provider>
        );

        // Expand contacts accordion but leave firstname empty (required field)
        const contactsAccordionButton = screen.getByText(/gym.contacts/i);
        await user.click(contactsAccordionButton);

        expect(await screen.findByLabelText(/person.firstname/i)).toBeVisible();

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify contact required field validation error appears
        expect(await screen.findByText(/person.validation.firstnameRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/person.validation.lastnameRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/person.validation.descriptionRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createGymAction).not.toHaveBeenCalled(); });
    }, 15000);
});