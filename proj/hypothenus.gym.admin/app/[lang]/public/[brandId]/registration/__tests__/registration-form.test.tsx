import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from '../registration-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createMemberAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Member, newMember } from '@/src/lib/entities/member';
import { LanguageEnum } from '@/src/lib/entities/language';
import { PhoneNumberTypeEnum } from '@/src/lib/entities/phoneNumber';
import { newGym } from '@/src/lib/entities/gym';
import { success } from '@/app/lib/http/handle-result';

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en', brandId: 'test-brand' }),
}));

jest.mock('../actions', () => ({
    createMemberAction: jest.fn(),
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

const gymA = newGym();
gymA.uuid = 'gym-123';
gymA.name = 'Gym A';

const gymB = newGym();
gymB.uuid = 'gym-456';
gymB.name = 'Gym B';
const mockGyms = [
    { gym: gymA, label: 'Gym A', value: 'gym-123' },
    { gym: gymB, label: 'Gym B', value: 'gym-456' },
];

const mockMember: Member = newMember();
mockMember.brandUuid = 'Brand1';
mockMember.person.communicationLanguage = LanguageEnum.en;

describe('RegistrationForm Integration Test', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createMemberAction as jest.Mock).mockImplementation(async (data: Member) => success(data));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders in edit mode, fills the form fields, submits, and calls createMemberAction with form data', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <RegistrationForm lang="en" member={mockMember} gyms={mockGyms} />
            </Provider>
        );

        // Act - fill the form

        // Person Info
        const firstnameInput = screen.getByLabelText(/person.firstname/i);
        const lastnameInput = screen.getByLabelText(/person.lastname/i);
        const emailInput = screen.getByPlaceholderText('person.emailPlaceholder');
        const dateOfBirthInput = screen.getByPlaceholderText('format.date');

        // Passwords
        const passwordInput = screen.getByLabelText((content) => content.includes('member.password') && !content.includes('Confirmation'));
        const passwordConfirmationInput = screen.getByLabelText(/member.passwordConfirmation/i);

        // Selectors
        const preferredGymSelect = screen.getByLabelText(/member.preferredGym/i);

        await user.type(firstnameInput, 'John');
        await user.type(lastnameInput, 'Doe');
        await user.type(emailInput, 'john.doe@example.com');
        await user.type(dateOfBirthInput, '1990-01-01');

        await user.type(passwordInput, 'SecurePass123!');
        await user.type(passwordConfirmationInput, 'SecurePass123!');
        await user.selectOptions(preferredGymSelect, 'gym-123');

        // Phone numbers (mock member comes with 3 empty, the schema says min 2)
        // Find the one input shown and fill it
        const phoneInput = screen.getByPlaceholderText('(999) 999-9999');
        await user.type(phoneInput, '(514) 555-1234');

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: 'form.buttons.save' });

        // Form starts in Edit Mode (fields not disabled), so we can directly click Save
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        // Assert
        await waitFor(() => {
            expect(createMemberAction).toHaveBeenCalledTimes(1);
        }, { timeout: 3000 });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (createMemberAction as jest.Mock).mock.calls[0][0];

        // 1. Compare the result with mockMember structure
        // Validate it merged our form inputs correctly into the original mockMember
        // expect(submittedData.brandUuid).toBe('Brand1'); // Keeps root property
        expect(submittedData.person.firstname).toBe('John');
        expect(submittedData.person.lastname).toBe('Doe');
        expect(submittedData.person.email).toBe('john.doe@example.com');
        expect(submittedData.person.dateOfBirth).toContain('1990-01-01');
        expect(submittedData.password).toBe('SecurePass123!');
        expect(submittedData.preferredGymUuid).toBe('gym-123');
        expect(submittedData.person.communicationLanguage).toBe(LanguageEnum.en); // From mockMember

        // Ensure that unmodified aspects of mockMember.person.phoneNumbers remain.
        expect(submittedData.person.phoneNumbers).toBeInstanceOf(Array);
        // Our input updated the first displayed phone input (likely mobile)
        expect(submittedData.person.phoneNumbers.find((p: any) => p.type === PhoneNumberTypeEnum.Mobile && p.number === '(514) 555-1234')).toBeDefined();

        // 2. Ensure form fields still retain their values after save completes
        expect(firstnameInput).toHaveValue('John');
        expect(lastnameInput).toHaveValue('Doe');
        expect(emailInput).toHaveValue('john.doe@example.com');
        expect(dateOfBirthInput).toHaveValue('1990-01-01');
        expect((preferredGymSelect as HTMLSelectElement).value).toBe('gym-123');
        expect(phoneInput).toHaveValue('(514) 555-1234');
    }, 15000);

    it('validates Zod schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <RegistrationForm lang="en" member={mockMember} gyms={mockGyms} />
            </Provider>
        );

        // Fill form with INVALID data
        const firstnameInput = screen.getByLabelText(/person.firstname/i);
        const lastnameInput = screen.getByLabelText(/person.lastname/i);
        const emailInput = screen.getByPlaceholderText('person.emailPlaceholder');
        const passwordInput = screen.getByLabelText((content) => content.includes('member.password') && !content.includes('Confirmation'));
        const passwordConfirmationInput = screen.getByLabelText(/member.passwordConfirmation/i);

        // Leave required fields empty and provide mismatched passwords
        await user.type(firstnameInput, 'John');
        await user.type(lastnameInput, 'Doe');
        await user.type(emailInput, 'invalid-email'); // Invalid email format
        await user.type(passwordInput, 'Password123!');
        await user.type(passwordConfirmationInput, 'DifferentPassword!'); // Password mismatch
        // Leave date of birth empty (required)
        // Leave phone number empty (required - min 2)

        const saveButton = screen.getByRole('button', { name: 'form.buttons.save' });
        await user.click(saveButton);

        // Assert that createMemberAction was NOT called due to validation errors
        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });

        // Verify validation error messages appear in the DOM
        expect(screen.getByText(/validation.emailInvalid/i)).toBeInTheDocument();
        // Note: password mismatch won't show because base validations failed first
    });

    it('validates password match in Zod refine after all base validations pass', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <RegistrationForm lang="en" member={mockMember} gyms={mockGyms} />
            </Provider>
        );

        // Fill ALL required fields with VALID data BUT mismatched passwords
        const firstnameInput = screen.getByLabelText(/person.firstname/i);
        const lastnameInput = screen.getByLabelText(/person.lastname/i);
        const emailInput = screen.getByPlaceholderText('person.emailPlaceholder');
        const dateOfBirthInput = screen.getByPlaceholderText('format.date');
        const phoneInput = screen.getByPlaceholderText('(999) 999-9999');
        const passwordInput = screen.getByLabelText((content) => content.includes('member.password') && !content.includes('Confirmation'));
        const passwordConfirmationInput = screen.getByLabelText(/member.passwordConfirmation/i);
        const preferredGymSelect = screen.getByLabelText(/member.preferredGym/i);

        // Fill all fields correctly EXCEPT password confirmation
        await user.type(firstnameInput, 'John');
        await user.type(lastnameInput, 'Doe');
        await user.type(emailInput, 'john.doe@example.com');
        await user.type(dateOfBirthInput, '1990-01-01');
        await user.type(phoneInput, '(514) 555-1234');
        await user.type(passwordInput, 'SecurePass123!');
        await user.type(passwordConfirmationInput, 'DifferentPassword456!'); // MISMATCH
        await user.selectOptions(preferredGymSelect, 'gym-123');

        const saveButton = screen.getByRole('button', { name: 'form.buttons.save' });
        await user.click(saveButton);

        // Assert that createMemberAction was NOT called due to password mismatch
        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });

        // Verify the .refine() validation error appears (password confirmation mismatch)
        expect(screen.getByText(/member.validation.passwordConfirmationMismatch/i)).toBeInTheDocument();
    });

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <RegistrationForm lang="en" member={mockMember} gyms={mockGyms} />
            </Provider>
        );

        // Try to submit without filling any fields
        const saveButton = screen.getByRole('button', { name: 'form.buttons.save' });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect(await screen.findByText(/person.validation.firstnameRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/person.validation.lastnameRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/person.validation.dateOfBirthRequired/i)).toBeInTheDocument();
        expect(await screen.findByText(/member.validation.passwordRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createMemberAction).not.toHaveBeenCalled(); });
    });
});
