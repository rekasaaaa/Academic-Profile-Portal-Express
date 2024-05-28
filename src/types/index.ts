export type AccountType = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type SigninType = {
  email: string;
  password: string;
};

export type PortfolioType = {
  userId: number;
  title: string;
  description: string;
  gitUrl: string;
};
