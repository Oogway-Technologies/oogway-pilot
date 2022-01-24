import cryptoRandomString from "crypto-random-string";

// Utility function for setting up a user
export const formatUser = async (user) => {
  const decodedToken = await user.getIdTokenResult(/*forceRefresh*/ true);
  const { token, expirationTime } = decodedToken;

  // console.log(token);
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    resetProfile: true,
    token,
    expirationTime,
    // stripeRole: await getStripeRole(),
  };
};

export const getRandomUsername = () => {
  const {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
  } = require("unique-names-generator");
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });
  return randomName;
};

export const getRandomProfilePic = () => {
  const randomString = cryptoRandomString({ length: 10 });
  return `https://avatars.dicebear.com/api/pixel-art/${randomString}.svg`;
};
