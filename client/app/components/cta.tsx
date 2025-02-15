import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of users who have simplified their budgeting process with Expenso&apos;s AI-powered tools.
        </p>
        <Button size="lg" variant="secondary">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  )
}

