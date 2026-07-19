export const getCopyrightYear = (startYear = 2026) => {
  const currentYear = new Date().getFullYear();
  return currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;
};

export const getAppVersion = () => {
  return __APP_VERSION__;
};
