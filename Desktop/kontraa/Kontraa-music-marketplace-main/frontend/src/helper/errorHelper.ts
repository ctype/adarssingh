export const convertGenericErrorToValidationError = (error: GraphqlErrorObj, dubFieldName?: string) => {
  const validationErrors: { [key: string]: string } = {};

  if (error.message === "Validation error" || error.message.startsWith("duplicate")) {
    if (error.details) {
      Object.assign(validationErrors, ...error.details.map(d => ({ [d.field]: d.messages })))
    } else {
      if (dubFieldName) {
        validationErrors[dubFieldName] = "Resource with same value already exists";
      }
    }
  }

  return validationErrors;
}
