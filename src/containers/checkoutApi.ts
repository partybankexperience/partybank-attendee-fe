import { apiCall } from "../utils/axiosFormat";

const initiateCheckout = async (reservationId: any,idempotencyKey:string): Promise<any> => {
    const response = await apiCall({
      name: 'initiateCheckout',
      data: { reservationId,idempotencyKey},
      alert:true
    });
    return response;
  };

  const checkoutStatus = async (reservationId: any,holdToken:any): Promise<any> => {
    const response = await apiCall({
      name: 'checkoutStatus',
      urlExtra: `/${reservationId}/status`,
      params: { holdToken },
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
  const getReservation = async (reservationId: string,holdToken:any): Promise<any> => {
    const response = await apiCall({
      name: 'getReservation',   
      urlExtra: `/${reservationId}`,
      params: { holdToken },
      alert: false,
    });
    return response;
  }
  const createReservation = async (eventId:any,ticketId:any,quantity:any,idempotencyKey:any,identity:any): Promise<any> => {
    const response = await apiCall({
      name: 'createReservation',   
      data: { eventId,ticketId,quantity,ttlMinutes:30 ,idempotencyKey,identity },
      alert: false,
    });
    return response;
  }
  const cancelReservation = async (reservationId:any,holdToken:any,): Promise<any> => {
    const response = await apiCall({
      name: 'cancelReservation',   
      urlExtra: `/${reservationId}`,
      data: { holdToken },
      alert: false,
    });
    return response;
  }
export { initiateCheckout, checkoutStatus,cancelCheckout,createReservation, getReservation,cancelReservation };