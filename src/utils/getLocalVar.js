export const getVariable = (data) => {
  const dataJSON = localStorage.getItem(data);
  const variable = JSON.parse(dataJSON);
  return variable;
};
