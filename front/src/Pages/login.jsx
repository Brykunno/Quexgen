import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";
import { SplineScene } from "@/components/ui/splite";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 ">
  {/* <div className="absolute inset-0 flex items-center justify-center -z-10 -translate-y-80"> */}
  <div className="absolute inset-0 flex items-center justify-center -z-10 ">
    <h1 className="text-[20vw] font-bold text-gray-200 opacity-20">Quexgen</h1>
  </div>

      <div className="w-full h-[100vh] flex justify-between">
        {/* Left side - Login Form */}
        <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <LoginForm route="/api/token/" method="login" />
          </div>

        </div>

        {/* Right side - Spline Scene */}
        <div className=" hidden flex-1 flex justify-end md:block">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-[100vh] w-[100vh] "
          />
        </div>
      </div>
    </div>
  );
}