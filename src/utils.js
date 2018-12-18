export const camelCaseToActionType = methodName => {
  const actionType = methodName.replace(/\.?([A-Z]+)/g, (x, y) => "_" + y.toUpperCase()).replace(/^_/, "");
  return actionType.toUpperCase();
};