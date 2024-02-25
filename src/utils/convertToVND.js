const convertToVND = (number) => {
  return `${Number(number).toLocaleString("en-US").replace(/,/g, ".")} VND`;
};

export default convertToVND;
