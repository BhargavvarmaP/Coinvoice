import type React from "react"
import { render, screen, fireEvent, waitFor, RenderOptions } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { testData } from "@/lib/mock-data"
import { expect, jest } from "@jest/globals"
import type { ThemeProviderProps } from "next-themes"

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  themeProps?: Partial<ThemeProviderProps>
}

// Custom render function that includes providers
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { themeProps, ...renderOptions } = options;
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange {...themeProps}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Helper to simulate login
export async function loginUser(email = "admin@example.com", password = "admin123") {
  renderWithProviders(
    <div>
      <input data-testid="email-input" type="email" defaultValue={email} />
      <input data-testid="password-input" type="password" defaultValue={password} />
      <button data-testid="login-button" type="button">Login</button>
    </div>
  );

  await userEvent.type(screen.getByTestId("email-input"), email);
  await userEvent.type(screen.getByTestId("password-input"), password);
  await userEvent.click(screen.getByTestId("login-button"));

  return waitFor(() => {
    expect(localStorage.getItem("coinvoice_user")).not.toBeNull();
  });
}

// Helper to simulate wallet connection
export async function mockWalletConnection(address = "0x1234567890abcdef1234567890abcdef12345678") {
  // Mock ethereum provider
  interface EthereumProvider {
    request: jest.Mock;
    on: jest.Mock;
    removeListener: jest.Mock;
    isMetaMask: boolean;
  }

  (global as any).ethereum = {
    request: jest.fn().mockResolvedValue([address]),
    on: jest.fn(),
    removeListener: jest.fn(),
    isMetaMask: true,
  } as EthereumProvider;

  // Mock ethers
  jest.mock("ethers", () => ({
    BrowserProvider: jest.fn().mockImplementation(() => ({
      getSigner: jest.fn().mockResolvedValue({
        signMessage: jest.fn().mockResolvedValue("0xmocksignature"),
      }),
      send: jest.fn().mockResolvedValue([address]),
    })),
    verifyMessage: jest.fn().mockReturnValue(address),
  }));

  return address;
}

// Helper to generate test data
export const generateTestData = {
  ...testData,

  // Generate test cases
  generateTestCase: (component: string, overrides: Record<string, unknown> = {}) => {
    return {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Test ${component} functionality`,
      description: `Verify that the ${component} component works as expected`,
      component,
      steps: ["Render the component", "Interact with the component", "Verify the expected behavior"],
      expectedResult: "Component should behave as expected",
      status: "pending",
      ...overrides,
    };
  },

  // Generate test results
  generateTestResult: (testId: string, passed = true, overrides: Record<string, unknown> = {}) => {
    return {
      testId,
      passed,
      timestamp: new Date(),
      duration: Math.random() * 1000,
      error: passed ? undefined : "Test failed with an error",
      ...overrides,
    }
  },
};

// Export testing utilities
export const testUtils = {
  render: renderWithProviders,
  screen,
  fireEvent,
  waitFor,
  userEvent: userEvent.setup(),
  loginUser,
  mockWalletConnection,
  generateTestData,
}
