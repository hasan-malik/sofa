import { useMemo, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  ThumbsUp,
  Users,
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

function formatTime(ts) {
  // super simple display for now
  return ts
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start gap-2"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}

async function createPost(postText) {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
        console.log("Post creation error:", error)
    }

    const user = data.user;

    const { error: insertError } = await supabase.from("posts").insert({
        content: postText,
        user_id: user.id
    })

    if (insertError) {
        console.log("Post insertion error to the Supabase DB:", insertError);
    }
}

function PostCard({ post }) {

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials(post.author)}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="font-semibold">{post.author}</div>
              <div className="text-sm text-muted-foreground">
                {formatTime(post.time)}{" "}
                {post.visibility ? (
                  <span className="text-muted-foreground/70">· {post.visibility}</span>
                ) : null}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Post options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm leading-relaxed">{post.content}</div>

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary">
                #{t}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Fake image placeholder (remove later) */}
        {post.hasImage ? (
          <div className="overflow-hidden rounded-lg border bg-muted">
            <div className="aspect-[16/9] w-full" />
          </div>
        ) : null}

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" className="flex-1 justify-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Like
          </Button>
          <Button variant="ghost" className="flex-1 justify-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1 justify-center gap-2">
            <Users className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FeedPage({ onLogout }) {
  const [composerText, setComposerText] = useState("")

  const posts = useMemo(
    () => [
      {
        id: "1",
        author: "Hasan Malik",
        time: "2m",
        content:
          "Ship small, iterate fast. Got the shadcn + Tailwind setup working and it feels clean.",
        tags: ["react", "ui"],
        hasImage: false,
        visibility: "Public",
      },
      {
        id: "2",
        author: "Avery Chen",
        time: "1h",
        content:
          "If your app feels complicated, it’s usually not a feature problem — it’s a layout problem.",
        tags: ["product"],
        hasImage: true,
        visibility: "Friends",
      },
      {
        id: "3",
        author: "Sam Patel",
        time: "Yesterday",
        content:
          "Campus is wild today. Anyone down to study at the library later?",
        tags: ["campus"],
        hasImage: false,
        visibility: "Public",
      },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              {/* You can swap this icon to match your brand */}
              <Home className="size-4" />
            </div>
            <span className="font-semibold">Sofa</span>
          </div>

          {/* Middle: Search */}
          <div className="hidden w-full max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search posts, people..." />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>HM</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">Hasan</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr_280px]">
        {/* Left sidebar */}
        <aside className="hidden md:block">
          <Card>
            <CardContent className="p-3 space-y-2">
              <NavItem icon={Home} label="Home" active />
              <NavItem icon={Users} label="Friends" />
              <NavItem icon={MessageCircle} label="Messages" />
              <NavItem icon={Settings} label="Settings" />
            </CardContent>
          </Card>
        </aside>

        {/* Center feed */}
        <section className="space-y-4">
          {/* Composer */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>HM</AvatarFallback>
                </Avatar>
                <div className="font-semibold">Create post</div>
              </div>

              <Textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="What’s on your mind?"
                className="min-h-[100px]"
              />

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" type="button">
                  Add image
                </Button>
                <Button
                  type="button"
                  disabled={!composerText.trim()}
                  onClick={() => {
                    setComposerText("");
                    createPost(composerText);
                  }}
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        {/* Right sidebar */}
        <aside className="hidden md:block space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold">Suggested</div>
              <div className="text-sm text-muted-foreground">
                Placeholder for “People you may know”.
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  { name: "Avery Chen", handle: "@averyc" },
                  { name: "Sam Patel", handle: "@samp" },
                  { name: "Jordan Lee", handle: "@jlee" },
                ].map((u) => (
                  <div key={u.handle} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <div className="text-sm font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.handle}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Trends</div>
              <div className="flex flex-wrap gap-2">
                {["react", "supabase", "shadcn", "tailwind"].map((t) => (
                  <Badge key={t} variant="secondary">
                    #{t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}
