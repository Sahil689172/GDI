export const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  streak: user.streak ?? 0,
  createdAt: user.createdAt,
});
