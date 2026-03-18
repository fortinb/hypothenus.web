import { LanguageEnum } from '@/src/lib/entities/enum/language-enum';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';

// Test data constants for person
export const TEST_PERSON = {
    firstname: 'John',
    lastname: 'Doe',
    dateOfBirth: moment('1990-01-01').toDate().toISOString(),
    email: 'person@example.com',
    note: 'Test note',
    photoUri: 'http://example.com/photo.jpg',
    communicationLanguage: LanguageEnum.fr
};

// Test data constants for address
export const TEST_ADDRESS = {
    civicNumber: '123',
    streetName: 'Main Street',
    city: 'Montreal',
    state: 'QC',
    zipCode: 'H1A 1A1'
};

// Test data constants for phone numbers
export const TEST_PHONE_NUMBERS = {
    home: '(514) 555-1234',
    business: '(514) 123-4567',
    mobile: '(514) 987-6543'
};

// Test data constants for contact
export const TEST_CONTACT = {
    firstname: 'John',
    lastname: 'Doe',
    description: 'General Manager',
    email: 'john.doe@testcontact.com'
};

// Invalid test data constants
export const INVALID_PHONE = {
    invalidFormat: '123ABC'
};

// Invalid test data constants
export const INVALID_EMAIL = {
    invalidEmail: 'invalid-email'
};

/**
 * Helper method to fill address section in a form
 * Expands the address accordion and fills all address fields
 */
export const fillAddressSection = async (
    user: ReturnType<typeof userEvent.setup>,
    addressAccordionSelector: string
) => {
    // Expand address accordion to access nested fields
    const addressAccordionButton = screen.getByText(new RegExp(addressAccordionSelector, 'i'));
    await user.click(addressAccordionButton);

    // Wait for accordion to expand and fields to be visible
    expect(await screen.findByLabelText(/address.civicNumber/i)).toBeVisible();

    // Fill required address fields (AddressSchema validation)
    const civicNumberInput = screen.getByLabelText(/address.civicNumber/i);
    const streetNameInput = screen.getByLabelText(/address.street/i);
    const cityInput = screen.getByLabelText(/address.city/i);
    const stateInput = screen.getByLabelText(/address.state/i);
    const zipCodeInput = screen.getByLabelText(/address.zipcode/i);

    await user.type(civicNumberInput, TEST_ADDRESS.civicNumber);
    await user.type(streetNameInput, TEST_ADDRESS.streetName);
    await user.type(cityInput, TEST_ADDRESS.city);
    await user.type(stateInput, TEST_ADDRESS.state);
    await user.type(zipCodeInput, TEST_ADDRESS.zipCode);
};

/**
 * Helper method to fill phone numbers section in a form
 * Expands the phone numbers accordion and fills phone fields
 */
export const fillPhoneNumbersSection = async (
    user: ReturnType<typeof userEvent.setup>,
    phonesAccordionSelector: string
) => {
    // Expand phone numbers accordion to access phone fields
    const phonesAccordionButton = screen.getByText(new RegExp(phonesAccordionSelector, 'i'));
    await user.click(phonesAccordionButton);

    // Get the accordion container to scope our queries (avoid conflicts with contact phone fields)
    const phonesSection = phonesAccordionButton.closest('.accordion-item') as HTMLElement;
    if (!phonesSection) throw new Error('Phone accordion section not found');

    // Wait for accordion to expand and fields to be visible within this section
    expect(await within(phonesSection).findByLabelText(/phoneNumber.mobile/i)).toBeVisible();

    // Fill phone number fields (2 phone numbers: Business and Mobile) - scoped to this section
    const homePhoneInput = within(phonesSection).queryByLabelText(/phoneNumber.home/i);
    const businessPhoneInput = within(phonesSection).queryByLabelText(/phoneNumber.business/i);
    const mobilePhoneInput = within(phonesSection).queryByLabelText(/phoneNumber.mobile/i);

    if (homePhoneInput) {
        await user.type(homePhoneInput, TEST_PHONE_NUMBERS.home);
    }
    if (businessPhoneInput) {
        await user.type(businessPhoneInput, TEST_PHONE_NUMBERS.business);
    }
    if (mobilePhoneInput) {
        await user.type(mobilePhoneInput, TEST_PHONE_NUMBERS.mobile);
    }
};

/**
 * Helper method to fill contacts section in a form
 * Expands the contacts accordion and fills contact fields
 * Note: Contacts has TWO levels of accordions - outer "brand.contacts" and inner individual contact accordions
 */
export const fillContactsSection = async (
    user: ReturnType<typeof userEvent.setup>,
    contactsAccordionSelector: string,
    firstContactAccordionSelector: string) => {
    // Expand outer contacts accordion
    const contactsAccordionButton = screen.getByText(new RegExp(contactsAccordionSelector, 'i'));
    await user.click(contactsAccordionButton);

    // Wait for inner contact accordion to appear (first contact)
    expect(await screen.findByTestId(new RegExp(firstContactAccordionSelector, 'i'))).toBeInTheDocument();

    // Expand the first contact's accordion to access the actual fields
    const firstContactAccordionButton = screen.getByTestId(new RegExp(firstContactAccordionSelector, 'i'));
    await user.click(firstContactAccordionButton);

    // Wait for contact fields to be visible after expanding inner accordion
    expect(await screen.findByLabelText(/person.firstname/i)).toBeVisible();

    // Fill contact fields (firstname, lastname, description are required)
    const firstnameInput = await screen.findByLabelText(/person.firstname/i);
    const lastnameInput = await screen.findByLabelText(/person.lastname/i);
    const descriptionInput = await screen.findByLabelText(/person.description/i);

    await user.type(firstnameInput, TEST_CONTACT.firstname);
    await user.type(lastnameInput, TEST_CONTACT.lastname);
    await user.type(descriptionInput, TEST_CONTACT.description);
};

export const fillEmergencyContactsSection = async (
    user: ReturnType<typeof userEvent.setup>,
    contactsAccordionSelector: string,
    firstContactAccordionSelector: string) => {
    // Expand outer contacts accordion
    const contactsAccordionButton = screen.getByText(new RegExp(contactsAccordionSelector, 'i'));
    await user.click(contactsAccordionButton);

    // Wait for inner contact accordion to appear (first contact)
    expect(await screen.findByTestId(new RegExp(firstContactAccordionSelector, 'i'))).toBeInTheDocument();

    // Expand the first contact's accordion to access the actual fields
    const firstContactAccordionButton = screen.getByTestId(new RegExp(firstContactAccordionSelector, 'i'));
    await user.click(firstContactAccordionButton);

    // Get the contact accordion-item container to scope queries (avoid conflicts with outer phone section)
    const firstContactSection = firstContactAccordionButton.closest('.accordion-item') as HTMLElement;
    if (!firstContactSection) throw new Error('First contact accordion section not found');

    // Wait for contact fields to be visible after expanding inner accordion
    expect(await within(firstContactSection).findByLabelText(/person.firstname/i)).toBeVisible();

    // Fill contact fields (firstname, lastname, description are required)
    await user.type(within(firstContactSection).getByLabelText(/person.firstname/i), TEST_CONTACT.firstname);
    await user.type(within(firstContactSection).getByLabelText(/person.lastname/i), TEST_CONTACT.lastname);
    await user.type(within(firstContactSection).getByLabelText(/person.description/i), TEST_CONTACT.description);

    // Fill optional email field
    const emailInput = within(firstContactSection).queryByLabelText(/person.email/i);
    if (emailInput) {
        await user.type(emailInput, TEST_CONTACT.email);
    }

    // Fill contact phone fields scoped to this contact section
    const homePhoneInput = within(firstContactSection).queryByLabelText(/phoneNumber.home/i);
    const mobilePhoneInput = within(firstContactSection).queryByLabelText(/phoneNumber.mobile/i);

    if (homePhoneInput) {
        await user.type(homePhoneInput, TEST_PHONE_NUMBERS.home);
    }
    if (mobilePhoneInput) {
        await user.type(mobilePhoneInput, TEST_PHONE_NUMBERS.mobile);
    }
};

/**
 * Helper method to update address fields with _update_ suffix
 * Expands the address accordion and updates all address fields
 */
export const updateAddressFields = async (
    user: ReturnType<typeof userEvent.setup>,
    addressAccordionSelector: string) => {
    // Expand address accordion
    const addressAccordionButton = screen.getByText(new RegExp(addressAccordionSelector, 'i'));
    await user.click(addressAccordionButton);

    // Wait for fields to be visible after expanding accordion
    expect(await screen.findByLabelText(/address.civicNumber/i)).toBeVisible();

    const civicNumberInput = screen.getByLabelText(/address.civicNumber/i);
    const streetNameInput = screen.getByLabelText(/address.street/i);
    const cityInput = screen.getByLabelText(/address.city/i);
    const stateInput = screen.getByLabelText(/address.state/i);
    const zipCodeInput = screen.getByLabelText(/address.zipcode/i);

    await user.clear(civicNumberInput);
    await user.type(civicNumberInput, TEST_ADDRESS.civicNumber + '_update_');
    await user.clear(streetNameInput);
    await user.type(streetNameInput, TEST_ADDRESS.streetName + '_update_');
    await user.clear(cityInput);
    await user.type(cityInput, TEST_ADDRESS.city + '_update_');
    await user.clear(stateInput);
    await user.type(stateInput, TEST_ADDRESS.state + '_update_');
    await user.clear(zipCodeInput);
    await user.type(zipCodeInput, TEST_ADDRESS.zipCode + '_update_');
};

/**
 * Helper method to update phone numbers fields
 * Expands the phone numbers accordion and updates phone fields
 */
export const updatePhoneNumbersFields = async (
    user: ReturnType<typeof userEvent.setup>,
    phonesAccordionSelector: string,
    businessNumber: any = null,
    mobileNumber: any = null,
    homeNumber: any = null,
) => {
    // Expand phone numbers accordion
    const phonesAccordionButton = screen.getByText(new RegExp(phonesAccordionSelector, 'i'));
    await user.click(phonesAccordionButton);

    // Get the accordion container to scope our queries (avoid conflicts with contact phone fields)
    const phonesSection = phonesAccordionButton.closest('.accordion-item') as HTMLElement;
    if (!phonesSection) throw new Error('Phone accordion section not found');

    if (homeNumber) {
        expect(await within(phonesSection).findByLabelText(/phoneNumber.home/i)).toBeVisible();
        const homePhoneInput = within(phonesSection).getByLabelText(/phoneNumber.home/i);
        await user.clear(homePhoneInput);
        await user.type(homePhoneInput, homeNumber);
    }
    if (businessNumber) {
        expect(await within(phonesSection).findByLabelText(/phoneNumber.business/i)).toBeVisible();
        const businessPhoneInput = within(phonesSection).getByLabelText(/phoneNumber.business/i);
        await user.clear(businessPhoneInput);
        await user.type(businessPhoneInput, businessNumber);
    }
    if (mobileNumber) {
        expect(await within(phonesSection).findByLabelText(/phoneNumber.mobile/i)).toBeVisible();
        const mobilePhoneInput = within(phonesSection).getByLabelText(/phoneNumber.mobile/i);
        await user.clear(mobilePhoneInput);
        await user.type(mobilePhoneInput, mobileNumber);
    }
};

/**
 * Helper method to update contact fields with _update_ suffix
 * Expands the contacts accordion and updates contact fields
 * Note: Contacts has TWO levels of accordions - outer "brand.contacts" and inner individual contact accordions
 */
export const updateContactFields = async (
    user: ReturnType<typeof userEvent.setup>,
    contactsAccordionSelector: string,
    firstContactAccordionSelector: string
) => {
    // Expand outer contacts accordion
    const contactsAccordionButton = screen.getByText(new RegExp(contactsAccordionSelector, 'i'));
    await user.click(contactsAccordionButton);

    // Wait for inner contact accordion to appear (first contact)
    expect(await screen.findByTestId(new RegExp(firstContactAccordionSelector, 'i'))).toBeInTheDocument();

    // Expand the first contact's accordion to access the actual fields
    const firstContactAccordionButton = await screen.findByTestId(new RegExp(firstContactAccordionSelector, 'i'));
    await user.click(firstContactAccordionButton);

    // Wait for contact fields to be visible after expanding inner accordion
    expect(await screen.findByLabelText(/person.firstname/i)).toBeVisible();

    const firstnameInput = await screen.findByLabelText(/person.firstname/i);
    const lastnameInput = await screen.findByLabelText(/person.lastname/i);
    const descriptionInput = await screen.findByLabelText(/person.description/i);

    await user.clear(firstnameInput);
    await user.type(firstnameInput, TEST_CONTACT.firstname + '_update_');
    await user.clear(lastnameInput);
    await user.type(lastnameInput, TEST_CONTACT.lastname + '_update_');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, TEST_CONTACT.description + '_update_');
};

export const updateEmergencyContactFields = async (
    user: ReturnType<typeof userEvent.setup>,
    contactsAccordionSelector: string,
    firstContactAccordionSelector: string
) => {
    // Expand outer contacts accordion
    const contactsAccordionButton = screen.getByText(new RegExp(contactsAccordionSelector, 'i'));
    await user.click(contactsAccordionButton);

    // Wait for inner contact accordion to appear (first contact)
    expect(await screen.findByTestId(new RegExp(firstContactAccordionSelector, 'i'))).toBeInTheDocument();

    // Expand the first contact's accordion to access the actual fields
    const firstContactAccordionButton = await screen.findByTestId(new RegExp(firstContactAccordionSelector, 'i'));
    await user.click(firstContactAccordionButton);

    // Get the contact accordion-item container to scope queries (avoid conflicts with outer phone section)
    const firstContactSection = firstContactAccordionButton.closest('.accordion-item') as HTMLElement;
    if (!firstContactSection) throw new Error('First contact accordion section not found');

    // Wait for contact fields to be visible after expanding inner accordion
    expect(await within(firstContactSection).findByLabelText(/person.firstname/i)).toBeVisible();

    const firstnameInput = within(firstContactSection).getByLabelText(/person.firstname/i);
    const lastnameInput = within(firstContactSection).getByLabelText(/person.lastname/i);
    const descriptionInput = within(firstContactSection).getByLabelText(/person.description/i);

    await user.clear(firstnameInput);
    await user.type(firstnameInput, TEST_CONTACT.firstname + '_update_');
    await user.clear(lastnameInput);
    await user.type(lastnameInput, TEST_CONTACT.lastname + '_update_');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, TEST_CONTACT.description + '_update_');

    // Update optional email field
    const emailInput = within(firstContactSection).queryByLabelText(/person.email/i);
    if (emailInput) {
        await user.clear(emailInput);
        await user.type(emailInput, 'update__' + TEST_CONTACT.email);
    }

    // Update contact phone fields scoped to this contact section
    const homePhoneInput = within(firstContactSection).queryByLabelText(/phoneNumber.home/i);
    const mobilePhoneInput = within(firstContactSection).queryByLabelText(/phoneNumber.mobile/i);

    if (homePhoneInput) {
        await user.clear(homePhoneInput);
        await user.type(homePhoneInput, '(514) 111-1111');
    }
    if (mobilePhoneInput) {
        await user.clear(mobilePhoneInput);
        await user.type(mobilePhoneInput, '(514) 222-2222');
    }
};

export const logFormValidationErrors = () => {
    const validationErrors = document.querySelectorAll('.text-invalid');
    if (validationErrors.length > 0) {
        console.log('❌ Validation errors found:', Array.from(validationErrors).map(el => el.textContent));
        // Check accordion headers for validation indicators
        const invalidAccordions = document.querySelectorAll('.accordeon-header-invalid');
        if (invalidAccordions.length > 0) {
            console.log('❌ Invalid accordion sections:', Array.from(invalidAccordions).map(el => el.textContent));
        }
    }
}
