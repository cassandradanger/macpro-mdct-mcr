import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
// components
import { AppRoutes } from "components";
// utils
import { useUser, UserProvider } from "utils";
import {
  mockAdminUser,
  mockLDFlags,
  mockStateUser,
  mockStateUserNoReports,
} from "utils/testing/setupJest";
// verbiage
import notFoundVerbiage from "verbiage/pages/not-found";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

mockLDFlags.setDefault({ mlrReport: true });

const appRoutesComponent = (history: any) => (
  <Router location={history.location} navigator={history}>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </Router>
);

let history: any;
const tempScroll = window.HTMLElement.prototype.scrollIntoView;

describe("Test AppRoutes for admin-specific routes", () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    mockedUseUser.mockReturnValue(mockAdminUser);
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });
  afterEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = tempScroll;
  });
  test("/admin is visible for admin user", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/admin");
  });
});

describe("Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("/admin not visible for state user; redirects to /profile", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/profile");
  });
});

describe("Test AppRoutes for non-admin-specific routes", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    history = createMemoryHistory();
    history.push("/admin");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("/admin not visible for state user; redirects to /profile", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/profile");
  });
});

describe("Test AppRoutes 404 handling", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    history = createMemoryHistory();
    history.push("/obviously-fake-route");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });

  test("not-found routes redirect to 404", () => {
    expect(screen.getByText(notFoundVerbiage.header)).toBeVisible();
  });
});

describe("Test AppRoutes for MCPAR report-specific routes", () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    mockedUseUser.mockReturnValue(mockStateUser);
    history = createMemoryHistory();
    history.push("/mcpar");
    await act(async () => {
      await render(appRoutesComponent(history));
    });
  });
  afterEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = tempScroll;
  });
  test("/mcpar is visible for state user with access", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/mcpar");
  });
});

describe("Test AppRoutes for state users without report-specific access", () => {
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    mockedUseUser.mockReturnValue(mockStateUserNoReports);
    history = createMemoryHistory();
    history.push("/mlr");
    await act(async () => {
      mockLDFlags.set({ mlrReport: true });
      await render(appRoutesComponent(history));
    });
  });
  afterEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = tempScroll;
  });
  test("/mlr is not visible for state user without access", async () => {
    const currentPath = history.location.pathname;
    expect(currentPath).toEqual("/");
  });
});
