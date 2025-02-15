import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="py-20 px-6">
      <div className="container flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Simplify Your Budget with AI-Powered Insights</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Expenso helps you track expenses, scan receipts, and gain financial clarity with cutting-edge AI technology.
          </p>
          <Button size="lg">Get Started for Free</Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/assets/images/landing1.png"
            alt="Expenso App Interface"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

