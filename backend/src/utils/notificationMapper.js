export const toPublicNotification = (doc) => ({
  id: doc._id,
  userId: doc.user,
  title: doc.title,
  message: doc.message,
  type: doc.type,
  read: Boolean(doc.read),
  relatedTask: doc.relatedTask || null,
  relatedGoal: doc.relatedGoal || null,
  scheduledFor: doc.scheduledFor || null,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});
