import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, PieChart, Zap, Smartphone } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Receipt className="h-8 w-8 mb-4 text-primary" />,
      title: "AI-Powered Receipt Scanning",
      description: "Instantly capture and categorize expenses with our advanced OCR and AI technology.",
    },
    {
      icon: <PieChart className="h-8 w-8 mb-4 text-primary" />,
      title: "Comprehensive Budget Tracking",
      description: "Get a clear overview of your spending habits with intuitive charts and reports.",
    },
    {
      icon: <Zap className="h-8 w-8 mb-4 text-primary" />,
      title: "Smart Insights",
      description: "Receive personalized financial advice and spending recommendations powered by AI.",
    },
    {
      icon: <Smartphone className="h-8 w-8 mb-4 text-primary" />,
      title: "Cross-Platform Sync",
      description: "Access your budget data seamlessly across all your devices.",
    },
  ]

  return (
    <section id="features" className="py-20 px-6 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features to Manage Your Finances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

