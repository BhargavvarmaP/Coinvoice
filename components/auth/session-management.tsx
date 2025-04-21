"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { useState } from "react"

interface Session {
  id: string
  expires: string
  userAgent: string
  ip: string
  current: boolean
}

export function SessionManagement() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSessions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/sessions")
      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      toast.error("Failed to fetch sessions")
    } finally {
      setIsLoading(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to revoke session")
      }
      setSessions(sessions.filter((s) => s.id !== sessionId))
      toast.success("Session revoked")
    } catch (error) {
      toast.error("Failed to revoke session")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={fetchSessions} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh Sessions"}
          </Button>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{session.userAgent}</p>
                <p className="text-sm text-muted-foreground">
                  {session.ip} • Last active{" "}
                  {formatDistanceToNow(new Date(session.expires), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {!session.current && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => revokeSession(session.id)}
                  disabled={isLoading}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 