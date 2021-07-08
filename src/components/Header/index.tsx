import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

import { ActiveLink } from "../ActiveLink";

export function Header() {
  const { asPath } = useRouter();

  console.log(asPath);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
