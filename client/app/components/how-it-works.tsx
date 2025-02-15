import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HowItWorks() {
  const steps = [
    {
      title: "Scan Your Receipt",
      description: "Use your phone's camera to quickly capture receipt details.",
    },
    {
      title: "AI Processes the Data",
      description: "Our advanced AI extracts and categorizes the information automatically.",
    },
    {
      title: "Review and Confirm",
      description: "Verify the extracted data and make any necessary adjustments.",
    },
    {
      title: "Sync with Your Budget",
      description: "The expense is added to your budget tracker, keeping everything up to date.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">How Expenso Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mr-4">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button className="mt-8" size="lg">
              Try It Now
            </Button>
          </div>
          <div className="relative h-[400px]">
            <Image src="/assets/images/scanning.png" alt="Expenso App Demo" fill className="object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}

