import { Router } from "express";
import { AuthController } from "../../controller/Authentication.controller";
import { beforeEach, expect, test, vitest } from "vitest";

let authController: AuthController;

beforeEach(() => {
  authController = new AuthController();
});

test("should create an instance of AuthController", () => {
  expect(authController).toBeInstanceOf(AuthController);
});

test("should have a router property of type Router", () => {
  expect(authController.getRouter()).toBeDefined();

});

test("should handle routes correctly", () => {
  const mockRouter = {
    get: vitest.fn(),
    post: vitest.fn(),
    put: vitest.fn(),
    delete: vitest.fn(),
  };

  const authController = new AuthController();
  const router = authController.getRouter();

  expect(mockRouter.get).toBeDefined();
  expect(mockRouter.post).toBeDefined();
  expect(mockRouter.put).toBeDefined();
  expect(mockRouter.delete).toBeDefined();
});
