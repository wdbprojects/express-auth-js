import bcrypt from "bcryptjs";

export const hashPassword = async (password: string, saltRounds?: number) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds || 10);
  return hashedPassword;
};

export const comparePassword = async (
  value: string,
  hashedPassword: string,
) => {
  const comparedPassword = await bcrypt
    .compare(value, hashedPassword)
    .catch(() => {
      return false;
    });
  return comparedPassword;
};
