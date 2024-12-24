"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useActionState } from "react";
import { login } from "../actions/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    message: "",
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-left">Login</CardTitle>
        <CardDescription>
          Login to continue tracking your receipts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            {state.errors?.email && (
              <p className="text-sm text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
            />
            {state.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            Login
          </Button>
        </form>
      </CardContent>
      {/* <CardFooter className="flex flex-col space-y-4 pt-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signUpWithGoogle()}
        >
          Google
        </Button>
      </CardFooter> */}
    </Card>
  );
}
