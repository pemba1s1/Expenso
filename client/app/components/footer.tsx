import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-8 px-6 bg-background border-t">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-sm text-muted-foreground">© 2023 Expenso. All rights reserved.</span>
        </div>
        <nav className="flex space-x-4">
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  )
}

