export async function getNumberOfComments( slug ) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(
    `${serverDomain}/posts/${slug}/comments?isCount=1`,
    {
      credentials: "include",
    },
  );
  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Can not get this content");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  return data;
}
export async function getComments({slug }) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(
    `${serverDomain}/posts/${slug}/comments`,
    {
      credentials: "include",
    },
  );
  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Can not get this content");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  return data;
}
export async function saveComment(data) {
  const tokenCaptcha = await window.getReCaptchaToken();
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/posts/${data.slug}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data, tokenCaptcha }),
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
