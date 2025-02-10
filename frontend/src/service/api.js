const BASE_URL = "http://localhost:1337/api";

// fetch all concerts -> GET
export const fetchConcerts = async () => {
  const response = await fetch(`${BASE_URL}/concerts`);
  if (!response.ok) {
    throw new Error("Failed to fetch concerts.");
  }
  return await response.json();
};

// send a request to book the tickets -> POST
export const book = async (documentId, requestedQuantity) => {
  const response = await fetch(`${BASE_URL}/tickets/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ // custom controller doesn't require the data obj
      documentId: documentId,
      requestedQuantity: requestedQuantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to book tickets.");
  }
  return await response.json();
};