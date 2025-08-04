import { apiCall } from "../utils/axiosFormat";

const getEvents=async ({q}:any,{state}:any,{page}:any,{per_page}:any,{fromDate}:any,{toDate}:any): Promise<any> =>{
    const response = await apiCall({
      name: "getEvents",
      alert: false,
      params: {q, state, page, per_page, fromDate,toDate},
    });
    return response;
  }
  

export {getEvents}