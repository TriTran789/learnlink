import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const signInValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const checkFaceValidator = [
  body("image").notEmpty().withMessage("Image is required"),
  validate,
];

export const changePasswordValidator = [
  body("old_password")
    .notEmpty()
    .withMessage("Old password is required"),
  body("new_password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Confirm password does not match new password");
      }
      return true;
    }),
  validate,
]
