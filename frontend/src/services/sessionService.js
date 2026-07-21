const API_BASE = "http://localhost:8000/api/sessions";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(message);
  }

  return response.json();
}

// ----------------------
// GET ALL SESSIONS
// ----------------------
export async function getSessions() {
  return handleResponse(
    await fetch(API_BASE)
  );
}

// ----------------------
// GET SESSION DETAILS
// ----------------------
export async function getSession(id) {
  return handleResponse(
    await fetch(`${API_BASE}/${id}`)
  );
}

// ----------------------
// UPLOAD EXCEL
// ----------------------
export async function uploadSession(file) {
  const formData = new FormData();

  formData.append("file", file);

  return handleResponse(
    await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    })
  );
}

// ----------------------
// EXPORT SESSION
// ----------------------
export async function exportSession(id) {
  const response = await fetch(
    `${API_BASE}/${id}/export`
  );

  if (!response.ok) {
    throw new Error("Export failed");
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "Battery_Test.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}