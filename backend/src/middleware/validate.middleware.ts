import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import type { ZodType } from 'zod';

export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return _res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };