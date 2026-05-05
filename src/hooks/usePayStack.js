const usePaystack = () => {
  const initializePayment = ({
    email,
    amount, // pass in NAIRA
    reference,
    metadata = {},
    onSuccess,
    onClose,
  }) => {
    if (!window.PaystackPop) {
      console.error("Paystack script not loaded");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100,
      ref: reference,
      metadata,
      callback: (response) => {
        onSuccess?.(response.reference);
      },
      onClose: () => {
        onClose?.();
      },
    });

    handler.openIframe();
  };

  return { initializePayment };
};

export default usePaystack;