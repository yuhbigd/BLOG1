//  send base64 image
export async function sendAvatar(image) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const formData = new FormData();
  formData.append("avatar", image);
  const response = await fetch(`${serverDomain}/account/avatar`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    let error = new Error(data.error || "Can not send data.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  // server will return link to image
  return data;
}
