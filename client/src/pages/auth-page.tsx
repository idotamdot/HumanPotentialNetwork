import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration form schema (extend the insertUserSchema)
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      location: "",
      avatar: "https://source.unsplash.com/random/200x200/?portrait",
      availableHours: 5,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword field as it's not in the API schema
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Redirect if logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md border-primary/20 shadow-lg p-0 overflow-hidden">
          <CardHeader className="space-y-1 pt-8 pb-2 px-6 bg-white">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold mb-1">
              <span className="text-primary">Human Potential Network</span>
            </CardTitle>
            <CardDescription className="text-center text-lg text-gray-700">
              Reach Your Full Potential
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      {...loginForm.register("username")}
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm font-medium text-destructive">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm font-medium text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {loginMutation.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {loginMutation.error.message || "Login failed. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {loginMutation.isSuccess && (
                    <Alert variant="default" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Login successful! Redirecting...
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>

                  <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => setActiveTab("register")}
                    >
                      Register
                    </button>
                  </p>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      {...registerForm.register("name")}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm font-medium text-destructive">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      {...registerForm.register("username")}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm font-medium text-destructive">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        {...registerForm.register("password")}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm font-medium text-destructive">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        {...registerForm.register("confirmPassword")}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm font-medium text-destructive">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-location">Location (optional)</Label>
                    <Input
                      id="register-location"
                      type="text"
                      {...registerForm.register("location")}
                    />
                  </div>

                  {registerMutation.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {registerMutation.error.message || "Registration failed. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {registerMutation.isSuccess && (
                    <Alert variant="default" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Registration successful! Redirecting...
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => setActiveTab("login")}
                    >
                      Login
                    </button>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-6 pt-0 bg-white">
            <div className="text-center text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Hero Side */}
      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mb-6">
            The Human Potential Network
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Connect with like-minded individuals around the world to collaborate on meaningful projects and unlock your full potential.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">AI-Powered Collaboration</h3>
                <p className="text-gray-600">Our matching algorithm connects you with the perfect collaborators.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Global Impact</h3>
                <p className="text-gray-600">Join projects addressing the world's most pressing challenges.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Knowledge Sharing</h3>
                <p className="text-gray-600">Access our collective knowledge commons and grow your skills.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}