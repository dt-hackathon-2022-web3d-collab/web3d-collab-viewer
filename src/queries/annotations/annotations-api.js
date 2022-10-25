const url = import.meta.env.VITE_REST_URL;

export const createAnnotation = async ({ sessionId, body }) => {
  const response = await fetch(`${url}/v1/sessions/${sessionId}/annotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response.json();
};

export const getAllAnnotations = async ({ sessionId }) => {
  const response = await fetch(`${url}/v1/sessions/${sessionId}/annotations`, {
    method: "GET",
  });

  return response.json();
};

export const getAnnotation = async ({ sessionId, annotationId }) => {
  const response = await fetch(
    `${url}/v1/sessions/${sessionId}/annotations/${annotationId}`,
    {
      method: "GET",
    }
  );

  return response.json();
};
