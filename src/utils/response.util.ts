import { Response } from 'express';

/**
 * Success Response
 * @param statusCode HTTP status code
 * @param message Response message
 * @param data Response data (optional)
 * @returns Standardized success response
 */
export function SuccessResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
) {
  res.status(statusCode).json({ success: true, statusCode, message, data });
}

/**
 * Error Response
 * @param statusCode HTTP status code
 * @param message Error message
 * @returns Standardized error response
 */

export function ErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
) {
  res.status(statusCode).json({ success: false, statusCode, message });
}
