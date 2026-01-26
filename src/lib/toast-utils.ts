import { toast } from 'sonner';

interface ToastPromiseOptions {
  loading?: string;
  success?: string | ((data: any) => string);
  error?: string | ((error: any) => string);
}

/**
 * A reusable wrapper for async operations that shows loading, success, and error toasts.
 *
 * @param promise The async operation (promise) to wrap.
 * @param options Custom messages for loading, success, and error states.
 * @returns The result of the promise.
 */
export const toastPromise = async <T>(promise: Promise<T>, options: ToastPromiseOptions = {}): Promise<T> => {
  const { loading = 'Processing...', success = 'Operation successful', error = 'An error occurred' } = options;

  toast.promise(promise, {
    loading,
    success: (data) => {
      if (typeof success === 'function') {
        return success(data);
      }
      return success;
    },
    error: (err) => {
      if (typeof error === 'function') {
        return error(err);
      }
      // Handle RTK Query error objects if they exist
      const message = err?.data?.error || err?.data?.message || err?.message || error;
      return message;
    },
  });

  return await promise;
};
