import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Home, User } from "lucide-react";

import { useNavigate } from "react-router-dom";

function initials(name) {
    return (name || "User")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
}

export default function ProfilePage({ onLogout }) {
    const n = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [user, setUser] = useState(null); // auth user
    const [profile, setProfile] = useState(null); // row from public.profiles
    const [bioDraft, setBioDraft] = useState("");

    const displayName = useMemo(() => {
        if (!user) return "User";
        return (
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")?.[0] ||
            "User"
        );
    }, [user]);

    const handle = useMemo(() => {
        if (!user?.email) return "@user";
        return `@${user.email.split("@")[0]}`;
    }, [user]);

    useEffect(() => {
        async function load() {
            setLoading(true);

            const { data: authData, error: authErr } =
                await supabase.auth.getUser();
            if (authErr) console.log("getUser error:", authErr);

            const authUser = authData?.user ?? null;
            setUser(authUser);

            if (!authUser) {
                setProfile(null);
                setBioDraft("");
                setLoading(false);
                return;
            }

            const { data: profData, error: profErr } = await supabase
                .from("profiles")
                .select("id, bio, created_at")
                .eq("id", authUser.id)
                .single();

            if (profErr) {
                console.log("profile fetch error:", profErr);
                setProfile(null);
                setBioDraft("");
            } else {
                setProfile(profData);
                setBioDraft(profData?.bio ?? "");
            }

            setLoading(false);
        }

        load();
    }, []);

    async function saveBio() {
        if (!user) return;
        setSaving(true);

        const { error } = await supabase
            .from("profiles")
            .update({ bio: bioDraft })
            .eq("id", user.id);

        if (error) console.log("bio update error:", error);

        // optimistic refresh of local profile state
        setProfile((p) => (p ? { ...p, bio: bioDraft } : p));
        setSaving(false);
    }

    // Tiny, clean placeholders — later you’ll compute these for real
    const counts = { posts: 0, followers: 0, following: 0 };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Top bar */}
            <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
                <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <User className="size-4" />
                        </div>
                        <span className="font-semibold">Profile</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Home"
                            onClick={() => {n("/");}}
                        >
                            <Home className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={onLogout}>
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
                {/* Profile header */}
                <Card>
                    <CardContent className="p-5">
                        {loading ? (
                            <div className="text-sm text-muted-foreground">
                                Loading...
                            </div>
                        ) : !user ? (
                            <div className="text-sm text-muted-foreground">
                                You’re not logged in.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback>
                                            {initials(displayName)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="leading-tight">
                                        <div className="text-lg font-semibold">
                                            {displayName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {handle}
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <Badge variant="secondary">
                                                Public
                                            </Badge>
                                            <Badge variant="outline">
                                                Sofa
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <div className="font-semibold">
                                            {counts.posts}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            posts
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">
                                            {counts.followers}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            followers
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">
                                            {counts.following}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            following
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bio */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="font-semibold">Bio</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {!user ? (
                            <div className="text-sm text-muted-foreground">
                                Log in to edit your bio.
                            </div>
                        ) : (
                            <>
                                <Textarea
                                    value={bioDraft}
                                    onChange={(e) =>
                                        setBioDraft(e.target.value)
                                    }
                                    placeholder="Write a short bio..."
                                    className="min-h-[90px]"
                                />

                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-xs text-muted-foreground">
                                        Saved bio:{" "}
                                        <span className="text-muted-foreground/80">
                                            {profile?.bio ?? ""}
                                        </span>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={saveBio}
                                        disabled={
                                            saving ||
                                            bioDraft === (profile?.bio ?? "")
                                        }
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* My posts (placeholder layout) */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="font-semibold">My posts</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                            Placeholder. Next we’ll load your posts from
                            Supabase and render them here.
                        </div>

                        <Separator />

                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-md border bg-muted"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
