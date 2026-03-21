import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseForm from '../course-form';
import { Provider } from 'react-redux';
import { store } from '@/app/lib/store/store';
import { createCourseAction, saveCourseAction, deleteCourseAction, activateCourseAction, deactivateCourseAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Course, newCourse } from '@/src/lib/entities/course';
import { success } from '@/app/lib/http/handle-result';
import { logFormValidationErrors } from '@/app/lib/test-utils/form-test-helpers';
import { LanguageEnum } from '@/src/lib/entities/enum/language-enum';
import moment from 'moment';
import { DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST, MessageSeverityEnum } from '@/src/lib/entities/messages';

// Test data constants for course
export const TEST_COURSE = {
    code: 'coursecode123',
    name: [
        { language: LanguageEnum.en, text: 'John' },
        { language: LanguageEnum.fr, text: 'Jean' }
    ],
    description: [
        { language: LanguageEnum.en, text: 'Doe' },
        { language: LanguageEnum.fr, text: 'Dupont' }
    ],
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().add(1, 'year').format("YYYY-MM-DD"),
};

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (k: string) => k,
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: () => ({ lang: 'en', brandId: 'test-brand', courseId: 'test-course' }),
}));

jest.mock('../actions', () => ({
    createCourseAction: jest.fn(),
    saveCourseAction: jest.fn(),
    activateCourseAction: jest.fn(),
    deactivateCourseAction: jest.fn(),
    deleteCourseAction: jest.fn(),
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

const mockCourse: Course = newCourse();
mockCourse.uuid = null;

describe('CourseForm Integration Test', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (createCourseAction as jest.Mock).mockImplementation(async (data: Course) => success(data));
        (saveCourseAction as jest.Mock).mockImplementation(async (data: Course) => success(data));
        (deleteCourseAction as jest.Mock).mockImplementation(async (data: Course) => success(data));
        (activateCourseAction as jest.Mock).mockImplementation(async (data: Course) => success(data));
        (deactivateCourseAction as jest.Mock).mockImplementation(async (data: Course) => success(data));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    // Helper function to create a course with uuid and full data from constants
    const createMockCourseWithData = (uuid: string): Course => {
        const mockCourseWithData: Course = newCourse();
        mockCourseWithData.uuid = uuid;
        mockCourseWithData.code = TEST_COURSE.code;
        mockCourseWithData.name = TEST_COURSE.name;
        mockCourseWithData.description = TEST_COURSE.description;
        mockCourseWithData.startDate = TEST_COURSE.startDate;
        mockCourseWithData.endDate = TEST_COURSE.endDate;
        return mockCourseWithData;
    };

    const fillCourseFields = async (user: ReturnType<typeof userEvent.setup>) => {
        // Verify phone numbers have been reset
        // Expand phone numbers accordion
        const descriptionAccordionButton = await screen.findByText(/course.namesSection/i);
        await user.click(descriptionAccordionButton);

        await user.type(await screen.findByLabelText(/course.code/i), TEST_COURSE.code);
        const nameInputs = await screen.findAllByLabelText(/course\.name/i);
        const descInputs = await screen.findAllByLabelText(/course\.description/i);
        await user.type(nameInputs[0], TEST_COURSE.name[0].text);
        await user.type(nameInputs[1], TEST_COURSE.name[1].text);
        await user.type(descInputs[0], TEST_COURSE.description[0].text);
        await user.type(descInputs[1], TEST_COURSE.description[1].text);

        const datesAccordionButton = await screen.findByText(/course.datesSection/i);
        await user.click(datesAccordionButton);

        await user.type(await screen.findByLabelText(/course.startDate/i), TEST_COURSE.startDate);
        await user.type(await screen.findByLabelText(/course.endDate/i), TEST_COURSE.endDate);
    };

    const updateCourseFields = async (user: ReturnType<typeof userEvent.setup>) => {
        // Expand descriptions accordion to access name/description fields
        const descriptionAccordionButton = await screen.findByText(/course.namesSection/i);
        await user.click(descriptionAccordionButton);

        const [nameInput0, nameInput1] = await screen.findAllByLabelText(/course\.name/i);
        const [descInput0, descInput1] = await screen.findAllByLabelText(/course\.description/i);

        await user.clear(nameInput0);
        await user.type(nameInput0, `${TEST_COURSE.name[0].text}_update_`);
        await user.clear(nameInput1);
        await user.type(nameInput1, `${TEST_COURSE.name[1].text}_update_`);
        await user.clear(descInput0);
        await user.type(descInput0, `${TEST_COURSE.description[0].text}_update_`);
        await user.clear(descInput1);
        await user.type(descInput1, `${TEST_COURSE.description[1].text}_update_`);

        // Expand dates accordion to access startDate/endDate fields
        const datesAccordionButton = await screen.findByText(/course.datesSection/i);
        await user.click(datesAccordionButton);

        const startDateInput = await screen.findByLabelText(/course.startDate/i);
        const endDateInput = await screen.findByLabelText(/course.endDate/i);

        await user.clear(startDateInput);
        await user.type(startDateInput, moment().add(7, 'days').format("YYYY-MM-DD"));
        await user.clear(endDateInput);
        await user.type(endDateInput, moment().add(1, 'months').format("YYYY-MM-DD"));
    };

    it('new course', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourse} />
            </Provider>
        );

        // Act - fill the form
        await fillCourseFields(user);

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);
        
        logFormValidationErrors();

        // Assert
        await waitFor(() => { expect(createCourseAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (createCourseAction as jest.Mock).mock.calls[0][0];

        // Validate course-specific fields
        expect(submittedData.code).toBe(TEST_COURSE.code);

        expect(moment(submittedData.startDate).format("YYYY-MM-DD")).toBe(moment(TEST_COURSE.startDate).format("YYYY-MM-DD"));
        expect(moment(submittedData.endDate).format("YYYY-MM-DD")).toBe(moment(TEST_COURSE.endDate).format("YYYY-MM-DD"));

        expect(submittedData.name).toBeInstanceOf(Array);
        expect(submittedData.name.length).toBe(TEST_COURSE.name.length);
        expect(submittedData.name[0].text).toBe(TEST_COURSE.name[0].text);
        expect(submittedData.name[0].language).toBe(TEST_COURSE.name[0].language);
        expect(submittedData.name[1].text).toBe(TEST_COURSE.name[1].text);
        expect(submittedData.name[1].language).toBe(TEST_COURSE.name[1].language);

        expect(submittedData.description).toBeInstanceOf(Array);
        expect(submittedData.description.length).toBe(TEST_COURSE.description.length);
        expect(submittedData.description[0].text).toBe(TEST_COURSE.description[0].text);
        expect(submittedData.description[0].language).toBe(TEST_COURSE.description[0].language);
        expect(submittedData.description[1].text).toBe(TEST_COURSE.description[1].text);
        expect(submittedData.description[1].language).toBe(TEST_COURSE.description[1].language);
    }, 15000);

    it('new duplicate course', async () => {
        const user = userEvent.setup();

        // Override mock to return entity with duplicate error message
        (createCourseAction as jest.Mock).mockImplementation(async (data: Course) => {
            const courseWithMessages = {
                ...data,
                messages: [
                    {
                        code: DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST,
                        description: 'Course code already exists',
                        severity: MessageSeverityEnum.Error
                    }
                ]
            };
            return success(courseWithMessages);
        });

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourse} />
            </Provider>
        );

        await fillCourseFields(user);

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        // Assert that createCourseAction was called
        await waitFor(() => { expect(createCourseAction).toHaveBeenCalledTimes(1); });

        // Verify that the duplicate error message appears on the code field
        expect(await screen.findByText(/course.validation.alreadyExists/i)).toBeInTheDocument();

        // Verify form stays in edit mode (save button should still be enabled)
        const saveButtonAfterError = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButtonAfterError).toBeEnabled();

        // Verify the code field has the error
        const codeInputAfterError = screen.getByLabelText(/course.code/i);
        expect(codeInputAfterError).toHaveValue(TEST_COURSE.code);
    }, 15000);

    it('update course', async () => {
        const user = userEvent.setup();

        // Create a course with uuid and full data for update mode
        const mockCourseForUpdate = createMockCourseWithData('existing-course-uuid');

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourseForUpdate} />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/course.startDate/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateCourseFields(user);

        // Find and click the save button
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        logFormValidationErrors();

        // Assert saveCourseAction was called (not createCourseAction since uuid exists)
        await waitFor(() => { expect(saveCourseAction).toHaveBeenCalledTimes(1); });

        // The mock action returns whatever it received (which is mapFormToEntity's output)
        const submittedData = (saveCourseAction as jest.Mock).mock.calls[0][0];

        // Validate course-specific fields updated with _update_ suffix
        expect(moment(submittedData.startDate).format("YYYY-MM-DD")).toBe(moment().add(7, 'days').format("YYYY-MM-DD"));
        expect(moment(submittedData.endDate).format("YYYY-MM-DD")).toBe(moment().add(1, 'months').format("YYYY-MM-DD"));

        expect(submittedData.name).toBeInstanceOf(Array);
        expect(submittedData.name[0].text).toBe(`${TEST_COURSE.name[0].text}_update_`);
        expect(submittedData.name[0].language).toBe(TEST_COURSE.name[0].language);
        expect(submittedData.name[1].text).toBe(`${TEST_COURSE.name[1].text}_update_`);
        expect(submittedData.name[1].language).toBe(TEST_COURSE.name[1].language);

        expect(submittedData.description).toBeInstanceOf(Array);
        expect(submittedData.description[0].text).toBe(`${TEST_COURSE.description[0].text}_update_`);
        expect(submittedData.description[0].language).toBe(TEST_COURSE.description[0].language);
        expect(submittedData.description[1].text).toBe(`${TEST_COURSE.description[1].text}_update_`);
        expect(submittedData.description[1].language).toBe(TEST_COURSE.description[1].language);
    }, 15000);

    it('cancel edit', async () => {
        const user = userEvent.setup();

        // Create a course with uuid and full data for update mode
        const mockCourseForCancel = createMockCourseWithData('existing-course-uuid-cancel');

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourseForCancel} />
            </Provider>
        );

        // Click edit button to activate edit mode
        const editButton = screen.getByRole('button', { name: /form.bar.edit/i });
        await user.click(editButton);

        // Wait for form to be in edit mode
        expect(await screen.findByLabelText(/course.startDate/i)).not.toBeDisabled();

        // Update all fields using helper functions
        await updateCourseFields(user);

        // Click the cancel button
        const cancelButton = screen.getByRole('button', { name: /form.buttons.cancel/i });
        await user.click(cancelButton);

        // Wait for form to be back in read-only mode
        expect(await screen.findByLabelText(/course.code/i)).toBeDisabled();

        // Verify all course fields have been reset to original values
        expect(screen.getByLabelText(/course.code/i)).toHaveValue(TEST_COURSE.code);
        expect(screen.getByLabelText(/course.startDate/i)).toHaveValue(moment(TEST_COURSE.startDate).format('YYYY-MM-DD'));
        expect(screen.getByLabelText(/course.endDate/i)).toHaveValue(moment(TEST_COURSE.endDate).format('YYYY-MM-DD'));

        const nameInputsAfterCancel = screen.getAllByLabelText(/course\.name/i);
        const descInputsAfterCancel = screen.getAllByLabelText(/course\.description/i);
        expect(nameInputsAfterCancel[0]).toHaveValue(TEST_COURSE.name[0].text);
        expect(nameInputsAfterCancel[1]).toHaveValue(TEST_COURSE.name[1].text);
        expect(descInputsAfterCancel[0]).toHaveValue(TEST_COURSE.description[0].text);
        expect(descInputsAfterCancel[1]).toHaveValue(TEST_COURSE.description[1].text);

        // Verify that neither action was called (no save occurred)
        expect(createCourseAction).not.toHaveBeenCalled();
        expect(saveCourseAction).not.toHaveBeenCalled();
    }, 15000);

    it('delete course', async () => {
        const user = userEvent.setup();

        // Create a course with uuid and full data
        const mockCourseForDelete = createMockCourseWithData('existing-course-uuid-delete');

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourseForDelete} />
            </Provider>
        );

        // Click the delete button (available when uuid exists)
        const deleteButton = screen.getByRole('button', { name: /form.bar.delete/i });
        expect(deleteButton).toBeEnabled();
        await user.click(deleteButton);

        // Wait for confirmation modal to appear
        expect(await screen.findByText(/course.deleteConfirmation.title/i)).toBeInTheDocument();

        // Verify the modal text is present
        expect(await screen.findByText(/course.deleteConfirmation.text/i)).toBeInTheDocument();

        // Verify confirmation buttons are present
        const yesButton = screen.getByText(/course.deleteConfirmation.yes/i);
        const noButton = screen.getByText(/course.deleteConfirmation.no/i);
        expect(yesButton).toBeInTheDocument();
        expect(noButton).toBeInTheDocument();

        // Click the Yes button to confirm deletion
        await user.click(yesButton);

        await waitFor(() => { expect(deleteCourseAction).toHaveBeenCalledTimes(1); });

        // Verify the course data was passed to the delete action
        const deletedCourse = (deleteCourseAction as jest.Mock).mock.calls[0][0];
        expect(deletedCourse.uuid).toBe(mockCourseForDelete.uuid);
    }, 15000);

    it('activate course', async () => {
        const user = userEvent.setup();

        // Create a course with uuid and full data, initially inactive
        const mockCourseForActivate = createMockCourseWithData('existing-course-uuid-activate');
        mockCourseForActivate.isActive = false;

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourseForActivate} />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).not.toBeChecked(); // Initially inactive
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to activate the course
        await user.click(activateCheckbox);

        // Assert that activateCourseAction was called
        await waitFor(() => { expect(activateCourseAction).toHaveBeenCalledTimes(1); });

        // Verify the course data was passed to the activate action
        const activatedCourse = (activateCourseAction as jest.Mock).mock.calls[0][0];
        expect(activatedCourse.uuid).toBe(mockCourseForActivate.uuid);

        // Verify deactivateCourseAction was NOT called
        expect(deactivateCourseAction).not.toHaveBeenCalled();
    }, 15000);

    it('deactivate course', async () => {
        const user = userEvent.setup();

        // Create a course with uuid and full data, initially active
        const mockCourseForDeactivate = createMockCourseWithData('existing-course-uuid-deactivate');
        mockCourseForDeactivate.isActive = true;

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourseForDeactivate} />
            </Provider>
        );

        const activateCheckbox = screen.getByRole('switch', { name: /.*form.bar.activate.*/i });
        expect(activateCheckbox).toBeChecked(); // Initially active
        expect(activateCheckbox).toBeEnabled();

        // Click the activation toggle to deactivate the course
        await user.click(activateCheckbox);

        // Assert that deactivateCourseAction was called
        await waitFor(() => { expect(deactivateCourseAction).toHaveBeenCalledTimes(1); });

        // Verify the course data was passed to the deactivate action
        const deactivatedCourse = (deactivateCourseAction as jest.Mock).mock.calls[0][0];
        expect(deactivatedCourse.uuid).toBe(mockCourseForDeactivate.uuid);

        // Verify activateCourseAction was NOT called
        expect(activateCourseAction).not.toHaveBeenCalled();
    }, 15000);

    it('validates Zod schema and prevents submission with invalid data', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourse} />
            </Provider>
        );

        // Fill form with INVALID data
        const startDateInput = screen.getByLabelText(/course.startDate/i);
        const endDateInput = screen.getByLabelText(/course.endDate/i);

        await user.clear(startDateInput);
        await user.type(startDateInput, moment().add(7, 'days').format("YYYY-MM-DD"));
        // End date before start date to trigger validation error
        await user.type(endDateInput, moment().add(1, 'days').format("YYYY-MM-DD"));

        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/course.validation.endDateGreaterThanStartDate/i)).toBeInTheDocument();

        await user.clear(startDateInput);
        await user.type(startDateInput, moment().format("YYYY-MM-DD"));
        await user.clear(endDateInput);
        await user.type(endDateInput, moment().format("YYYY-MM-DD"));
        await user.click(saveButton);

           // Verify validation error messages appear in the DOM
        expect(await screen.findByText(/course.validation.endDateGreaterThanToday/i)).toBeInTheDocument();

        await waitFor(() => { expect(createCourseAction).not.toHaveBeenCalled(); });
    }, 15000);

    it('validates required fields with Zod schema', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <CourseForm lang="en" course={mockCourse} />
            </Provider>
        );

        const startDateInput = screen.getByLabelText(/course.startDate/i);
        await user.clear(startDateInput);

        // Try to submit without filling required fields
        const saveButton = screen.getByRole('button', { name: /form.buttons.save/i });
        await user.click(saveButton);

        // Verify required field validation errors appear
        expect(await screen.findByText(/course.validation.codeRequired/i)).toBeInTheDocument();
        expect(await screen.findAllByText(/course.validation.nameRequired/i)).toHaveLength(2);
        expect(await screen.findAllByText(/course.validation.descriptionRequired/i)).toHaveLength(2);
        expect(await screen.findByText(/course.validation.startDateRequired/i)).toBeInTheDocument();

        await waitFor(() => { expect(createCourseAction).not.toHaveBeenCalled(); });
    }, 15000);

});
