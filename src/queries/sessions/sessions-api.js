const baseUrl = import.meta.env.VITE_API_URL;

export const createSession = async (body) => {
  const response = await fetch(`${baseUrl}/v1/sessions`, {
    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body),
  });

  return response.json();
};