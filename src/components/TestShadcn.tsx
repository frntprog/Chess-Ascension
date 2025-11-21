import { Button } from "@/components/UI/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog"
import { Input } from "@/components/UI/input"
import { Label } from "@/components/UI/label"
import { Badge } from "@/components/UI/badge"
import { Separator } from "@/components/UI/separator"
import { useProfileStore } from "@/stores/profileStore"
import { Link } from "react-router-dom"
import { profileExists } from "@/services/profileStorage"

export function TestShadcn() {
  const nickname = useProfileStore((state) => state.nickname)
  const level = useProfileStore((state) => state.level)
  const rank = useProfileStore((state) => state.rank)
  const hasProfile = nickname && profileExists()

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Conditional Profile State Display (AC1) */}
      {hasProfile ? (
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle>Welcome back, {nickname}!</CardTitle>
            <CardDescription>
              Level {level} • {rank}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-accent/5 border-accent">
          <CardHeader>
            <CardTitle>Welcome to Chess Ascension</CardTitle>
            <CardDescription>
              Create a profile to start playing and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create-profile">
              <Button>Create Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <h1 className="text-3xl font-bold">shadcn/ui Component Test</h1>
      
      {/* Button Components */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Testing button variants with Classic Chess theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Card Component */}
      <Card>
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
          <CardDescription>Card with Classic Chess theme styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card demonstrates the Classic Chess theme colors applied to shadcn/ui components.</p>
        </CardContent>
      </Card>

      {/* Dialog Component */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog Component</CardTitle>
          <CardDescription>Modal dialog with Classic Chess theme</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog component with Classic Chess theme colors.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Input and Label Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>Input and Label with Classic Chess theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-input">Test Input</Label>
            <Input id="test-input" placeholder="Enter text here" />
          </div>
        </CardContent>
      </Card>

      {/* Badge Component */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Component</CardTitle>
          <CardDescription>Badges with Classic Chess theme colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge>Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Separator Component */}
      <Card>
        <CardHeader>
          <CardTitle>Separator Component</CardTitle>
          <CardDescription>Section divider with Classic Chess theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Content above separator</p>
          <Separator />
          <p>Content below separator</p>
        </CardContent>
      </Card>

      {/* Theme Color Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Color Verification</CardTitle>
          <CardDescription>Verifying Classic Chess theme colors are applied</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded">
              Primary: #1e293b (Slate 800)
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded">
              Secondary: #475569 (Slate 600)
            </div>
            <div className="p-4 bg-accent text-accent-foreground rounded">
              Accent: #f59e0b (Amber 500)
            </div>
            <div className="p-4 bg-success text-success-foreground rounded">
              Success: #10b981 (Green 500)
            </div>
            <div className="p-4 bg-destructive text-destructive-foreground rounded">
              Error: #ef4444 (Red 500)
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded">
              Muted: #f8fafc (Slate 50)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

