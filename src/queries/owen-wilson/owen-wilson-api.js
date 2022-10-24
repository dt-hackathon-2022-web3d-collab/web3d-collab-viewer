export const getOrdered = async ({ index }) => {
  const response = await fetch(
    `https://owen-wilson-wow-api.onrender.com/wows/ordered/${index}`,
    {
      method: "GET",
    }
  );

  return response.json();
};
