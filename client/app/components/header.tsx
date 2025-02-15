import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
    return (
        <header className="py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b border-border/40">
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">Expenso</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
                        How It Works
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
                        Pricing
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link href="/enter#login">
                        <Button variant="ghost">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/enter#signup">
                        <Button>
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}

