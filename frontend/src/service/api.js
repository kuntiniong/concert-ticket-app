const BASE_URL = "http://localhost:1337/api/concerts";

// fetch all concerts -> GET
export const fetchConcerts = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch concerts.");
  }
  return await response.json();
};

// update ticket availability -> PUT
export const updateQuantity = async (documentId, updatedQuantity) => {
  const response = await fetch(`${BASE_URL}/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedQuantity),
  });

  if (!response.ok) {
    throw new Error("Failed to update concert.");
  }
  return await response.json();
};