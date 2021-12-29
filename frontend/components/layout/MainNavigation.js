import Link from "next/link";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        TixLabLogo
        {/* <Link href="/"></Link> */}
      </div>

      <nav>
        <ul>
          <li>
            <Link href="/">All Events</Link>
          </li>
          <li>
            <Link href="/new-event">Add New Event</Link>
          </li>
          <li>
            <div>TODO: Marketplase Owner put here</div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
