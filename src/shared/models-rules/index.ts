import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return request.params?.userId;
}

export const getProductIdFromRequest = (request) => {
  return request.params?.productId;
};
