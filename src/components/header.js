import dofusLogo from "../assets/dofus-logo.png";

export default function Header() {
  // resize the image to 100x100 pixels
  const style = {
    width: "100%",
    height: "100%",
  };

  return <img style={style} src={dofusLogo} alt="Dofus Logo" />;
}
