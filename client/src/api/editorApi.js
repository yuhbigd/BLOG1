//  send base64 image
export async function sendImage(image) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch(`${serverDomain}/posts/images`, {
    method: "post",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Can not send data.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  // server will return link to image

  return data;

  // data structure {
  //   link:,
  //   message:
  // }
}
export async function removeImagesRedundancy(data) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/posts/images`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
    credentials: "include",
  });

  const message = await response.json();
  if (!response.ok || message.error) {
    let error = new Error(message.error || "Can not send data.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  // server will return link to image
  return message;
}
