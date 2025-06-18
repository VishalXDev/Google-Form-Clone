export const isEmail = (str) => /\S+@\S+\.\S+/.test(str);

export const isRequired = (str) => str && str.trim().length > 0;
