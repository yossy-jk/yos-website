// Compatibility endpoint: all website requests now use direct YOS email delivery.
import { enquiryResponse } from '@/lib/enquiry-delivery'
export async function POST(req: Request) { return enquiryResponse(req) }
