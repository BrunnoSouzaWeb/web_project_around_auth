import favIcon from "../images/around.png";

export default function Header() {
  return (
    <header className="header">
      <img src={favIcon} alt="Logo" className="header__logo" />
    </header>
  );
}
