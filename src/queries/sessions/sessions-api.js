const url = import.meta.env.VITE_SOCKET_URL;

export const createSession = async (body) => {
  const response = await fetch(`http://${url}/v1/sessions`, {
    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body),
  });

  return response.json();
};
