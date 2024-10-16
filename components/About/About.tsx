"use client";
import { useLocalStorage } from "usehooks-ts";
import React, { useEffect } from "react";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";
import { title } from "@/components/primitives";

const textEN = `I am Ramiro, a passionate Full-Stack Developer with a knack for
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
          extraordinary.`;

const textES = ` Soy Ramiro, un apasionado desarrollador Full-Stack con talento para
          transformar requisitos complejos en experiencias digitales fluidas. En
            MarSystems, lideré la actualización de una aplicación web Angular de
            la versión 7 a la 17 para La Comer, garantizando una experiencia de
            usuario más fluida y eficiente. Mi trabajo en el proyecto de Miniso
            México, donde desarrollé una aplicación web React.js y Node.js,
            redujo significativamente el tiempo de registro de usuario de 30
            minutos a solo 1 minuto, demostrando mi capacidad para mejorar la
            interfaz de usuario y optimizar procesos. En mi rol en Kodemia,
            creé una aplicación web de búsqueda de empleo utilizando el stack
            MERN, emparejando eficientemente vacantes con solicitantes y
            demostrando mi competencia en desarrollo Full-Stack. Mis proyectos
            freelance, incluyendo una PWA para Dental Las Palmas, resaltan mi
            versatilidad y compromiso con la entrega de soluciones de alta
            calidad. Prospero en entornos remotos y colaborativos y estoy
            ansioso por contribuir a proyectos innovadores y de alto impacto.
            Conéctate conmigo y creemos algo extraordinario.`;

const About = () => {
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState
  );
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("en");

  useEffect(() => {
    if (storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser.language]);

  return (
    <div>
      <h1 className={title()}>
        {selectedLanguage === "en" ? "About" : "Acerca"}
      </h1>
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
        {selectedLanguage === "en" ? textEN : textES}
      </p>
    </div>
  );
};

export default About;
