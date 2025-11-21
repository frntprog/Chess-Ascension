/**
 * Play Page Component
 * 
 * Placeholder page for Play route.
 * Actual gameplay functionality will be implemented in Epic 3.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"

export function Play() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-[#1e293b]">Play Chess</CardTitle>
            <CardDescription className="text-[#475569]">
              Gameplay functionality coming soon in Epic 3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#64748b]">
              The chess gameplay features will be implemented in Epic 3: Classic Mode Chess Gameplay.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

