import { z } from "zod";

const createDynamicSchema = (fields) => {
  const shape = fields.reduce((acc, field) => {
    if (field.required) {
      switch (field.type) {
        case "text":
        case "email":
          acc[field.name] = z.string().min(1, `${field.label} is required.`);
          if (field.validation?.regex) {
            acc[field.name] = acc[field.name].regex(
              new RegExp(field.validation.regex),
              field.validation.errorMessage || "Invalid input.",
            );
          }
          break;
        case "number":
          acc[field.name] = z
            .string()
            .transform((value) => (value ? parseFloat(value) : undefined))
            .refine(
              (value) => !isNaN(value),
              `${field.label} must be a valid number.`,
            )
            .refine(
              (value) => value >= (field.validation?.min || -Infinity),
              field.validation?.errorMessage || `${field.label} is too low.`,
            )
            .refine(
              (value) => value <= (field.validation?.max || Infinity),
              field.validation?.errorMessage || `${field.label} is too high.`,
            );
          break;

        case "checkbox":
          acc[field.name] = z.boolean().optional();
          break;
        default:
          acc[field.name] = z.any();
      }
    } else {
      acc[field.name] = z.any();
    }
    return acc;
  }, {});

  return z.object(shape);
};

export default createDynamicSchema;
