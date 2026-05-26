import * as notificationService from '../services/notificationService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const list = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listNotifications(req.user._id, req.query);
  const unreadCount = await notificationService.getUnreadCount(req.user._id);
  sendSuccess(res, {
    message: 'Notifications retrieved',
    data: { notifications, unreadCount },
    meta: { count: notifications.length },
  });
});

export const create = asyncHandler(async (req, res) => {
  const notification = await notificationService.createNotification(req.user._id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Notification created',
    data: { notification },
  });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user._id, req.params.id);
  sendSuccess(res, { message: 'Notification marked as read', data: { notification } });
});

export const markAllRead = asyncHandler(async (req, res) => {
  const modified = await notificationService.markAllAsRead(req.user._id);
  sendSuccess(res, { message: 'All notifications marked as read', data: { modified } });
});

export const remove = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.user._id, req.params.id);
  sendSuccess(res, { message: 'Notification deleted' });
});

export const generate = asyncHandler(async (req, res) => {
  const result = await notificationService.generateReminders(req.user._id);
  sendSuccess(res, {
    message: 'Reminders generated',
    data: result,
  });
});
