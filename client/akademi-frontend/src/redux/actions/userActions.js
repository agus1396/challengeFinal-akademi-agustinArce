import api from "../../api/axios";

// Obtener todos los usuarios (solo superadmin)
export const getAllUsers = (filters = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "GET_USERS_REQUEST" });

      const { token } = getState().auth;
      const query = new URLSearchParams(filters).toString();

      const response = await api.get(`/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "GET_USERS_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({
        type: "GET_USERS_FAILURE",
        payload: error.response?.data?.error || "Error al obtener usuarios",
      });
    }
  };
};

// Crear un nuevo profesor (solo superadmin)
export const createProfessor = (userData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "CREATE_USER_REQUEST" });

      const { token } = getState().auth;

      await api.post("/users", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: "CREATE_USER_SUCCESS" });

      return true; // ✅ éxito
    } catch (error) {
      dispatch({
        type: "CREATE_USER_FAILURE",
        payload: error.response?.data?.error || "Error al crear usuario",
      });

      return false; // ❌ error
    }
  };
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "DELETE_USER_REQUEST" });

    const {
      auth: { token }, 
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };

    await api.delete(`/users/${id}`, config);

    dispatch({ type: "DELETE_USER_SUCCESS", payload: id });
  } catch (error) {
    dispatch({
      type: "DELETE_USER_FAILURE",
      payload: error.response?.data?.error || "Error al eliminar el usuario",
    });
  }
};
