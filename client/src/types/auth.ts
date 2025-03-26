export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  refresh_token: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}
