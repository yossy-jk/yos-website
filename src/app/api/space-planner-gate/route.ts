import { enquiryResponse } from '@/lib/enquiry-delivery'
export async function POST(req: Request) {
  return enquiryResponse(req, 'Space Planner — session started')
}
