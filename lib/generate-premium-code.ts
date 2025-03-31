import { Charset, charset, generate } from "referral-codes";

export const generatePremiumCode = () => {
  return generate({
    length: 10,
    count: 1,
    charset: charset(Charset.ALPHANUMERIC),
  });
};
