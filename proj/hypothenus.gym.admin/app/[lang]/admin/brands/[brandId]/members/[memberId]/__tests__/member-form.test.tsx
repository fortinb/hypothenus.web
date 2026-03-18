import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemberForm from '../member-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createMemberAction, saveMemberAction, deleteMemberAction, activateMemberAction, deactivateMemberAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Member, newMember } from '@/src/lib/entities/member';
import { success } from '@/app/lib/http/handle-result';
import {
    TEST_ADDRESS,
    TEST_PHONE_NUMBERS,
    TEST_CONTACT,
    INVALID_PHONE,
    fillAddressSection,
    fillPhoneNumbersSection,
    updateAddressFields,
    updatePhoneNumbersFields,
    logFormValidationErrors,
    TEST_PERSON,
    fillEmergencyContactsSection,
    updateEmergencyContactFields,
    INVALID_EMAIL
} from '@/app/lib/test-utils/form-test-helpers';
import { LanguageEnum } from '@/src/lib/entities/enum/language-enum';
import { newContact } from '@/src/lib/entities/contact';
import moment from 'moment';
import { newGym } from '@/src/lib/entities/gym';
import { MemberTypeEnum } from '@/src/lib/entities/enum/member-type-enum';

// Test data constants for member
export const TEST_AVAILABLE_GYMS = [
    { gym: { ...newGym(), uuid: "gym1-uuid", brandUuid: "test-brand"}, label: "gymLabel1", value: 'gym1-uuid' },
    { gym: { ...newGym(), uuid: "gym2-uuid", brandUuid: "test-brand" }, label: "gymLabel2", value: 'gym2-uuid' },
    { gym: { ...newGym(), uuid: "gym3-uuid", brandUuid: "test-brand" }, label: "gymLabel3", value: 'gym3-uuid' }
];

export const TEST_MEMBER = {
    memberType: MemberTypeEnum.regular,
    preferredGymUuid: "gym2-uuid"
};

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en', brandId: 'test-brand', memberId: 'test-member' }),
}));

jest.mock('../actions', () => ({
    createMemberAction: jest.fn(),
    saveMemberAction: jest.fn(),
    activateMemberAction: jest.fn(),
    deactivateMemberAction: jest.fn(),
    deleteMemberAction: jest.fn(),
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

jest.mock('@/app/lib/services/members-data-service-client', () => ({
    uploadMemberLogo: jest.fn().mockResolvedValue('http://example.com/logo.png'),
}));

jest.mock('@/app/ui/components/security/authorize', () => ({
    Authorize: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockMember: Member = newMember();
mockMember.uuid = null;
mockMember.person.phoneNumbers[0].number = '';
mockMember.person.phoneNumbers[1].number = '';
mockMember.person.contacts.push(newContact());

describe('MemberForm Integration Test', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createMemberAction as jest.Mock).mockImplementation(async (data: Member) => success(data));
        (saveMemberAction as jest.Mock).mockImplementation(async (data: Member) => success(data));
        (deleteMemberAction as jest.Mock).mockImplementation(async (data: Member) => success(data));
        (activateMemberAction as jest.Mock).mockImplementation(async (data: Member) => success(data));
        (deactivateMemberAction as jest.Mock).mockImplementation(async (data: Member) => success(data));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    // Helper function to create a member with uuid and full data from constants
    const createMockMemberWithData = (uuid: string): Member => {
        const mockMemberWithData: Member = newMember();
        mockMemberWithData.uuid = uuid;
        mockMemberWithData.memberType = TEST_MEMBER.memberType;
        mockMemberWithData.preferredGymUuid = TEST_MEMBER.preferredGymUuid;
        mockMemberWithData.person.dateOfBirth = TEST_PERSON.dateOfBirth;
        mockMemberWithData.person.firstname = TEST_PERSON.firstname;
        mockMemberWithData.person.lastname = TEST_PERSON.lastname;
        mockMemberWithData.person.email = TEST_PERSON.email;
        mockMemberWithData.person.communicationLanguage = TEST_PERSON.communicationLanguage;
        mockMemberWithData.person.note = TEST_PERSON.note;
        mockMemberWithData.person.address.civicNumber = TEST_ADDRESS.civicNumber;
        mockMemberWithData.person.address.streetName = TEST_ADDRESS.streetName;
        mockMemberWithData.person.address.city = TEST_ADDRESS.city;
        mockMemberWithData.person.address.state = TEST_ADDRESS.state;
        mockMemberWithData.person.address.zipCode = TEST_ADDRESS.zipCode;
        mockMemberWithData.person.phoneNumbers[0].number = TEST_PHONE_NUMBERS.home;
        mockMemberWithData.person.phoneNumbers[1].number = TEST_PHONE_NUMBERS.mobile;
        mockMemberWithData.person.contacts.push(newContact());
        mockMemberWithData.person.contacts[0].firstname = TEST_CONTACT.firstname;
        mockMemberWithData.person.contacts[0].lastname = TEST_CONTACT.lastname;
        mockMemberWithData.person.contacts[0].description = TEST_CONTACT.description;
        return mockMemberWithData;
    };
    const fillMemberFields = async (user: ReturnType<typeof userEvent.setup>) => {
         await user.selectOptions(screen.getByLabelText(/member.memberType/i), TEST_MEMBER.memberType);
         await user.selectOptions(screen.getByLabelText(/member.preferredGym/i), TEST_MEMBER.preferredGymUuid);
    };

    const updateMemberFields = async (user: ReturnType<typeof userEvent.setup>) => {
         await user.selectOptions(screen.getByLabelText(/member.memberType/i), MemberTypeEnum.premium);
         await user.selectOptions(screen.getByLabelText(/member.preferredGym/i), TEST_AVAILABLE_GYMS[1].value);
     };

    const fillPersonMemberFields = async (user: ReturnType<typeof userEvent.setup>) => {
        // Use selector to target only the person-info inputs (id starts with person_input_*)
        // to avoid conflicts with contact-info fields which share the same label text
        await user.type(screen.getByLabelText(/person.firstname/i, { selector: 'input[id^="person_input_firstname"]' }), TEST_PERSON.firstname);
        await user.type(screen.getByLabelText(/person.lastname/i, { selector: 'input[id^="person_input_lastname"]' }), TEST_PERSON.lastname);
        await user.type(screen.getByLabelText(/person.email/i, { selector: 'input[id^="person_input_email"]' }), TEST_PERSON.email);
        await user.type(screen.getByLabelText(/person.note/i), TEST_PERSON.note);
        await user.type(screen.getByLabelText(/person.dateOfBirth/i), TEST_PERSON.dateOfBirth);
        await user.selectOptions(screen.getByLabelText(/person.communicationLanguage/i), TEST_PERSON.communicationLanguage);
        await user.selectOptions(screen.getByLabelText(/member.memberType/i), MemberTypeEnum.regular);

    };

    const updatePersonMemberFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const firstnameInput = screen.getByLabelText(/person.firstname/i, { selector: 'input[id^="person_input_firstname"]' });
        const lastnameInput = screen.getByLabelText(/person.lastname/i, { selector: 'input[id^="person_input_lastname"]' });
        const emailInput = screen.getByLabelText(/person.email/i, { selector: 'input[id^="person_input_email"]' });
        const noteInput = screen.getByLabelText(/person.note/i);
        const dateOfBirthInput = screen.getByLabelText(/person.dateOfBirth/i);
        const communicationLanguageSelect = screen.getByLabelText(/person.communicationLanguage/i);

        await user.clear(firstnameInput);
        await user.type(firstnameInput, `${TEST_PERSON.firstname}_update_`);
        await user.clear(lastnameInput);
        await user.type(lastnameInput, `${TEST_PERSON.lastname}_update_`);
        await user.clear(emailInput);
        await user.type(emailInput, `update_${TEST_PERSON.email}`);
        await user.clear(noteInput);
        await user.type(noteInput, `${TEST_PERSON.note}_update_`);
        await user.clear(dateOfBirthInput);
        await user.type(dateOfBirthInput, moment('2000-01-01').toDate().toISOString());

        // Select field: pick a different valid option (suffix values are usually not valid <option> values)
        const updatedLanguage =
            TEST_PERSON.communicationLanguage === LanguageEnum.en ? LanguageEnum.fr : LanguageEnum.en;
        await user.selectOptions(communicationLanguageSelect, updatedLanguage);
     };

    it('new member', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMember} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Act - fill the form
        await fillMemberFields(user);
        await fillPersonMemberFields(user);
        await fillAddressSection(user, 'person.address');
        await fillPhoneNumbersSection(user, 'person.phones');
        await fillEmergencyContactsSection(user, 'person.contacts', 'person-contact-accordion-0');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(createMemberAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (createMemberAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly mapped
        expect(submittedData.person.firstname).toBe(TEST_PERSON.firstname);
        expect(submittedData.person.lastname).toBe(TEST_PERSON.lastname);
        expect(submittedData.person.email).toBe(TEST_PERSON.email);
        expect(submittedData.person.note).toBe(TEST_PERSON.note);
        expect(submittedData.person.dateOfBirth).toBe(TEST_PERSON.dateOfBirth);
        expect(submittedData.person.communicationLanguage).toBe(TEST_PERSON.communicationLanguage);
        expect(submittedData.memberType).toBe(MemberTypeEnum.regular);

        // Ensure address structure is preserved
        expect(submittedData.person.address).toBeDefined();
        expect(submittedData.person.address.civicNumber).toBe(TEST_ADDRESS.civicNumber);
        expect(submittedData.person.address.streetName).toBe(TEST_ADDRESS.streetName);
        expect(submittedData.person.address.city).toBe(TEST_ADDRESS.city);
        expect(submittedData.person.address.state).toBe(TEST_ADDRESS.state);
        expect(submittedData.person.address.zipCode).toBe(TEST_ADDRESS.zipCode);

        // Validate phone numbers
        expect(submittedData.person.phoneNumbers).toBeInstanceOf(Array);
        expect(submittedData.person.phoneNumbers.length).toBeGreaterThanOrEqual(2);
        expect(submittedData.person.phoneNumbers[0].number).toBe(TEST_PHONE_NUMBERS.home);
        expect(submittedData.person.phoneNumbers[1].number).toBe(TEST_PHONE_NUMBERS.mobile);

        // Validate contacts
        expect(submittedData.person.contacts).toBeInstanceOf(Array);
        expect(submittedData.person.contacts.length).toBeGreaterThanOrEqual(1);
        expect(submittedData.person.contacts[0].firstname).toBe(TEST_CONTACT.firstname);
        expect(submittedData.person.contacts[0].lastname).toBe(TEST_CONTACT.lastname);
        expect(submittedData.person.contacts[0].description).toBe(TEST_CONTACT.description);
    }, 15000);

    it('update member', async () => {
        const user = userEvent.setup();

        // Create a member with uuid and full data for update mode
        const mockMemberForUpdate = createMockMemberWithData('existing-member-uuid');

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMemberForUpdate} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.getByLabelText(/person.firstname/i, { selector: 'input[id^="person_input_firstname"]' })).not.toBeDisabled();

        // Update all fields using helper functions
        await updateMemberFields(user);
        await updatePersonMemberFields(user);
        await updateAddressFields(user, 'person.address');
        await updatePhoneNumbersFields(user, 'person.phones', null, '(514) 222-2222', '(514) 333-3333');
        await updateEmergencyContactFields(user, 'person.contacts', 'person-contact-accordion-0');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert saveMemberAction was called (not createMemberAction since uuid exists)
        await waitFor(() => { expect(saveMemberAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (saveMemberAction as jest.Mock).mock.calls[0][0];

        expect(submittedData.memberType).toBe(MemberTypeEnum.premium);
        expect(submittedData.preferredGymUuid).toBe(TEST_AVAILABLE_GYMS[1].value);
        // Validate the form inputs were correctly updated with _update_ suffix
        expect(submittedData.person.firstname).toBe(TEST_PERSON.firstname + '_update_');
        expect(submittedData.person.lastname).toBe(TEST_PERSON.lastname + '_update_');
        expect(submittedData.person.email).toBe('update_' + TEST_PERSON.email);
        expect(submittedData.person.note).toBe(TEST_PERSON.note + '_update_');
        expect(submittedData.person.dateOfBirth).toBe(moment('2000-01-01').toDate().toISOString());
        expect(submittedData.person.communicationLanguage).toBe(TEST_PERSON.communicationLanguage === LanguageEnum.en ? LanguageEnum.fr : LanguageEnum.en);

        // Validate address updates
        expect(submittedData.person.address).toBeDefined();
        expect(submittedData.person.address.civicNumber).toBe(TEST_ADDRESS.civicNumber + '_update_');
        expect(submittedData.person.address.streetName).toBe(TEST_ADDRESS.streetName + '_update_');
        expect(submittedData.person.address.city).toBe(TEST_ADDRESS.city + '_update_');
        expect(submittedData.person.address.state).toBe(TEST_ADDRESS.state + '_update_');
        expect(submittedData.person.address.zipCode).toBe(TEST_ADDRESS.zipCode + '_update_');

        // Validate phone numbers updates
        expect(submittedData.person.phoneNumbers).toBeInstanceOf(Array);
        expect(submittedData.person.phoneNumbers.length).toBeGreaterThanOrEqual(2);
        expect(submittedData.person.phoneNumbers[0].number).toBe('(514) 333-3333');
        expect(submittedData.person.phoneNumbers[1].number).toBe('(514) 222-2222');

        // Validate contacts updates
        expect(submittedData.person.contacts).toBeInstanceOf(Array);
        expect(submittedData.person.contacts.length).toBeGreaterThanOrEqual(1);
        expect(submittedData.person.contacts[0].firstname).toBe(TEST_CONTACT.firstname + '_update_');
        expect(submittedData.person.contacts[0].lastname).toBe(TEST_CONTACT.lastname + '_update_');
        expect(submittedData.person.contacts[0].description).toBe(TEST_CONTACT.description + '_update_');
    }, 15000);

    it('cancel edit', async () => {
        const user = userEvent.setup();

        // Create a member with uuid and full data for update mode
        const mockMemberForCancel = createMockMemberWithData('existing-member-uuid-cancel');

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMemberForCancel} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/person.firstname/i, { selector: 'input[id^="person_input_firstname"]' })).not.toBeDisabled();

        // Update all fields using helper functions
        await updatePersonMemberFields(user);
        await updateAddressFields(user, 'person.address');
        await updatePhoneNumbersFields(user, 'person.phones', null, '(514) 888-8888', '(514) 999-9999');
        await updateEmergencyContactFields(user, 'person.contacts', 'person-contact-accordion-0');

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/person.firstname/i, { selector: 'input[id^="person_input_firstname"]' })).toBeDisabled();

        // Verify all person fields have been reset to original values
        expect(screen.getByLabelText(/person.firstname/i, { selector: 'input[id^="person_input_firstname"]' })).toHaveValue(TEST_PERSON.firstname);
        expect(screen.getByLabelText(/person.lastname/i, { selector: 'input[id^="person_input_lastname"]' })).toHaveValue(TEST_PERSON.lastname);
        expect(screen.getByLabelText(/person.email/i, { selector: 'input[id^="person_input_email"]' })).toHaveValue(TEST_PERSON.email);
        expect(screen.getByLabelText(/person.note/i)).toHaveValue(TEST_PERSON.note);
        expect(screen.getByLabelText(/person.dateOfBirth/i)).toHaveValue(moment(TEST_PERSON.dateOfBirth).format('YYYY-MM-DD'));
        expect(screen.getByLabelText(/person.communicationLanguage/i)).toHaveValue(TEST_PERSON.communicationLanguage);

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
        const phonesAccordionButton = await screen.findByText(/person.phones/i);
        await user.click(phonesAccordionButton);

        // Get the accordion container to scope our queries (avoid conflicts with contact phone fields)
        const phonesSection = phonesAccordionButton.closest('.accordion-item') as HTMLElement;
        if (!phonesSection) throw new Error('Phone accordion section not found');

        expect(await within(phonesSection).findByLabelText(/phoneNumber.home/i)).toBeVisible();

        // Query within the phone section to avoid conflicts with contact phone fields
        const homePhoneInputAfterCancel = within(phonesSection).getByLabelText(/phoneNumber.home/i);
        const mobilePhoneInputAfterCancel = within(phonesSection).getByLabelText(/phoneNumber.mobile/i);

        expect(homePhoneInputAfterCancel).toHaveValue(TEST_PHONE_NUMBERS.home);
        expect(mobilePhoneInputAfterCancel).toHaveValue(TEST_PHONE_NUMBERS.mobile);

        // Verify contacts have been reset
        const contactsAccordionButton = screen.getByText(/person.contacts/i);
        await user.click(contactsAccordionButton);

        // Wait for inner contact accordion to appear (first contact)
        expect(await screen.findByTestId(/person-contact-accordion-0/i)).toBeInTheDocument();

        // Expand the first contact's accordion to access the actual fields
        const firstContactAccordionButton = screen.getByTestId(/person-contact-accordion-0/i);
        await user.click(firstContactAccordionButton);

        const contactSection = firstContactAccordionButton.closest('.accordion-item') as HTMLElement;
        if (!contactSection) throw new Error('Contact accordion section not found');

        const firstnameInputAfterCancel = await within(contactSection).findByLabelText(/person.firstname/i);
        const lastnameInputAfterCancel = await within(contactSection).findByLabelText(/person.lastname/i);
        const descriptionInputAfterCancel = await within(contactSection).findByLabelText(/person.description/i);

        expect(firstnameInputAfterCancel).toHaveValue(TEST_CONTACT.firstname);
        expect(lastnameInputAfterCancel).toHaveValue(TEST_CONTACT.lastname);
        expect(descriptionInputAfterCancel).toHaveValue(TEST_CONTACT.description);

        // Verify that neither action was called (no save occurred)
        expect(createMemberAction).not.toHaveBeenCalled();
        expect(saveMemberAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete member', async () => {
        const user = userEvent.setup();

        // Create a member with uuid and full data
        const mockMemberForDelete = createMockMemberWithData('existing-member-uuid-delete');

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMemberForDelete} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Click the delete button (available when uuid exists)
        const deleteButton = screen.getByRole('button', { name: /form.bar.delete/i });
        expect(deleteButton).toBeEnabled();
        await user.click(deleteButton);

        // Wait for confirmation modal to appear
        expect(await screen.findByText(/member.deleteConfirmation.title/i)).toBeInTheDocument();

        // Verify the modal text is present
        expect(await screen.findByText(/member.deleteConfirmation.text/i)).toBeInTheDocument();

        // Verify confirmation buttons are present
        const yesButton = screen.getByText(/member.deleteConfirmation.yes/i);
        const noButton = screen.getByText(/member.deleteConfirmation.no/i);
        expect(yesButton).toBeInTheDocument();
        expect(noButton).toBeInTheDocument();

        // Click the Yes button to confirm deletion
        await user.click(yesButton);

        await waitFor(() => { expect(deleteMemberAction).toHaveBeenCalledTimes(1); });

        // Verify the member data was passed to the delete action
        const deletedMember = (deleteMemberAction as jest.Mock).mock.calls[0][0];
        expect(deletedMember.uuid).toBe(mockMemberForDelete.uuid);
    }, 15000);

    it('activate member', async () => {
        const user = userEvent.setup();

        // Create a member with uuid and full data, initially inactive
        const mockMemberForActivate = createMockMemberWithData('existing-member-uuid-activate');
        mockMemberForActivate.isActive = false;
        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMemberForActivate} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).not.toBeChecked(); // Initially inactive
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to activate the member
        await user.click(activateCheckbox);

        // Assert that activateMemberAction was called
        await waitFor(() => { expect(activateMemberAction).toHaveBeenCalledTimes(1); });

        // Verify the member data was passed to the activate action
        const activatedMember = (activateMemberAction as jest.Mock).mock.calls[0][0];
        expect(activatedMember.uuid).toBe(mockMemberForActivate.uuid);

        // Verify deactivateMemberAction was NOT called
        expect(deactivateMemberAction).not.toHaveBeenCalled();
    }, 15000);

    it('deactivate member', async () => {
        const user = userEvent.setup();

        // Create a member with uuid and full data, initially active
        const mockMemberForDeactivate = createMockMemberWithData('existing-member-uuid-deactivate');
        mockMemberForDeactivate.isActive = true;

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMemberForDeactivate} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).toBeChecked(); // Initially active
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to deactivate the member
        await user.click(activateCheckbox);

        // Assert that deactivateMemberAction was called
        await waitFor(() => { expect(deactivateMemberAction).toHaveBeenCalledTimes(1); });

        // Verify the member data was passed to the deactivate action
        const deactivatedMember = (deactivateMemberAction as jest.Mock).mock.calls[0][0];
        expect(deactivatedMember.uuid).toBe(mockMemberForDeactivate.uuid);

        // Verify activateMemberAction was NOT called
        expect(activateMemberAction).not.toHaveBeenCalled();
    }, 15000);

    it('validates Zod schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMember} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Fill form with INVALID data
        const emailInput = screen.getByLabelText(/person.email/i, { selector: 'input[id^="person_input_email"]' });

        await user.type(emailInput, INVALID_EMAIL.invalidEmail); // Invalid email format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/validation.emailInvalid/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMember} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Try to submit without filling required fields
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect((await screen.findAllByText(/person.validation.firstnameRequired/i))).toHaveLength(2);
        expect((await screen.findAllByText(/person.validation.lastnameRequired/i))).toHaveLength(2);

        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates phone number format with Zod schema', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMember} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Expand phone numbers accordion
        const phonesAccordionButton = screen.getByText(/person.phones/i);
        await user.click(phonesAccordionButton);

        // Get the accordion container to scope our queries (avoid conflicts with contact phone fields)
        const phonesSection = phonesAccordionButton.closest('.accordion-item') as HTMLElement;
        if (!phonesSection) throw new Error('Phone accordion section not found');

        expect(await within(phonesSection).findByLabelText(/phoneNumber.home/i)).toBeVisible();

        // Fill with INVALID phone number format
        const homePhoneInput = await within(phonesSection).findByLabelText(/phoneNumber.home/i);
        await user.type(homePhoneInput, INVALID_PHONE.invalidFormat); // Invalid format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify phone number format validation error appears
        expect(await screen.findByText(/phoneNumber.validation.phoneNumberFormat/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates contact required fields with Zod schema', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemberForm lang="en" member={mockMember} 
                    gyms={TEST_AVAILABLE_GYMS}/>
            </Provider>
        );

        // Expand contacts accordion but leave firstname empty (required field)
        const contactsAccordionButton = screen.getByText(/person.contacts/i);
        await user.click(contactsAccordionButton);

        // Wait for inner contact accordion to appear (first contact)
        expect(await screen.findByTestId(/person-contact-accordion-0/i)).toBeInTheDocument();

        // Expand the first contact's accordion to access the actual fields
        const firstContactAccordionButton = screen.getByTestId(/person-contact-accordion-0/i);
        await user.click(firstContactAccordionButton);

        const contactSection = firstContactAccordionButton.closest('.accordion-item') as HTMLElement;
        if (!contactSection) throw new Error('Contact accordion section not found');

        expect(await within(contactSection).findByLabelText(/person.firstname/i)).toBeVisible();

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify contact required field validation error appears
        expect(await within(contactSection).findByText(/person.validation.firstnameRequired/i)).toBeInTheDocument();
        expect(await within(contactSection).findByText(/person.validation.lastnameRequired/i)).toBeInTheDocument();
        expect(await within(contactSection).findByText(/person.validation.descriptionRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });
    }, 15000);
});
