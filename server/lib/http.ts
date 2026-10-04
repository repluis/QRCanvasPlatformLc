import type { NextFunction, Request, RequestHandler, Response } from 'express'

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

// Express 4 does not forward rejected promises to the error handler
export function asyncHandler<R extends Request = Request>(
  fn: (req: R, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req as R, res, next).catch(next)
  }
}
