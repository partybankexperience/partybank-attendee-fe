import { apiCall } from "../utils/axiosFormat";

const getEvents = async (
  q: string,
  state: string,
  page: number,
  per_page: number,
  fromDate?: string,
  toDate?: string
): Promise<any> => {
  const params: Record<string, string | number> = {
    // always send valid numbers
    page: Math.max(1, Number.isFinite(page) ? page : 1),
    per_page: Math.max(1, Number.isFinite(per_page) ? per_page : 12),
  };

  // only include q/state if non-empty after trim
  const qv = (q ?? "").trim();
  if (qv) params.q = qv;

  const sv = (state ?? "").trim();
  if (sv) params.state = sv;

  // only include dates if present (YYYY-MM-DD)
  if (fromDate?.trim()) params.fromDate = fromDate.trim();
  if (toDate?.trim()) params.toDate = toDate.trim();

  return apiCall({
    name: "getEvents",
    alert: false,
    params,
  });
};
  
const getEventBySlug=async (slug:string): Promise<any> => {
    const response = await apiCall({
      name: 'getEventBySlug',
      urlExtra: `/${slug}`,
      alert: false,
      params: { viewer:'attendee' },
    });
    return response;
  };
const checkticketAvailability=async (ticketId:string,quantity:any): Promise<any> => {
    const response = await apiCall({
      name: 'checkTicketAvailability',
      urlExtra: `/${ticketId}/check-availability`,
      data: {quantity },
      alert: false,
    });
    return response;
  };
export {getEvents,getEventBySlug,checkticketAvailability}