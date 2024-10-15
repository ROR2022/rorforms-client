"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
//import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { IoLanguageOutline } from "react-icons/io5";

import WebSocketClient from "./WebSocketClient";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { DataUser, setUser } from "@/redux/userSlice";
import { RootState } from "@/redux/store";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  HackerRankIcon,
  SearchIcon,
  LinkedinIcon,
} from "@/components/icons";

const Navbar = () => {
  const router = useRouter();
  const [menuStatus, setMenuStatus] = useState(false);
  const [languageSelected, setLanguageSelected] = useState("en");
  const [mainSearch, setMainSearch] = useState("");
  const [myNavItems, setMyNavItems] = useState(siteConfig.navItems);
  const user: DataUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [storedDataUser, setStoredDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    user
  );

  const handleMainSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    //eslint-disable-next-line
    //console.log("Searching:...", e.target.value);
    setMainSearch(e.target.value);
  };
  const toggleLanguage = () => {
    //eslint-disable-next-line
    //console.log("Language toggled");
    const newLanguage = languageSelected === "en" ? "es" : "en";

    dispatch(setUser({ ...user, language: newLanguage }));
    setStoredDataUser({ ...storedDataUser, language: newLanguage });
    setLanguageSelected(newLanguage);
  };

  useEffect(() => {
    //console.log("Menu status changed:", menuStatus);
  }, [menuStatus]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Language changed:", user);
    if (user && user.access_token) {
      //eslint-disable-next-line
      //console.log("User changed:", user);
      const tempNavItems = [...siteConfig.navItems];
      const tempNavItemsES = [...siteConfig.navItemsES];

      tempNavItems.push({ label: "Forms", href: "/forms" });
      tempNavItems.push({ label: "Logout", href: "/logout" });
      if (user.roles?.includes("admin")) {
        tempNavItems.push({ label: "Answers", href: "/answers" });
        tempNavItems.push({ label: "Admin", href: "/admin" });
      }
      tempNavItemsES.push({ label: "Formularios", href: "/forms" });
      tempNavItemsES.push({ label: "Cerrar sesión", href: "/logout" });
      if (user.roles?.includes("admin")) {
        tempNavItemsES.push({ label: "Respuestas", href: "/answers" });
        tempNavItemsES.push({ label: "Administrador", href: "/admin" });
      }
      if (languageSelected === "en") {
        setMyNavItems(tempNavItems.filter((item) => item.href !== "/login"));
      } else {
        setMyNavItems(tempNavItemsES.filter((item) => item.href !== "/login"));
      }
    }
  }, [user]);

  //useEffect(() => {}, [languageSelected]);
  useEffect(() => {}, [myNavItems]);
  useEffect(() => {
    //eslint-disable-next-line
    //console.log("Language selected:", languageSelected);
    if (languageSelected === "en") {
      setStoredDataUser({ ...storedDataUser, language: "en" });
      dispatch(setUser({ ...user, language: "en" }));
      if (user.access_token) {
        const tempNavItems = [...siteConfig.navItems];
        const tempNavItemsES = [...siteConfig.navItemsES];

        tempNavItems.push({ label: "Forms", href: "/forms" });
        tempNavItems.push({ label: "Logout", href: "/logout" });
        if (user.roles?.includes("admin")) {
          tempNavItems.push({ label: "Answers", href: "/answers" });
          tempNavItems.push({ label: "Admin", href: "/admin" });
        }
        tempNavItemsES.push({ label: "Formularios", href: "/forms" });
        tempNavItemsES.push({ label: "Cerrar sesión", href: "/logout" });
        if (user.roles?.includes("admin")) {
          tempNavItems.push({ label: "Respuestas", href: "/answers" });
          tempNavItemsES.push({ label: "Administrador", href: "/admin" });
        }
        if (languageSelected === "en") {
          setMyNavItems(tempNavItems.filter((item) => item.href !== "/login"));
        } else {
          setMyNavItems(
            tempNavItemsES.filter((item) => item.href !== "/login")
          );
        }
      }
    } else {
      setStoredDataUser({ ...storedDataUser, language: "es" });
      dispatch(setUser({ ...user, language: "es" }));
      if (user.access_token) {
        const tempNavItems = [...siteConfig.navItems];
        const tempNavItemsES = [...siteConfig.navItemsES];

        tempNavItems.push({ label: "Forms", href: "/forms" });
        tempNavItems.push({ label: "Logout", href: "/logout" });
        if (user.roles?.includes("admin")) {
          tempNavItems.push({ label: "Admin", href: "/admin" });
        }
        tempNavItemsES.push({ label: "Formularios", href: "/forms" });
        tempNavItemsES.push({ label: "Cerrar sesión", href: "/logout" });
        if (user.roles?.includes("admin")) {
          tempNavItemsES.push({ label: "Administrador", href: "/admin" });
        }
        if (languageSelected === "en") {
          setMyNavItems(tempNavItems.filter((item) => item.href !== "/login"));
        } else {
          setMyNavItems(
            tempNavItemsES.filter((item) => item.href !== "/login")
          );
        }
      }
    }
  }, [languageSelected]);

  useEffect(() => {
    //eslint-disable-next-line
    //console.log("storedDataUser:..", storedDataUser);
    if (storedDataUser && storedDataUser.access_token && !user.access_token) {
      dispatch(setUser(storedDataUser));
    }
    if (!storedDataUser.access_token) {
      if (languageSelected === "en") {
        setMyNavItems(siteConfig.navItems);
      } else {
        setMyNavItems(siteConfig.navItemsES);
      }
    }
  }, [storedDataUser]);

  const handleClickSearch = () => {
    //eslint-disable-next-line
    console.log("Search clicked: ", mainSearch);
    router.push(`/main-search?mainSearch=${mainSearch}`);
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder={languageSelected === "en" ? "Search" : "Buscar"}
      startContent={
        <SearchIcon
          className="text-base text-default-400 cursor-pointer flex-shrink-0"
          onClick={handleClickSearch}
        />
      }
      type="search"
      onChange={handleMainSearch}
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      {storedDataUser && storedDataUser.access_token && <WebSocketClient />}

      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              alt="Logo"
              height={30}
              src={user?.imageUrl ? user.imageUrl : "/itransition_logo.jpeg"}
              style={{ borderRadius: "5px", height: "auto" }}
              width={30}
            />
            <p className="font-bold text-inherit">
              {user?.name ? user.name : "iTransition"}
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {myNavItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2 items-center">
          <Link
            isExternal
            aria-label="Linkedin"
            href={siteConfig.links.linkedin}
          >
            <LinkedinIcon className="text-default-500" />
          </Link>
          <Link
            isExternal
            aria-label="HackerRank"
            href={siteConfig.links.hackerRank}
          >
            <HackerRankIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <IoLanguageOutline
            className={
              languageSelected === "es"
                ? "text-indigo-700 cursor-pointer text-xl"
                : "text-pink-400 cursor-pointer text-xl"
            }
            onClick={toggleLanguage}
          />
          <NavbarMenuToggle
            aria-label={menuStatus ? "Close Menu" : "Open Menu"}
            className="lg:hidden"
          />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={
              <Image
                alt="rorLogo"
                height={20}
                src="/rorProfile1.jpg"
                style={{ borderRadius: "50%", height: "auto" }}
                width={20}
              />
            }
            variant="flat"
          >
            {languageSelected === "en" ? "Portfolio" : "Portafolio"}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <IoLanguageOutline
          className={
            languageSelected === "es"
              ? "text-indigo-700 cursor-pointer text-xl"
              : "text-pink-400 cursor-pointer text-xl"
          }
          onClick={toggleLanguage}
        />
        <NavbarMenuToggle
          aria-label={menuStatus ? "Close Menu" : "Open Menu"}
        />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {myNavItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className="w-full"
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                onClick={() => {
                  //console.log("Menu item clicked:", item.label);
                  setMenuStatus(false);
                }}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default Navbar;
