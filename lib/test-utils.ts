import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { testData } from "@/lib/mock-data"
import { expect, jest } from "@jest/globals"

// Custom render function that includes providers
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="coinvoice-theme">
      <AuthProvider>
        {ui}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

// Helper to simulate login
export async function loginUser(email = "admin@example.com", password = "admin123") {
  renderWithProviders(
    <div>
      <input data-testid="email-input" />
      <input data-testid="password-input" />
      <button data-testid="login-button">Login</button>
    </div>,
  )

  await userEvent.type(screen.getByTestId("email-input"), email)
  await userEvent.type(screen.getByTestId("password-input"), password)
  await userEvent.click(screen.getByTestId("login-button"))

  return waitFor(() => {
    expect(localStorage.getItem("coinvoice_user")).not.toBeNull()
  })
}

// Helper to simulate wallet connection
export async function mockWalletConnection(address = "0x1234567890abcdef1234567890abcdef12345678") {
  // Mock ethereum provider
  global.ethereum = {
    request: jest.fn().mockResolvedValue([address]),
    on: jest.fn(),
    removeListener: jest.fn(),
    isMetaMask: true,
  }

  // Mock ethers
  jest.mock("ethers", () => ({
    BrowserProvider: jest.fn().mockImplementation(() => ({
      getSigner: jest.fn().mockResolvedValue({
        signMessage: jest.fn().mockResolvedValue("0xmocksignature"),
      }),
      send: jest.fn().mockResolvedValue([address]),
    })),
    verifyMessage: jest.fn().mockReturnValue(address),
  }))

  return address
}

// Helper to generate test data
export const generateTestData = {
  ...testData,

  // Generate test cases
  generateTestCase: (component: string, overrides = {}) => {
    return {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Test ${component} functionality`,
      description: `Verify that the ${component} component works as expected`,
      component,
      steps: ["Render the component", "Interact with the component", "Verify the expected behavior"],
      expectedResult: "Component should behave as expected",
      status: "pending",
      ...overrides,
    }
  },

  // Generate test results
  generateTestResult: (testId: string, passed = true, overrides = {}) => {
    return {
      testId,
      passed,
      timestamp: new Date(),
      duration: Math.random() * 1000,
      error: passed ? undefined : "Test failed with an error",
      ...overrides,
    }
  },
}

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
