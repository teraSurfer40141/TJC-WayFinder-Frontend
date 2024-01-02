"use client ";
export async function postMessageAndGetImages({
  currentLocation,
  destinationLocation,
}: {
  currentLocation: string;
  destinationLocation: string;
}) {
  //const url = "http://127.0.0.1:5000/api/wayfinder"; // for development only
  const url = "https://tjc-wayfinder-backend.onrender.com/api/wayfinder"; // change to this when deploying
  const message = {
    currentLocation: currentLocation,
    destinationLocation: destinationLocation,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const base64Strings = await response.json(); // assuming the response is an array of base64 strings
  console.log(base64Strings);
const imageUrls = base64Strings.map(
  (base64String: string) => `data:image/png;base64,${base64String}`
);
return imageUrls;
}
