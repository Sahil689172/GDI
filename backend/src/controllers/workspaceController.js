import * as workspaceService from '../services/workspaceService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const listWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await workspaceService.listWorkspaces(req.user._id);
  sendSuccess(res, {
    message: 'Workspaces retrieved',
    data: { workspaces },
    meta: { count: workspaces.length },
  });
});

export const createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await workspaceService.createWorkspace(req.user._id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Workspace created',
    data: { workspace },
  });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const { name, collapsed, order } = req.body;
  if (name === undefined && collapsed === undefined && order === undefined) {
    throw ApiError.badRequest('No valid fields to update');
  }
  const workspace = await workspaceService.updateWorkspace(req.user._id, req.params.id, {
    name,
    collapsed,
    order,
  });
  sendSuccess(res, { message: 'Workspace updated', data: { workspace } });
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
  await workspaceService.deleteWorkspace(req.user._id, req.params.id);
  sendSuccess(res, { message: 'Workspace deleted' });
});

export const reorderWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await workspaceService.reorderWorkspaces(
    req.user._id,
    req.body.orderedIds
  );
  sendSuccess(res, { message: 'Workspaces reordered', data: { workspaces } });
});
