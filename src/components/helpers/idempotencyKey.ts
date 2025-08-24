export function generateIdempotencyKey(ticketId: string, quantity: number): string {
    // Use timestamp + random string for uniqueness
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now().toString(36);
  
    return `txn-${ticketId.substring(0, 8)}-${quantity}-${timestamp}-${randomPart}`;
  }