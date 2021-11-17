export async function login(user) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/login`, {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Could not log in.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }
  return data;
}
export async function signup(user) {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/signup`, {
    method: "POST",
    body: JSON.stringify({ user: user }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "Could not sign up.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }

  return data;
}

export async function getUserFromToken() {
  const serverDomain = process.env.REACT_APP_BASE_URL;
  const response = await fetch(`${serverDomain}/login`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    let error = new Error(data.error || "You haven't logged in.");
    Object.assign(error, { statusCode: response.status });
    throw error;
  }

  return data;
}
