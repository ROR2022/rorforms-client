export type SiteConfig = typeof siteConfig;

const basicNavItems = [
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Login",
    href: "/login",
  },
];
const basicWitoutLogin = basicNavItems.filter((item) => item.label !== "Login");
const basicLogged = [
  ...basicWitoutLogin,
  { label: "Forms", href: "/forms" },
  { label: "Answers", href: "/answers" },
  { label: "Logout", href: "/logout" },
  { label: "SF", href: "/salesforce" },
];
const basicAdmin = [...basicLogged, { label: "Admin", href: "/admin" }];

const basicNavItemsES = [
  {
    label: "Contacto",
    href: "/contact",
  },
  {
    label: "Acerca",
    href: "/about",
  },
  {
    label: "Iniciar",
    href: "/login",
  },
];
const basicWitoutLoginES = basicNavItemsES.filter(
  (item) => item.label !== "Iniciar"
);
const basicLoggedES = [
  ...basicWitoutLoginES,
  { label: "Formularios", href: "/forms" },
  { label: "Respuestas", href: "/answers" },
  { label: "Salir", href: "/logout" },
  { label: "SF", href: "/salesforce" },
];
const basicAdminES = [
  ...basicLoggedES,
  { label: "Administrador", href: "/admin" },
];

//tempNavItems.push({ label: "Forms", href: "/forms" });
//      tempNavItems.push({ label: "Logout", href: "/logout" });

export const siteConfig = {
  name: "iTransition-Project_ROR2022",
  description: "iTransition Project Internship Ramiro Ocampo",
  navItems: [...basicNavItems],
  navItemsLogged: [...basicLogged],
  navItemsAdmin: [...basicAdmin],
  navItemsES: [...basicNavItemsES],
  navItemsLoggedES: [...basicLoggedES],
  navItemsAdminES: [...basicAdminES],
  links: {
    github: "https://github.com/ROR2022",
    linkedin: "https://www.linkedin.com/in/ramiro-ocampo-5a661b1a7/",
    hackerRank: "https://www.hackerrank.com/profile/rami_ror279",
    docs: "https://nextui.org",
    sponsor: "https://ror-portfolio.vercel.app/",
  },
};
