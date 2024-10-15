import { title } from "@/components/primitives";
import Contact from "@/components/Contact/Contact";

export default function ContactPage() {
  return (
    <div>
      <h1 className={title()}>Contact</h1>
      <Contact />
    </div>
  );
}
