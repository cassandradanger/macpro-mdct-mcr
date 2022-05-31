import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
import { useUser } from "utils/auth";
//components
import { App } from "components";

const appComponent = (
  <RouterWrappedComponent>
    <App />
  </RouterWrappedComponent>
);

// MOCKS

jest.mock("utils/auth");
const mockedUseUser = useUser as jest.Mock<typeof useUser>;

jest.mock("../banners/AdminBanner", () => ({
  AdminBanner: jest.fn(() => ({
    key: "",
    title: "",
    description: "",
    link: "",
    startDate: 0,
    endDate: 0,
    fetchAdminBanner: () => {},
    writeAdminBanner: () => {},
    deleteAdminBanner: () => {},
  })),
}));

// TESTS

beforeEach(() => {
  mockedUseUser.mockImplementation((): any => mockStateUser);
});

describe("Test App", () => {
  test("App login page is visible", () => {
    render(appComponent);
    expect(screen.getByTestId("app-container")).toBeVisible();
  });
});

describe("App login page accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(appComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
