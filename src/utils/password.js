import bcrypt from "bcrypt";

async function hashPassword(plainPassword) {
  // Hash the plain password using bcrypt
  const saltRounds = 12;
  const finalBcryptHash = await bcrypt.hash(plainPassword, saltRounds);
  return finalBcryptHash;
}

async function verifyPassword(plainPassword, storedBcryptHash) {
  // Compare the result against the database hash
  const isMatch = await bcrypt.compare(plainPassword, storedBcryptHash);
  return isMatch;
}

export { hashPassword, verifyPassword };
