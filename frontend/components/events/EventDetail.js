import classes from "./EventDetail.module.css";
function EventDetail(props) {
  return (
    <section className={classes.detail}>
      <img src={props.image} alt={props.title} />
      <h1>{props.title}</h1>
      <p>dAdding here the time and date of the event...</p>
      <p>{props.description}</p>
    </section>
  );
}

export default EventDetail;
