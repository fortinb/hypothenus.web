import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BrandForm from '../brand-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createBrandAction, saveBrandAction, deleteBrandAction, activateBrandAction, deactivateBrandAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Brand, newBrand } from '@/src/lib/entities/brand';
import { success } from '@/app/lib/http/handle-result';
import { DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST } from '@/src/lib/entities/messages';
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

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en', brandId: 'test-brand' }),
}));

jest.mock('../actions', () => ({
    createBrandAction: jest.fn(),
    saveBrandAction: jest.fn(),
    activateBrandAction: jest.fn(),
    deactivateBrandAction: jest.fn(),
    deleteBrandAction: jest.fn(),
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

jest.mock('@/app/lib/services/brands-data-service-client', () => ({
    uploadBrandLogo: jest.fn().mockResolvedValue('http://example.com/logo.png'),
}));

jest.mock('@/app/ui/components/security/authorize', () => ({
    Authorize: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockBrand: Brand = newBrand();
mockBrand.uuid = null;
mockBrand.phoneNumbers[0].number = '';
mockBrand.phoneNumbers[1].number = '';

describe('BrandForm Integration Test', () => {
    const mockPush = jest.fn();

    // Test data constants
    const TEST_BRAND = {
        code: 'BRAND123',
        name: 'Test Brand Inc.',
        email: 'contact@testbrand.com',
        note: 'This is a test brand'
    };

    // Brand-specific invalid test data constants
    const INVALID_BRAND = {
        codeWithSpaces: 'BRAND CODE SPACES',
        invalidEmail: 'invalid-email',
        codeTooLong: 'VERYLONGBRANDCODE123456', // 24 characters - exceeds max 20
        nameTooLong: 'A'.repeat(101) // 101 characters - exceeds max 100
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createBrandAction as jest.Mock).mockImplementation(async (data: Brand) => success(data));
        (saveBrandAction as jest.Mock).mockImplementation(async (data: Brand) => success(data));
        (deleteBrandAction as jest.Mock).mockImplementation(async (data: Brand) => success(data));
        (activateBrandAction as jest.Mock).mockImplementation(async (data: Brand) => success(data));
        (deactivateBrandAction as jest.Mock).mockImplementation(async (data: Brand) => success(data));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    // Helper function to create a brand with uuid and full data from constants
    const createMockBrandWithData = (uuid: string): Brand => {
        const mockBrandWithData: Brand = newBrand();
        mockBrandWithData.uuid = uuid;
        mockBrandWithData.code = TEST_BRAND.code;
        mockBrandWithData.name = TEST_BRAND.name;
        mockBrandWithData.email = TEST_BRAND.email;
        mockBrandWithData.note = TEST_BRAND.note;
        mockBrandWithData.address.civicNumber = TEST_ADDRESS.civicNumber;
        mockBrandWithData.address.streetName = TEST_ADDRESS.streetName;
        mockBrandWithData.address.city = TEST_ADDRESS.city;
        mockBrandWithData.address.state = TEST_ADDRESS.state;
        mockBrandWithData.address.zipCode = TEST_ADDRESS.zipCode;
        mockBrandWithData.phoneNumbers[0].number = TEST_PHONE_NUMBERS.business;
        mockBrandWithData.phoneNumbers[1].number = TEST_PHONE_NUMBERS.mobile;
        mockBrandWithData.contacts[0].firstname = TEST_CONTACT.firstname;
        mockBrandWithData.contacts[0].lastname = TEST_CONTACT.lastname;
        mockBrandWithData.contacts[0].description = TEST_CONTACT.description;
        return mockBrandWithData;
    };

    const fillBaseBrandFields = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByLabelText(/brand.code/i), TEST_BRAND.code);
        await user.type(screen.getByLabelText(/brand.name/i), TEST_BRAND.name);
        await user.type(screen.getByLabelText(/brand.email/i), TEST_BRAND.email);
        await user.type(screen.getByLabelText(/brand.note/i), TEST_BRAND.note);
    };

    // Helper method to update brand fields with _update_ suffix
    const updateBrandFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const nameInput = screen.getByLabelText(/brand.name/i);
        const emailInput = screen.getByLabelText(/brand.email/i);
        const noteInput = screen.getByLabelText(/brand.note/i);

        await user.clear(nameInput);
        await user.type(nameInput, TEST_BRAND.name + '_update_');
        await user.clear(emailInput);
        await user.type(emailInput, 'update_' + TEST_BRAND.email);
        await user.clear(noteInput);
        await user.type(noteInput, TEST_BRAND.note + '_update_');
    };

    it('new brand', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Act - fill the form
        await fillBaseBrandFields(user);
        await fillAddressSection(user, 'brand.address');
        await fillPhoneNumbersSection(user, 'brand.phones');
        await fillContactsSection(user, 'brand.contacts', 'brand-contact-accordion-0');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(createBrandAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (createBrandAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly mapped
        expect(submittedData.code).toBe(TEST_BRAND.code);
        expect(submittedData.name).toBe(TEST_BRAND.name);
        expect(submittedData.email).toBe(TEST_BRAND.email);
        expect(submittedData.note).toBe(TEST_BRAND.note);

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

    it('new duplicate brand', async () => {
        const user = userEvent.setup({ delay: null });

        // Override mock to return entity with duplicate error message
        (createBrandAction as jest.Mock).mockImplementation(async (data: Brand) => {
            const brandWithMessages = {
                ...data,
                messages: [
                    {
                        code: DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST,
                        description: 'Brand code already exists',
                        severity: MessageSeverityEnum.Error
                    }
                ]
            };
            return success(brandWithMessages);
        });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        await fillBaseBrandFields(user);
        await fillAddressSection(user, 'brand.address');
        await fillPhoneNumbersSection(user, 'brand.phones');
        await fillContactsSection(user, 'brand.contacts', 'brand-contact-accordion-0');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        //logFormValidationErrors();

        // Assert that createBrandAction was called
        await waitFor(() => { expect(createBrandAction).toHaveBeenCalledTimes(1); });

        // Verify that the duplicate error message appears on the code field
        expect(await screen.findByText(/brand.validation.alreadyExists/i)).toBeInTheDocument();

        // Verify form stays in edit mode (save button should still be enabled)
        const saveButtonAfterError = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButtonAfterError).toBeEnabled();

        // Verify the code field has the error
        const codeInputAfterError = screen.getByLabelText(/brand.code/i);
        expect(codeInputAfterError).toHaveValue(TEST_BRAND.code);
    }, 15000);

    it('update brand', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a brand with uuid and full data for update mode
        const mockBrandForUpdate = createMockBrandWithData('existing-brand-uuid');

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrandForUpdate} />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/brand.name/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateBrandFields(user);
        await updateAddressFields(user, 'brand.address');
        await updatePhoneNumbersFields(user, 'brand.phones', '(514) 111-1111', '(514) 222-2222');
        await updateContactFields(user, 'brand.contacts', 'brand-contact-accordion-0');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert saveBrandAction was called (not createBrandAction since uuid exists)
        await waitFor(() => { expect(saveBrandAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (saveBrandAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly updated with _update_ suffix
        expect(submittedData.code).toBe(TEST_BRAND.code);
        expect(submittedData.name).toBe(TEST_BRAND.name + '_update_');
        expect(submittedData.email).toBe('update_' + TEST_BRAND.email);
        expect(submittedData.note).toBe(TEST_BRAND.note + '_update_');

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

        // Create a brand with uuid and full data for update mode
        const mockBrandForCancel = createMockBrandWithData('existing-brand-uuid-cancel');

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrandForCancel} />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/brand.name/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateBrandFields(user);
        await updateAddressFields(user, 'brand.address');
        await updatePhoneNumbersFields(user, 'brand.phones', '(514) 999-9999', '(514) 888-8888');
        await updateContactFields(user, 'brand.contacts', 'brand-contact-accordion-0');

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/brand.name/i)).toBeDisabled();

        // Verify all fields have been reset to original values
        const codeInputAfterCancel = screen.getByLabelText(/brand.code/i);
        const nameInputAfterCancel = screen.getByLabelText(/brand.name/i);
        const emailInputAfterCancel = screen.getByLabelText(/brand.email/i);
        const noteInputAfterCancel = screen.getByLabelText(/brand.note/i);

        expect(codeInputAfterCancel).toHaveValue(TEST_BRAND.code);
        expect(nameInputAfterCancel).toHaveValue(TEST_BRAND.name);
        expect(emailInputAfterCancel).toHaveValue(TEST_BRAND.email);
        expect(noteInputAfterCancel).toHaveValue(TEST_BRAND.note);

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
        const phonesAccordionButton = await screen.findByText(/brand.phones/i);

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
        expect(createBrandAction).not.toHaveBeenCalled();
        expect(saveBrandAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete brand', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a brand with uuid and full data
        const mockBrandForDelete = createMockBrandWithData('existing-brand-uuid-delete');

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrandForDelete} />
            </Provider>
        );

        // Click the delete button (available when uuid exists)
        const deleteButton = screen.getByRole('button', { name: /form.bar.delete/i });
        expect(deleteButton).toBeEnabled();
        await user.click(deleteButton);

        // Wait for confirmation modal to appear
        expect(await screen.findByText(/brand.deleteConfirmation.title/i)).toBeInTheDocument();

        // Verify the modal text is present
        expect(await screen.findByText(/brand.deleteConfirmation.text/i)).toBeInTheDocument();

        // Verify confirmation buttons are present
        const yesButton = screen.getByText(/brand.deleteConfirmation.yes/i);
        const noButton = screen.getByText(/brand.deleteConfirmation.no/i);
        expect(yesButton).toBeInTheDocument();
        expect(noButton).toBeInTheDocument();

        // Click the Yes button to confirm deletion
        await user.click(yesButton);

        // Assert that deleteBrandAction was called

        await waitFor(() => { expect(deleteBrandAction).toHaveBeenCalledTimes(1); });

        // Verify the brand data was passed to the delete action
        const deletedBrand = (deleteBrandAction as jest.Mock).mock.calls[0][0];
        expect(deletedBrand.uuid).toBe(mockBrandForDelete.uuid);
        expect(deletedBrand.code).toBe(TEST_BRAND.code);
        expect(deletedBrand.name).toBe(TEST_BRAND.name);
    }, 15000);

    it('activate brand', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a brand with uuid and full data, initially inactive
        const mockBrandForActivate = createMockBrandWithData('existing-brand-uuid-activate');
        mockBrandForActivate.active = false;

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrandForActivate} />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).not.toBeChecked(); // Initially inactive
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to activate the brand
        await user.click(activateCheckbox);

        // Assert that activateBrandAction was called
        await waitFor(() => { expect(activateBrandAction).toHaveBeenCalledTimes(1); });

        // Verify the brand data was passed to the activate action
        const activatedBrand = (activateBrandAction as jest.Mock).mock.calls[0][0];
        expect(activatedBrand.uuid).toBe(mockBrandForActivate.uuid);

        // Verify deactivateBrandAction was NOT called
        expect(deactivateBrandAction).not.toHaveBeenCalled();
    }, 15000);

    it('deactivate brand', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a brand with uuid and full data, initially active
        const mockBrandForDeactivate = createMockBrandWithData('existing-brand-uuid-deactivate');
        mockBrandForDeactivate.active = true;

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrandForDeactivate} />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).toBeChecked(); // Initially active
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to deactivate the brand
        await user.click(activateCheckbox);

        // Assert that deactivateBrandAction was called
        await waitFor(() => { expect(deactivateBrandAction).toHaveBeenCalledTimes(1); });

        // Verify the brand data was passed to the deactivate action
        const deactivatedBrand = (deactivateBrandAction as jest.Mock).mock.calls[0][0];
        expect(deactivatedBrand.uuid).toBe(mockBrandForDeactivate.uuid);

        // Verify activateBrandAction was NOT called
        expect(activateBrandAction).not.toHaveBeenCalled();
    }, 15000);

    it('validates Zod schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Fill form with INVALID data
        const codeInput = screen.getByLabelText(/brand.code/i);
        const nameInput = screen.getByLabelText(/brand.name/i);
        const emailInput = screen.getByLabelText(/brand.email/i);

        await user.type(codeInput, INVALID_BRAND.codeWithSpaces); // Invalid - no spaces allowed
        await user.type(nameInput, TEST_BRAND.name);
        await user.type(emailInput, INVALID_BRAND.invalidEmail); // Invalid email format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/brand.validation.noSpaceAllowed/i)).toBeInTheDocument();
        expect(await screen.findByText(/brand.validation.emailInvalid/i)).toBeInTheDocument();

        await waitFor(() => { expect(createBrandAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Try to submit without filling required fields
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect(await screen.findByText(/brand.validation.codeRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/brand.validation.nameRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createBrandAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates code max length with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Fill code with more than 20 characters
        const codeInput = screen.getByLabelText(/brand.code/i);

        await user.type(codeInput, INVALID_BRAND.codeTooLong); // 24 characters - exceeds max 20

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify max length validation error appears
        expect(await screen.findByText(/brand.validation.codeMaxLength/i)).toBeInTheDocument();

        await waitFor(() => { expect(createBrandAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates name max length with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Fill name with more than 100 characters
        const nameInput = screen.getByLabelText(/brand.name/i);

        await user.type(nameInput, INVALID_BRAND.nameTooLong); // 101 characters - exceeds max 100

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify max length validation error appears
        expect(await screen.findByText(/brand.validation.nameMaxLength/i)).toBeInTheDocument();

        await waitFor(() => { expect(createBrandAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates phone number format with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Expand phone numbers accordion
        const phonesAccordionButton = screen.getByText(/brand.phones/i);
        await user.click(phonesAccordionButton);

        expect(await screen.findByLabelText(/phoneNumber.business/i)).toBeVisible();

        // Fill with INVALID phone number format
        const businessPhoneInput = await screen.findByLabelText(/phoneNumber.business/i);
        await user.type(businessPhoneInput, INVALID_PHONE.invalidFormat); // Invalid format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify phone number format validation error appears
        expect(await screen.findByText(/phoneNumber.validation.phoneNumberFormat/i)).toBeInTheDocument();

        await waitFor(() => { expect(createBrandAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates contact required fields with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <BrandForm lang="en" brand={mockBrand} />
            </Provider>
        );

        // Expand contacts accordion but leave firstname empty (required field)
        const contactsAccordionButton = screen.getByText(/brand.contacts/i);
        await user.click(contactsAccordionButton);

        expect(await screen.findByLabelText(/person.firstname/i)).toBeVisible();

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify contact required field validation error appears
        expect(await screen.findByText(/person.validation.firstnameRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/person.validation.lastnameRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/person.validation.descriptionRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createBrandAction).not.toHaveBeenCalled(); });
    }, 15000);
});
