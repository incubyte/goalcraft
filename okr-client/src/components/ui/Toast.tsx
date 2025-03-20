import { toast, ToastOptions } from 'react-toastify';

export default function Toast() {
  const defaultStyle: ToastOptions = {
    position: 'top-center',
    autoClose: 3000,
    className: 'z-40',
  };

  const showToast = (description: string, type: 'error' | 'success') => {
    toast(description, {
      type: type,
      ...defaultStyle,
    });
  };

  const successToast = (description: string) => showToast(description, 'success');
  const failureToast = (description: string) => showToast(description, 'error');

  return { successToast, failureToast };
}
