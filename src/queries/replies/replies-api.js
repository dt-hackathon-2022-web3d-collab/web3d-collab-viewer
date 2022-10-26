const url = import.meta.env.VITE_REST_URL;

export const createReply = async ({ sessionId, annotationId, body }) => {
  const response = await fetch(
    `${url}/v1/sessions/${sessionId}/annotations/${annotationId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  return response.json();
};
