export async function publicArticle(data) {
  const tokenCaptcha = await window.getReCaptchaToken();
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/posts`, {
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
/* data structure: {
   name, contentHtml, contentJson, thumbnailImage
}
*/
export async function deleteArticle(slug) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/posts/${slug}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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
export async function updateArticle({ slug: slug, data }) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/posts/${slug}`, {
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
export async function getPosts({
  pageNum = 1,
  numPerPage = 12,
  searchString,
  order = "_id",
  direction = "desc",
}) {
  if (!searchString) {
    searchString = "";
  }
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(
    `${serverDomain}/posts?pageNum=${pageNum}&numPerPage=${numPerPage}&searchString=${searchString}&order=${order}&direction=${direction}`,
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
export async function getNumberOfPosts(searchString) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  if (!searchString) {
    searchString = "";
  }
  const response = await fetch(
    `${serverDomain}/posts?isCount=1&searchString=${searchString}`,
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
export async function getSinglePost(slug) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/posts/${slug}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Not found");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  return data;
}
export async function getMyPosts({
  userId,
  pageNum = 1,
  numPerPage = 12,
  searchString,
  order = "_id",
  direction = "desc",
}) {
  if (!searchString) {
    searchString = "";
  }
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(
    `${serverDomain}/u/${userId}?pageNum=${pageNum}&numPerPage=${numPerPage}&searchString=${searchString}&order=${order}&direction=${direction}`,
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
export async function getNumberOfMyPosts({ userId, searchString }) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  if (!searchString) {
    searchString = "";
  }
  const response = await fetch(
    `${serverDomain}/u/${userId}?isCount=1&searchString=${searchString}`,
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
