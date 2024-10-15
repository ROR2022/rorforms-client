import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
      <div>
        <p
          style={{
            maxWidth: "600px",
            fontSize: "1.2rem",
            lineHeight: "1.5",
            marginTop: "50px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "justify",
          }}
        >
          I am Ramiro, a passionate Full-Stack Developer with a knack for
          transforming complex requirements into seamless digital experiences.
          At MarSystems, I spearheaded an Angular web application upgrade from
          version 7 to 17 for La Comer, ensuring a smoother and more efficient
          user experience. My work on the Miniso Mexico project, where I
          developed a React.js and Node.js web app, significantly reduced user
          registration time from 30 minutes to just 1 minute, showcasing my
          ability to enhance UI/UX and streamline processes. In my role at
          Kodemia, I created a job search web app using the MERN stack,
          efficiently matching vacancies with applicants, and demonstrating my
          proficiency in full-stack development. My freelance projects,
          including a PWA for Dental Las Palmas, highlight my versatility and
          commitment to delivering high-quality solutions. I thrive in remote,
          collaborative environments and am eager to contribute to innovative,
          high-impact projects. Let&apos;s connect and create something
          extraordinary.
        </p>
      </div>
    </div>
  );
}
