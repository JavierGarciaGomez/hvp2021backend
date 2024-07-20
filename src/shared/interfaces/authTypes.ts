export interface SuccessAuthResponse {
  token: string;
  user: UserAuth | CollaboratorAuth;
}

export interface SuccessLogoutResponse {
  token: null;
  user: null;
}

interface UserAuth {
  uid: string;
}

export interface CollaboratorAuth {
  uid: string;
  col_code: string;
  role: string;
  imgUrl?: string;
}
