import { title } from "@/components/primitives";
import Login from "@/components/Login/Login";

export default function LoginPage() {
  return (
    <div>
      <h1 className={title()}>Login</h1>
      <Login />
    </div>
  );
}
