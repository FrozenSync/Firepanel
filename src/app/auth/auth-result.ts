export type AuthResult = Success | Fail | AlreadyAuthenticated;

export interface Success {
  kind: 'success';
  redirectionUrl: string;
}

export interface Fail {
  kind: 'fail';
}

export interface AlreadyAuthenticated {
  kind: 'alreadyAuthenticated';
}
