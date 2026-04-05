import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '../user-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createUserAction, saveUserAction, deleteUserAction, activateUserAction, deactivateUserAction } from '../actions';
import { useRouter } from 'next/navigation';
import { User, newUser } from '@/src/lib/entities/user';
import { success } from '@/app/lib/http/handle-result';
import {
    logFormValidationErrors, INVALID_EMAIL
} from '@/app/lib/test-utils/form-test-helpers';
import { RoleEnum } from '@/src/lib/entities/enum/role-enum';

export const TEST_USER = {
    firstname: 'user_firstname',
    lastname: 'user_lastname',
    email: 'user@example.com',
    roles: [
        { role: RoleEnum.admin, label: "admin", value: 'admin' },
        { role: RoleEnum.manager, label: "manager", value: 'manager' }
    ]
};

// Test data constants for course
export const TEST_AVAILABLE_ROLES = [
    { role: RoleEnum.admin, label: "admin", value: 'admin' },
    { role: RoleEnum.manager, label: "manager", value: 'manager' },
    { role: RoleEnum.coach, label: "coach", value: 'coach' },
    { role: RoleEnum.member, label: "member", value: 'member' }
];

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en' }),
}));

jest.mock('../actions', () => ({
    createUserAction: jest.fn(),
    saveUserAction: jest.fn(),
    activateUserAction: jest.fn(),
    deactivateUserAction: jest.fn(),
    deleteUserAction: jest.fn(),
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

const mockUser: User = newUser();
mockUser.uuid = null;

describe('UserForm Integration Test', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createUserAction as jest.Mock).mockImplementation(async (data: User) => success(data));
        (saveUserAction as jest.Mock).mockImplementation(async (data: User) => success(data));
        (deleteUserAction as jest.Mock).mockImplementation(async (data: User) => success(data));
        (activateUserAction as jest.Mock).mockImplementation(async (data: User) => success(data));
        (deactivateUserAction as jest.Mock).mockImplementation(async (data: User) => success(data));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    // Helper function to create a user with uuid and full data from constants
    const createMockUserWithData = (uuid: string): User => {
        const mockUserWithData: User = newUser();
        mockUserWithData.uuid = uuid;
        mockUserWithData.firstname = TEST_USER.firstname;
        mockUserWithData.lastname = TEST_USER.lastname;
        mockUserWithData.email = TEST_USER.email;

        return mockUserWithData;
    };

    const fillUserFields = async (user: ReturnType<typeof userEvent.setup>) => {
        // Use selector to target only the user-info inputs (id starts with user_input_*)
        // to avoid conflicts with contact-info fields which share the same label text
        await user.type(screen.getByLabelText(/user.firstname/i, { selector: 'input[id^="user_input_firstname"]' }), TEST_USER.firstname);
        await user.type(screen.getByLabelText(/user.lastname/i, { selector: 'input[id^="user_input_lastname"]' }), TEST_USER.lastname);
        await user.type(screen.getByLabelText(/user.email/i, { selector: 'input[id^="user_input_email"]' }), TEST_USER.email);
    };

    const updateUserFields = async (user: ReturnType<typeof userEvent.setup>) => {
        const firstnameInput = screen.getByLabelText(/user.firstname/i, { selector: 'input[id^="user_input_firstname"]' });
        const lastnameInput = screen.getByLabelText(/user.lastname/i, { selector: 'input[id^="user_input_lastname"]' });
        const emailInput = screen.getByLabelText(/user.email/i, { selector: 'input[id^="user_input_email"]' });

        await user.clear(firstnameInput);
        await user.type(firstnameInput, `${TEST_USER.firstname}_update_`);
        await user.clear(lastnameInput);
        await user.type(lastnameInput, `${TEST_USER.lastname}_update_`);
        await user.clear(emailInput);
        await user.type(emailInput, `update_${TEST_USER.email}`);
    };

    it('new user', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUser}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        // Act - fill the form
        await fillUserFields(user);

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(createUserAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (createUserAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly mapped
        expect(submittedData.firstname).toBe(TEST_USER.firstname);
        expect(submittedData.lastname).toBe(TEST_USER.lastname);
        expect(submittedData.email).toBe(TEST_USER.email);

        for (let i = 0; i < TEST_USER.roles.length; i++) {
            expect(submittedData.roles[i]).toBe(TEST_USER.roles[i].role);
        }

    }, 15000);

    it('update user', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a user with uuid and full data for update mode
        const mockUserForUpdate = createMockUserWithData('existing-user-uuid');

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUserForUpdate}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.getByLabelText(/user.firstname/i, { selector: 'input[id^="user_input_firstname"]' })).not.toBeDisabled();

        // Update all fields using helper functions
        await updateUserFields(user);
        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert saveUserAction was called (not createUserAction since uuid exists)
        await waitFor(() => { expect(saveUserAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (saveUserAction as jest.Mock).mock.calls[0][0];

        // Validate the form inputs were correctly updated with _update_ suffix
        expect(submittedData.firstname).toBe(TEST_USER.firstname + '_update_');
        expect(submittedData.lastname).toBe(TEST_USER.lastname + '_update_');
        expect(submittedData.email).toBe('update_' + TEST_USER.email);

    }, 15000);

    it('cancel edit', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a user with uuid and full data for update mode
        const mockUserForCancel = createMockUserWithData('existing-user-uuid-cancel');

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUserForCancel}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/user.firstname/i, { selector: 'input[id^="user_input_firstname"]' })).not.toBeDisabled();

        // Update all fields using helper functions
        await updateUserFields(user);

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/user.firstname/i, { selector: 'input[id^="user_input_firstname"]' })).toBeDisabled();

        // Verify all user fields have been reset to original values
        expect(screen.getByLabelText(/user.firstname/i, { selector: 'input[id^="user_input_firstname"]' })).toHaveValue(TEST_USER.firstname);
        expect(screen.getByLabelText(/user.lastname/i, { selector: 'input[id^="user_input_lastname"]' })).toHaveValue(TEST_USER.lastname);
        expect(screen.getByLabelText(/user.email/i, { selector: 'input[id^="user_input_email"]' })).toHaveValue(TEST_USER.email);

        // Verify that neither action was called (no save occurred)
        expect(createUserAction).not.toHaveBeenCalled();
        expect(saveUserAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete user', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a user with uuid and full data
        const mockUserForDelete = createMockUserWithData('existing-user-uuid-delete');

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUserForDelete}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        // Click the delete button (available when uuid exists)
        const deleteButton = screen.getByRole('button', { name: /form.bar.delete/i });
        expect(deleteButton).toBeEnabled();
        await user.click(deleteButton);

        // Wait for confirmation modal to appear
        expect(await screen.findByText(/user.deleteConfirmation.title/i)).toBeInTheDocument();

        // Verify the modal text is present
        expect(await screen.findByText(/user.deleteConfirmation.text/i)).toBeInTheDocument();

        // Verify confirmation buttons are present
        const yesButton = screen.getByText(/user.deleteConfirmation.yes/i);
        const noButton = screen.getByText(/user.deleteConfirmation.no/i);
        expect(yesButton).toBeInTheDocument();
        expect(noButton).toBeInTheDocument();

        // Click the Yes button to confirm deletion
        await user.click(yesButton);

        await waitFor(() => { expect(deleteUserAction).toHaveBeenCalledTimes(1); });

        // Verify the user data was passed to the delete action
        const deletedUser = (deleteUserAction as jest.Mock).mock.calls[0][0];
        expect(deletedUser.uuid).toBe(mockUserForDelete.uuid);
    }, 15000);

    it('activate user', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a user with uuid and full data, initially inactive
        const mockUserForActivate = createMockUserWithData('existing-user-uuid-activate');
        mockUserForActivate.active = false;

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUserForActivate}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).not.toBeChecked(); // Initially inactive
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to activate the user
        await user.click(activateCheckbox);

        // Assert that activateUserAction was called
        await waitFor(() => { expect(activateUserAction).toHaveBeenCalledTimes(1); });

        // Verify the user data was passed to the activate action
        const activatedUser = (activateUserAction as jest.Mock).mock.calls[0][0];
        expect(activatedUser.uuid).toBe(mockUserForActivate.uuid);

        // Verify deactivateUserAction was NOT called
        expect(deactivateUserAction).not.toHaveBeenCalled();
    }, 15000);

    it('deactivate user', async () => {
        const user = userEvent.setup({ delay: null });

        // Create a user with uuid and full data, initially active
        const mockUserForDeactivate = createMockUserWithData('existing-user-uuid-deactivate');
        mockUserForDeactivate.active = true;

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUserForDeactivate}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).toBeChecked(); // Initially active
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to deactivate the user
        await user.click(activateCheckbox);

        // Assert that deactivateUserAction was called
        await waitFor(() => { expect(deactivateUserAction).toHaveBeenCalledTimes(1); });

        // Verify the user data was passed to the deactivate action
        const deactivatedUser = (deactivateUserAction as jest.Mock).mock.calls[0][0];
        expect(deactivatedUser.uuid).toBe(mockUserForDeactivate.uuid);

        // Verify activateUserAction was NOT called
        expect(activateUserAction).not.toHaveBeenCalled();
    }, 15000);

    it('validates Zod schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUser}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        // Fill form with INVALID data
        const emailInput = screen.getByLabelText(/user.email/i, { selector: 'input[id^="user_input_email"]' });

        await user.type(emailInput, INVALID_EMAIL.invalidEmail); // Invalid email format

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/validation.emailInvalid/i)).toBeInTheDocument();

        await waitFor(() => { expect(createUserAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup({ delay: null });

        render(
            <Provider store={store}>
                <UserForm lang="en" user={mockUser}
                    initialAvailableRoleItems={TEST_AVAILABLE_ROLES.map(item => item)}
                    initialSelectedRoleItems={TEST_USER.roles.map(item => item)} />
            </Provider>
        );

        // Try to submit without filling required fields
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect((await screen.findByText(/user.validation.firstnameRequired/i))).toBeInTheDocument();
        expect((await screen.findByText(/user.validation.lastnameRequired/i))).toBeInTheDocument();

        await waitFor(() => { expect(createUserAction).not.toHaveBeenCalled(); });
    }, 15000);
});
