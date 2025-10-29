export function extractApiErrorMessage(error: unknown): string {
  // Axios-like error shape support plus fallbacks
  const anyErr = error as any;
  const messageFromResponse = anyErr?.response?.data?.message || anyErr?.response?.data?.error;
  const messageFromDataString = typeof anyErr?.response?.data === 'string' ? anyErr.response.data : undefined;
  const message = messageFromResponse || messageFromDataString || anyErr?.message;
  return message || 'An unexpected error occurred';
}


