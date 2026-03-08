import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock next-intl to provide readable strings for assertions
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      "buttons.signin": "Sign in",
      "buttons.signout": "Sign out",
      "text.signinMessage": "Please sign in",
      "signoutConfirmation.title": "Confirm sign out",
      "signoutConfirmation.text": "Are you sure you want to sign out?",
      "signoutConfirmation.yes": "Yes",
      "signoutConfirmation.no": "No",
      "signoutConfirmation.action": "Signing out...",
    };
    return map[key] ?? key;
  },
}));

// Mock the modal confirmation to keep tests focused on behaviour
jest.mock("../../actions/modal-confirmation", () => ({
  __esModule: true,
  default: ({ title, text, yesText, noText, show, isAction, handleResult }: any) =>
    show ? (
      <div data-testid="modal">
        <h1>{title}</h1>
        <p>{text}</p>
        <button onClick={() => handleResult(false)}>{noText}</button>
        <button onClick={() => handleResult(true)}>{isAction ? yesText : yesText}</button>
      </div>
    ) : null,
}));

// Mock next-auth/react hooks and helpers
const mockSignIn = jest.fn();
const mockUseSession = jest.fn();
const mockClientSignOut = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: (provider: string) => mockSignIn(provider),
  signOut: (opts?: any) => mockClientSignOut(opts),
}));

// Mock logout function used by the component
const mockLogout = jest.fn();
jest.mock("@/src/security/actions", () => ({
  logout: () => mockLogout(),
}));

import SigninButton from "../signin-button";

describe("SigninButton — behavior tests (RTL)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signIn when user is unauthenticated and button is clicked", async () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<SigninButton lang="en" />);

    const btn = screen.getByRole("button", { name: /Sign in/i });
    fireEvent.click(btn);

    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith("entra"));
  });

  it("shows confirmation when authenticated and invokes logout when confirmed", async () => {
    mockUseSession.mockReturnValue({ data: { user: { name: "Alice" } }, status: "authenticated" });
    mockLogout.mockResolvedValue(undefined);

    render(<SigninButton lang="en" />);

    // The button should show the signout label
    const btn = screen.getByRole("button", { name: /Sign out/i });
    fireEvent.click(btn);

    // Modal should appear
    expect(await screen.findByTestId("modal")).toBeInTheDocument();

    // Click the Yes button to confirm sign out
    const yes = screen.getByText(/Yes/i);
    fireEvent.click(yes);

    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
  });
});
