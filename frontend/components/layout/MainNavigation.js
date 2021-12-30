import Link from "next/link";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    // <header className={classes.header}>
    //   <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    //     <a className="navbar-brand" href="#/">
    //       TixLabLogo
    //     </a>

    //     <ul className="navbar-nav ml-auto">
    //       <li className="nav-item">
    //         <Link href="/" className="nav-link small">
    //           All Events
    //         </Link>
    //       </li>
    //       <li>
    //         <Link href="/new-event">Add New Event</Link>
    //       </li>

    //       <li className="nav-item">
    //         <a
    //           className="nav-link small"
    //           // href={`https://etherscan.io/address/${this.props.account}`}
    //           // target="_blank"
    //           // rel="noopener noreferrer"
    //         >
    //           {/* {this.props.isMarketplaceOwnerAccount
    //           ? this.props.account + " Marketplase Owner "
    //           : this.props.account} */}
    //           TODO: Marketplase Owner put here
    //         </a>
    //       </li>
    //     </ul>
    //   </nav>
    // </header>

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
        </ul>
      </nav>
      <div>TODO: Marketplase Owner put here</div>
    </header>
  );
}

export default MainNavigation;
