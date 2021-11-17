export async function saveDraft(data) {
  const tokenCaptcha = await window.getReCaptchaToken;
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/drafts`, {
    method: "POST",
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
/* data structure: {
   name, contentHtml, contentJson, thumbnailImage
}
*/

export async function deleteDraft(id) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/drafts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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
/* url/:id
 */
export async function updateDraft({ id, data }) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/drafts/${id}`, {
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
/* data structure: {
   name, contentHtml, contentJson, thumbnailImage
}
*/
export async function getDrafts({
  pageNum = 1,
  numPerPage = 10,
  searchString,
}) {
  if (!searchString) {
    searchString = "";
  }
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(
    `${serverDomain}/drafts?pageNum=${pageNum}&numPerPage=${numPerPage}&searchString=${searchString}`,
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
/* data structure: {
   name, contentHtml, contentJson, thumbnailImage
}
*/
export async function getNumberOfDrafts(searchString) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  if (!searchString) {
    searchString = "";
  }
  const response = await fetch(
    `${serverDomain}/drafts?isCount=1&searchString=${searchString}`,
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
export async function getSingleDraft(id) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/drafts/${id}`, {
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
