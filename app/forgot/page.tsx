import { subtitle } from "@/components/primitives";
import Forgot from "@/components/Forgot/Forgot";

export default function ForgotPage() {
  return (
    <div>
      <h1 className={subtitle()}>Forgot Password</h1>
      <Forgot />
    </div>
  );
}
