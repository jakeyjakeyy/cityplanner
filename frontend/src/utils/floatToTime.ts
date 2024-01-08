function floatToTime(float: number) {
  const hours = Math.floor(float);
  const minutes = Math.round((float - hours) * 60);
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

export default floatToTime;
