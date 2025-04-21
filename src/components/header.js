import dofusLogo from "../assets/dofus-logo.png";

export default function Header() {
  // resize the image to 100x100 pixels
  const style = {
    width: "70%",
    height: "70%",
    // bring it more to the top
    marginTop: "-3vh",
    marginBottom: "-3vh",
  };

  return <img style={style} src={dofusLogo} alt="Dofus Logo" />;
}
