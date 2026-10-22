export default function DateDisplay() {
  const today = new Date();
  const dateTime = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="dateDisplay" aria-label="Today's date">
      <p>Today</p>
      <time dateTime={dateTime}>{formattedDate}</time>
    </section>
  );
}
