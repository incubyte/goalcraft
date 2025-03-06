import { toast } from 'react-toastify';

export default function Toast() {
  const successToast = (description: string) => {
    toast(description, {
      position: 'top-center',
      type: 'success',
      autoClose: 3000,
      className: 'z-40',
    });
  };

  const failureToast = (description: string) => {
    toast(description, {
      position: 'top-center',
      type: 'error',
      autoClose: 3000,
      className: 'z-40',
    });
  };

  return { successToast, failureToast };
}
