import { LoginForm } from "@/components/login-form";
import { SplineScene } from "@/components/ui/splite";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 ">
      <div className="w-full h-[100vh] flex justify-between">
        {/* Left side - Login Form */}
        <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm z-10">
          <LoginForm route="/api/token/" method="login" />
          </div>
         
        </div>

        {/* Right side - Spline Scene */}
        <div className=" hidden flex-1 flex justify-end md:block ">
        
        </div>

  
      </div>
      <div > 

<SplineScene 
    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
    className="h-[100vh] absolute right-0 top-0 w-full bottom-0  "
  />
</div>
    </div>
  );
}