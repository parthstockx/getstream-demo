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

const buyer_user_2 = {
  id: "buyer_2",
  name: "Buyer 2",
  image: `https://getstream.io/random_png/?name=Buyer-2`,
};

const seller_user_2 = {
  id: "seller_2",
  name: "Seller 2",
  image: `https://getstream.io/random_png/?name=Seller-2`,
};

const moderator_user = {
  id: "moderator_user",
  name: "Moderator",
  image: `https://getstream.io/random_png/?name=Moderator`,
};

const buyer_user_3 = {
  id: "buyer_3",
  name: "Buyer 3",
  image: `https://getstream.io/random_png/?name=Buyer-3`,
};

const seller_user_3 = {
  id: "seller_3",
  name: "Seller 3",
  image: `https://getstream.io/random_png/?name=Seller-3`,
};

const getUser = (user_id: string) => {
  if (user_id === buyer_user.id) return buyer_user;
  if (user_id === seller_user.id) return seller_user;
  if (user_id === buyer_user_2.id) return buyer_user_2;
  if (user_id === seller_user_2.id) return seller_user_2;
  if (user_id === moderator_user.id) return moderator_user;
  if (user_id === buyer_user_3.id) return buyer_user_3;
  if (user_id === seller_user_3.id) return seller_user_3;
  throw new Error("User not found");
};

export {
  getUser,
  buyer_user,
  seller_user,
  buyer_user_2,
  seller_user_2,
  moderator_user,
  buyer_user_3,
  seller_user_3,
};
