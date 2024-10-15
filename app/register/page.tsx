import { title } from "@/components/primitives";
import Register from "@/components/Register/Register";

export default function RegisterPage() {
  return (
    <div>
      <h1 className={title()}>Register</h1>
      <Register />
    </div>
  );
}
