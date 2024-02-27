import { Response, Router } from "express";
import { AuthController } from "../../controller/Authentication.controller";
import { beforeAll, beforeEach, expect, test, vitest } from "vitest";
import { MockResponse, createRequest, createResponse } from "node-mocks-http";
import Config from "../../config";
import mongoose from "mongoose";
import { UserM } from "../../model/UserSchema";
import { Gender } from "../../model/Gender";
import { User } from "../../model/User";
import { IAuth } from "../../service/interface/IAuthentication";
import { AuthService } from "../../service/Authentication";

let authController: AuthController;
let authService: IAuth;

beforeAll(async () => {
  try {
    const config = new Config();
    await mongoose.connect(config.getDatabaseUrl());
    await UserM.deleteMany({});
  } catch (e) {
    throw e;
  }
});

beforeEach(async () => {
  authController = new AuthController();
  authService = new AuthService();
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

test("should register user", async () => {
  const mockUser: User = {
    username: "KAN",
    firstname: "Mum",
    lastname: "Mei",
    password: "1234",
    email: "k@mock.com",
    gender: Gender.MALE,
    interestedCategory: ["a", "b", "c"],
  };

  const mockRequest = createRequest({ body: mockUser });
  const mockResponse = createResponse();

  const response: MockResponse<any> = await authController.register(
    mockRequest,
    mockResponse
  );

  expect(response).to.not.null;
  const result = response._getJSONData();
  expect(response!.statusCode).toBe(200);
  expect(result.body.message).toBe("success");
  expect(result.body.data.username).toBe(mockUser.username);
  expect(result.body.data.email).toBe(mockUser.email);
  expect(result.body.data.firstname).toBe(mockUser.firstname);
  expect(result.body.data.lastname).toBe(mockUser.lastname);
});

test('should return fail when invalid user information is provided', async() => {
  const attempt = {
    email: "k@eiei.com",
    gender: Gender.MALE,
    interestedCategory: ["a", "b", "c"],
  };

  const mockRequest = createRequest({ body: attempt });
  const mockResponse = createResponse();

  const response: MockResponse<any> = await authController.register(
    mockRequest,
    mockResponse
  );

  expect(response).to.not.null;
  const result = response._getJSONData();
  
  expect(response!.statusCode).toBe(400);
  expect(result.body.message).toBe("Incomplete provided data");


})

test('should return fail when duplicate user information is provided', async() => {
  const attempt = {
    username: "KAN",
    firstname: "Mum",
    lastname: "Mei",
    password: "1234",
    email: "k@mock.com",
    gender: Gender.MALE,
    interestedCategory: ["a", "b", "c"],
  };

  const mockRequest = createRequest({ body: attempt });
  const mockResponse = createResponse();

  try{
    const response: MockResponse<any> = await authController.register(
      mockRequest,
      mockResponse
    );

  }catch(e){
    expect(e).to.not.null
    expect(e instanceof Error ).toBe(true)
    if(e instanceof Error){
      expect(e.message).toBe("Duplicate User.")
    }
  }


})

test("should return success when invalid email and password are provided", async () => {
  const attempt1 = {
    email: "k@mock.com",
    password: "1234",
  };

  const mockRequest = createRequest({ body: attempt1 });
  const mockResponse = createResponse();

  const response: MockResponse<any> = await authController.login(
    mockRequest,
    mockResponse
  );

  expect(response).to.not.null;
  expect(response._getJSONData().body).to.not.null;
  expect(response!.statusCode).toBe(200);
});

test("should return success when valid username and password are provided", async () => {
  const attempt1 = {
    username: "KAN",
    password: "1234",
  };

  const mockRequest = createRequest({ body: attempt1 });
  const mockResponse = createResponse();

  const response: MockResponse<any> = await authController.login(
    mockRequest,
    mockResponse
  );

  expect(response).to.not.null;
  expect(response._getJSONData().body).to.not.null;
  expect(response!.statusCode).toBe(200);
});

test("should return fail when submit nothing", async () => {
  const mockRequest = createRequest({body: undefined});
  const mockResponse = createResponse();

  const response: MockResponse<any> = await authController.login(
    mockRequest,
    mockResponse
  );

  expect(response).to.not.null;
  expect(response._getJSONData().body.message).toBe("Incomplete provided data");
  expect(response!.statusCode).toBe(400);
});

test("should return failed when valid username and password are invalid", async () => {
  const attempts = [
    {
      username: "KAN",
      password: "12345",
      expectedMessage: "Invalid passowrd",
      statusCode: 401
    },
    {
      username: "KANT",
      password: "1234",
      expectedMessage: "Invalid Username or Email",
      statusCode: 401
    },
    {
      email: "KANT@FAIL.com",
      password: "1234",
      expectedMessage: "Invalid Username or Email",
      statusCode: 401
    },
    {
      //empty case
      expectedMessage: "Incomplete provided data",
      statusCode: 400
    },

  ];

  for(const attempt of attempts){
    const mockRequest = createRequest({ body: {email: attempt.email, password: attempt.password, username: attempt.username} });
    const mockResponse = createResponse();
  
    const response: MockResponse<any> = await authController.login(
      mockRequest,
      mockResponse
    );
    const result = response._getJSONData()
   
    expect(response.body).to.not.null;
    expect(result.body.data).toBe('');
    expect(response!.statusCode).toBe(attempt.statusCode);
    expect(result.body.message).toBe(attempt.expectedMessage);
  }
});


test("should return 500 when submit nothing", async () => {
  const mockErrorService: IAuth = {
    findUserWithEmail: vitest.fn().mockRejectedValue(new Error('Mock error')),
    findUserWithUsername: vitest.fn().mockRejectedValue(new Error('Mock error')),
    isDuplicate: vitest.fn().mockRejectedValue(new Error('Mock error')),
    save: vitest.fn().mockRejectedValue(new Error('Mock error')),
    find: vitest.fn().mockRejectedValue(new Error('Mock error')),
    update: vitest.fn().mockRejectedValue(new Error('Mock error'))
  }
  const mockController = new AuthController()
  mockController.authService = mockErrorService


  const mockRequest = createRequest({body: {username: 'a', password: 'b'}});
  const mockResponse = createResponse();


  const response: MockResponse<any> = await mockController.login(
    mockRequest,
    mockResponse
  );
  try{
    const response: MockResponse<any> = await authController.register(
      mockRequest,
      mockResponse
    );

  }catch(e){
    expect(e).to.not.null
    expect(e instanceof Error ).toBe(true)
    if(e instanceof Error){
      expect(e.message).toBe("Mock error")
    }
  }



});