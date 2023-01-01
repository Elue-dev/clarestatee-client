export interface registerType {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
}

export interface loginType {
  emailOrPhone: string;
  password: string;
}

export interface resetType {
  newPassword: string;
  confirmNewPassword: string;
}
