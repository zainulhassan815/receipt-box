import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignupForm } from "../components/signup-form";
import { LoginForm } from "../components/login-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
