import classes from "./Avatar.module.css";
const COLOR = ["#D1E8E4", "#6C4A4A", "#FF865E"];
function Avatar(props) {
  const avatarLink = props.avatarLink;
  const name = props.name;

  let nameWords = name
    .split(" ")
    .map((word) => {
      return word.charAt(0);
    })
    .reduce((word, char) => {
      return word + char;
    }, "");

  const bgColor = COLOR[nameWords.charAt(0).charCodeAt(0) % 3];
  console.log(bgColor);

  return (
    <div
      className={classes["avatar-container"]}
      style={{ background: bgColor }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {avatarLink == "" ? (
        <p>{nameWords.toUpperCase()}</p>
      ) : (
        <img src={process.env.REACT_APP_BASE_URL + avatarLink}></img>
      )}
    </div>
  );
}

export default Avatar;
