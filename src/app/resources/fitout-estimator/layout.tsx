import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Office Fitout Cost Estimator | Your Office Space',
  description: 'Estimate your commercial office fitout cost instantly. Enter your area and fitout level — get a realistic budget range in seconds.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
