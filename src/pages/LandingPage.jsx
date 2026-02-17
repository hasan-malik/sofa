import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Shield, Sparkles, Users } from "lucide-react"
import { SignupForm } from "@/components/signup-form"


// reusable Feature component:
const Feature = ({icon, title, desc}) => {
    const Icon = icon;

    return (
        <div className="flex gap-3 rounded-xl border bg-card p-4">
            <div className="mt-0.5 inline-flex h-10 w-10 
            justify-center items-center
            rounded-lg border bg-background">
                <Icon className='h-5 w-5'></Icon>
            </div>

            <div>
                <div className="font-semibold leading-tight">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
        </div>
    )
}

export default function LandingPage() {
  return (
    <>
        <SignupForm></SignupForm>

    </>
  )
}
