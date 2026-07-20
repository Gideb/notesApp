const API_BASE_URL = "/api";

export const API_PATHS = {
  CREATE_ACCOUNT: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  GET_USER_INFO: `${API_BASE_URL}/get-user`,
  ADD_NOTE: `${API_BASE_URL}/add-note`,
  EDIT_NOTE: (id) => `${API_BASE_URL}/edit-notes/${id}`,
  DELETE_NOTE: (id) => `${API_BASE_URL}/delete-note/${id}`,
  UPDATE_PINNED_NOTE: (id) => `${API_BASE_URL}/update-pinned-note/${id}`,
  GET_ALL_NOTES: `${API_BASE_URL}/get-all-notes`,
};

export default API_BASE_URL;
