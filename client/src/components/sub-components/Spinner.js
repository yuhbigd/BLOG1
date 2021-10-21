import classes from "./Spinner.module.css";

export default function Spinner(props) {
  return (
    <div className={classes["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
