import { render, screen } from "@testing-library/react";
import { it, describe, expect } from "vitest";
import LoginPage from "./login";

describe("Login Page", () => {
	it("should render with required fields", () => {
		render(<LoginPage />);
		// getBy -> throws an error
		// findBy -> Async
		// queryBy -> null
		expect(screen.getByText(/Sign in/)).toBeInTheDocument();
		expect(screen.getByPlaceholderText("UserName")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", { name: "Remember me" })
		).toBeInTheDocument();
		expect(screen.getByText("Forgot Password")).toBeInTheDocument();
	});
});
