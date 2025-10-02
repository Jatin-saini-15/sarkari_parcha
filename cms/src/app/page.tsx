import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the dashboard page
  redirect('/dashboard/mock-tests')
  
  // This won't be rendered, but is needed to make this a valid React component
  return null
}
