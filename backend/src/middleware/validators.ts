import { Request, Response, NextFunction } from "express";

export function requireJson(req: Request, res: Response, next: NextFunction) {
  // Express json() already parses; this just prevents empty objects for POST/PUT in common cases.
  if ((req.method === "POST" || req.method === "PUT" || req.method === "PATCH") && req.headers["content-type"]?.includes("application/json")) {
    if (req.body == null) {
      return res.status(400).json({ message: "Request body is required" });
    }
  }
  return next();
}

export function validateNumericParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const val = (req.params as any)[paramName];
    if (!val || !/^\d+$/.test(String(val))) {
      return res.status(400).json({ message: `Invalid ${paramName}` });
    }
    next();
  };
}

export function validateTransactionBody(req: Request, res: Response, next: NextFunction) {
  const { title, amount, category, user_id } = req.body ?? {};

  if (typeof title !== "string" || title.trim().length < 1) {
    return res.status(400).json({ message: "Title is required" });
  }
  const numAmount = Number(amount);
  if (!Number.isFinite(numAmount)) {
    return res.status(400).json({ message: "Amount must be a number" });
  }
  if (typeof category !== "string" || category.trim().length < 1) {
    return res.status(400).json({ message: "Category is required" });
  }
  if (!user_id || !/^\d+$/.test(String(user_id))) {
    return res.status(400).json({ message: "Valid user_id is required" });
  }

  // Normalize
  (req.body as any).title = title.trim();
  (req.body as any).category = category.trim();
  (req.body as any).amount = numAmount;

  next();
}

export function validateProfileUpdateBody(req: Request, res: Response, next: NextFunction) {
  const { name, profile_photo, theme } = req.body ?? {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 1) {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }
    (req.body as any).name = name.trim();
  }

  if (profile_photo !== undefined) {
    if (typeof profile_photo !== "string" || profile_photo.trim().length < 1) {
      return res.status(400).json({ message: "profile_photo must be a non-empty string" });
    }
    (req.body as any).profile_photo = profile_photo.trim();
  }

  if (theme !== undefined) {
    if (theme !== "dark" && theme !== "light") {
      return res.status(400).json({ message: "theme must be either 'dark' or 'light'" });
    }
  }

  if (name === undefined && profile_photo === undefined && theme === undefined) {
    return res.status(400).json({ message: "At least one field (name, profile_photo, theme) is required" });
  }

  next();
}
