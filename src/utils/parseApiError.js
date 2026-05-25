export const parseApiError = (error) => {
  if (!error?.response) {
    const isNetwork =
      error?.code === 'ERR_NETWORK' ||
      error?.message?.includes('Network Error') ||
      error?.message?.includes('ECONNREFUSED');
    return {
      message: isNetwork
        ? 'Cannot reach the API. Start the backend with: npm run dev:api'
        : error?.message || 'Something went wrong',
      errors: [],
      fieldErrors: {},
      status: 0,
    };
  }

  const data = error.response.data;
  const message = data?.message || error?.message || 'Something went wrong';
  const errors = Array.isArray(data?.errors) ? data.errors : [];
  const fieldErrors = errors.reduce((acc, item) => {
    if (item?.field) acc[item.field] = item.message;
    return acc;
  }, {});

  return {
    message,
    errors,
    fieldErrors,
    status: error?.response?.status,
  };
};
