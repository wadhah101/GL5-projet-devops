import Joi = require('joi');
interface ValidateOptions {
  preferProcess?: boolean;
}
export function validate<T>(
  schema: Joi.ObjectSchema<T>,
  options?: ValidateOptions,
  source?: Record<string, any>
): T {
  const parsed = Object.keys(schema.describe().keys).reduce((values, key) => {
    return {
      ...values,
      [key]: options?.preferProcess
        ? process.env[key] || source?.[key]
        : source?.[key] || process.env[key],
    };
  }, {} as Record<string, any>);

  const { error, value } = schema.validate(parsed);
  if (error) throw new Error(error.message);

  return value;
}
