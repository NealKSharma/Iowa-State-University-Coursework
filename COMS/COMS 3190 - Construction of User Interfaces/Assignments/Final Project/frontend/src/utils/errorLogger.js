function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error || "Unknown frontend error");
}

function getErrorStack(error) {
  return error instanceof Error ? error.stack || "" : "";
}

function getErrorStatus(error) {
  return typeof error?.status === "number" ? error.status : 0;
}

export function logClientError(apiBase, error, context = {}) {
  //this sends website errors to mongodb so admin can inspect them
  return fetch(`${apiBase}/api/errors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: getErrorMessage(error),
      source: "frontend",
      severity: "error",
      stack: getErrorStack(error),
      url: window.location.href,
      status: getErrorStatus(error),
      context,
    }),
  }).catch(() => {
    //if the logger itself breaks just dont crash the website
  });
}

export function errorFromResponse(response, data, fallbackMessage) {
  //this turns bad api responses into normal errors for the logger
  const error = new Error(data?.message || fallbackMessage || "Request failed");
  error.status = response.status;
  return error;
}
