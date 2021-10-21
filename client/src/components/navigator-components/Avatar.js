import { useSelector } from "react-redux";
import classes from "./Avatar.module.css";
const COLOR = ["#c563fa", "#6cff5e", "#FF865E"];
function Avatar(props) {
  //getting name and link to avatar image
  const reduxContext = useSelector((state) => {
    return state.user;
  });
  const avatarLink = reduxContext.avatar;
  let nameWords = reduxContext.name
    .split(" ")
    .map((word) => {
      return word.charAt(0);
    })
    .reduce((word, char) => {
      return word + char;
    }, "");

  //generate bg color
  const bgColor = COLOR[nameWords.charAt(0).charCodeAt(0) % 3];

  return (
    <div
      className={classes["avatar-container"]}
      style={{ background: bgColor }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {reduxContext.avatar == "" ? (
        <p>{nameWords.toUpperCase()}</p>
      ) : (
        <img src={process.env.REACT_APP_BASE_URL + avatarLink}></img>
      )}
    </div>
  );
}

export default Avatar;
