export interface Claim {
  issuer: string;
  originalIssuer: string;
  properties: { [key: string]: string };
  subject: {
    authenticationType: string;
    isAuthenticated: boolean;
    actor: any;
    bootstrapContext: any;
    claims: (Claim | null)[];
    label: any;
    name: any;
    nameClaimType: string;
    roleClaimType: string;
  };
  type: string;
  value: string;
  valueType: string;
}

interface Identity {
  name: any;
  authenticationType: string;
  isAuthenticated: boolean;
}

interface Data {
  claims: Claim[];
  identities: Identity[];
  identity: Identity;
}

