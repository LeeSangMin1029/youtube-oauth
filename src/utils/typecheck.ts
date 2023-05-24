export const isEmptyObject = (param: any) =>
  Object.keys(param).length === 0 && param.constructor === Object;
