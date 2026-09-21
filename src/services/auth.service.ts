import { API } from "@/config/constants";
import type { ApiEnvelope } from "@/types/api";
import type { LoginInput, RegisterInput, Session, User } from "@/types/user";
import { http, unwrap } from "./_shared";

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
};
