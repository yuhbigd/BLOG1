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
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Can not send data.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  // server will return link to image
  return data;
}
// data structure {
//   name:,
//   ...
// }
export async function changeAccountInfo(data) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/account`, {
    method: "PUT",
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
// data structure {
//   password:,
//   newPassword:
// }
export async function changePassword(data) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/account/password`, {
    method: "PUT",
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
