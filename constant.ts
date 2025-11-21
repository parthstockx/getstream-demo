const buyer_user = {
  id: "buyer",
  name: "Buyer",
  image: `https://getstream.io/random_png/?name=Buyer`,
};

const seller_user = {
  id: "seller",
  name: "Seller",
  image: `https://getstream.io/random_png/?name=Seller`,
};

const getUser = (user_id: string) => {
  if (user_id === buyer_user.id) return buyer_user;
  if (user_id === seller_user.id) return seller_user;
  throw new Error("User not found");
};

export { getUser, buyer_user, seller_user };
