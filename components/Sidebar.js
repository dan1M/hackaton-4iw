import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMessage } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import { AppContext } from "@/pages/_app";
import { useContext } from "react";
import { useEffect } from "react";

const Sidebar = () => {
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false);

  const { currentUser } = useContext(AppContext);
  console.log(currentUser);
  const handleSocialMenuClick = () => {
    setIsSocialMenuOpen(prevIsOpen => !prevIsOpen);
  };

  useEffect(() => {
    console.log(currentUser);
  }, []);
  const styles = {
    li: {
      textAlign: "center",
      color: "white",
      cursor: "pointer",
    },
    sidebar: {
      width: "17%",
      position: "sticky",
    },
    side: {
      border: "1px solid black",
      height: "100vh",
      width: "80%",
      marginTop: "4%",
      borderRadius: "8px",
      position: "sticky",
      boxShadow: "10px 5px 5px black",
    },
    logo: {
      backgroundColor: "#1E1E1E",
      borderRadius: "8px",
    },
    icon: {
      color: "white",
      display: "flex",
    },
    io: {
      color: "white",
      marginRight: "10%",
      fontSize: "28px",
    },
  };
  return (
    <nav className="sticky w-1/5">
      <div style={styles.side}>
        <div className="space-y-8" style={styles.logo}>
          <div className="h-20 flex items-center">
            <Image alt="logo" src="/logo.png" width={270} height={270} />
          </div>
        </div>
        <ul className="flex flex-col space-y-2">
          <li
            className={`flex items-center space-x-2 li-side  social${
              isSocialMenuOpen ? "bg-gray-700" : ""
            }`}
            onClick={handleSocialMenuClick}
          >
            <Image
              alt="logo"
              src="/pictos/people-white.png"
              width={20}
              height={20}
              className="mx-4"
            />
            Social
          </li>
          {isSocialMenuOpen && (
            <>
              <li
                className="flex items-center justify-center space-x-2 hover:bg-gradient-to-br from-secondary to-carbon-blue group-hover:from-secondary group-hover:carbon-blue"
                style={styles.li}
              >
                <Link href="/social/chat" style={styles.icon}>
                  <AiOutlineMessage style={styles.io} />
                  Chat
                </Link>
              </li>
              <li
                className="flex items-center justify-center space-x-2 text-white text-l hover:bg-gradient-to-br from-secondary to-carbon-blue group-hover:from-secondary group-hover:carbon-blue"
                style={styles.li}
              >
                <Link href="/social/events" style={styles.icon}>
                  <BiCalendar style={styles.io} className="w-10" />
                  Evènements
                </Link>
              </li>
              <li
                className="flex items-center justify-center space-x-2 text-white text-l hover:bg-gradient-to-br from-secondary to-carbon-blue group-hover:from-secondary group-hover:carbon-blue"
                style={styles.li}
              >
                <Image
                  src="/pictos/quete.png"
                  style={styles.icon}
                  className="hover:bg-gradient-to-br from-secondary to-carbon-blue group-hover:from-secondary group-hover:carbon-blue"
                  width={35}
                  height={20}
                />
                <Link href="/social/quests" style={styles.icon}>
                  Quètes
                </Link>
              </li>
            </>
          )}
          <li className="flex items-center space-x-2 li-side">
            <Image
              alt="logo"
              src="/pictos/client.png"
              width={20}
              height={20}
              className="mx-4"
            />
            <Link href="/clients">Clients</Link>
          </li>
          <li className="flex items-center space-x-2 li-side">
            <Image
              alt="logo"
              src="/pictos/formation.png"
              width={20}
              height={20}
              className="mx-4"
            />
            <Link href="/formations">Formations</Link>
          </li>
          <li className="flex items-center space-x-2 li-side">
            <Image
              alt="logo"
              src="/pictos/collaborateurs.png"
              width={20}
              height={20}
              className="mx-4"
            />
            <Link href="/users">Collaborateurs</Link>
          </li>
          <li className="flex items-center space-x-2 li-side">
            <Image
              alt="logo"
              src="/pictos/myAccount.png"
              width={20}
              height={20}
              className="mx-4"
            />
            {currentUser && currentUser.id && (
              <Link href={`/users/${currentUser.id}`}>Mon compte</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
