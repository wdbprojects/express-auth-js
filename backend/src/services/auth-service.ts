import UserModel from "../models/user-model";
import VerificationCode from "../models/verification-code-model";
import VerificationCodeTypes from "../constants/verificationCodeTypes";
import { oneYearFromNow } from "../utils/date";
import SessionModel from "../models/session-model";
import jwt from "jsonwebtoken";
import appAssert from "../utils/appAsserts";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export type LoginUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};

/* BUSINESS LOGIC */
export const createAccount = async (data: CreateAccountParams) => {
  // 1. verify if user exists
  const existingUser = await UserModel.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, "Email already in use");

  // 2. if no user found create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  // 3. create verification code
  const verificationCode = await VerificationCode.create({
    userId: user._id,
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // 4. send verification email
  // 5. create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });
  // 6. sign access token & refresh token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    process.env.JWT_REFRESH_SECRET!,
    { audience: ["user"], expiresIn: "30d" },
  );
  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    process.env.JWT_SECRET!,
    { audience: ["user"], expiresIn: "15m" },
  );

  // 7. return new user and access tokens
  return {
    user: user.omitPassword(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginUserParams) => {
  // 1. get user by email
  const user = await UserModel.findOne({ email: email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  // 2. validate password from the request
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");
  // 3. create a session
  const userId = user._id;
  const session = await SessionModel.create({ userId, userAgent });
  const sessionInfo = {
    sessionId: session._id,
  };
  // 4. sign access token & refresh token
  const refreshToken = jwt.sign(sessionInfo, process.env.JWT_REFRESH_SECRET!, {
    audience: ["user"],
    expiresIn: "30d",
  });
  const accessToken = jwt.sign(
    { ...sessionInfo, userId: user._id },
    process.env.JWT_SECRET!,
    { audience: ["user"], expiresIn: "15m" },
  );
  // 5. return user and tokens
  return {
    user: user.omitPassword(),
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};
