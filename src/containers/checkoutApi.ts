import { apiCall } from "../utils/axiosFormat";

const initiateCheckout = async (ticketId: string,quantity:any,idempotencyKey:string): Promise<any> => {
    const response = await apiCall({
      name: 'initiateCheckout',
      data: { ticketId,quantity,idempotencyKey},
    });
    return response;
  };

  const checkoutStatus = async (checkoutId: string): Promise<any> => {
    const response = await apiCall({
      name: 'checkoutStatus',
      urlExtra: `/${checkoutId}`,
      alert: false,
    });
    return response;
  }
  const cancelCheckout = async (transactionId:string,reason:string,holdToken:string): Promise<any> => {
    const response = await apiCall({
      name: 'cancelCheckout',
      data: { transactionId,reason,holdToken },
      alert: false,
    });
    return response;
  }
export { initiateCheckout, checkoutStatus,cancelCheckout };