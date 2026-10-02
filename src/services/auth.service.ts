import { API } from "@/config/constants";
import type { ApiEnvelope } from "@/types/api";
import type { LoginInput, RegisterInput, Session, User } from "@/types/user";
import { http, unwrap } from "./_shared";

/** The subset of the account a customer can see and edit about themselves. */
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  location: string;
}

export type ProfileUpdate = Partial<Pick<Profile, "name" | "phone" | "shippingAddress" | "location">>;

export interface LoginResponse {
  session: Session;
  user: User | null;
}

export const authService = {
  login: (input: LoginInput) =>
    http.post<ApiEnvelope<LoginResponse>>(API.auth.login, input).then(unwrap),

  logout: () => http.post<ApiEnvelope<null>>(API.auth.logout).then(unwrap),

  /** Current session or null. Cheap; safe to call on every page load. */
  getSession: () =>
    http.get<ApiEnvelope<Session | null>>(API.auth.session, { fetchOptions: { cache: "no-store" } }).then(unwrap),

  register: (input: RegisterInput) => http.post<ApiEnvelope<User>>(API.users, input).then(unwrap),

  getProfile: () => http.get<ApiEnvelope<Profile>>(API.usersMe).then(unwrap),

  updateProfile: (input: ProfileUpdate) =>
    http.patch<ApiEnvelope<Profile>>(API.usersMe, input).then(unwrap),

  forgotPassword: (email: string) =>
    http.post<ApiEnvelope<{ sent: boolean }>>(API.usersForgotPassword, { email }).then(unwrap),

  resetPassword: (input: { email: string; code: string; password: string }) =>
    http.post<ApiEnvelope<null>>(API.usersResetPassword, input).then(unwrap),

  verifyEmail: (code: string) =>
    http.post<ApiEnvelope<User>>(API.usersVerify, { code }).then(unwrap),

  resendVerification: (email: string) =>
    http.post<ApiEnvelope<{ sent: boolean }>>(API.usersResendVerification, { email }).then(unwrap),
};
