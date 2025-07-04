import api from "../../api/axios";

export const createCourse = (courseData) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "CREATE_COURSE_REQUEST" });

      const {
        auth: { token },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post("/courses", courseData, config);

      dispatch({
        type: "CREATE_COURSE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CREATE_COURSE_FAILURE",
        payload: error.response?.data?.error || "Error al crear el curso",
      });
    }
  };
};

export const getMyCourses = (filters = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "GET_MY_COURSES_REQUEST" });

      const {
        auth: { token },
      } = getState();

      const query = new URLSearchParams(filters).toString();

      const response = await api.get(`/courses/professor/me?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: "GET_MY_COURSES_SUCCESS",
        payload: response.data, // ← objeto con data, totalPages, etc.
      });
    } catch (error) {
      dispatch({
        type: "GET_MY_COURSES_FAILURE",
        payload:
          error.response?.data?.error || "Error al obtener cursos del profesor",
      });
    }
  };
};

export const deleteCourse = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "DELETE_COURSE_REQUEST" });

      const {
        auth: { token },
      } = getState();

      await api.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "DELETE_COURSE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({
        type: "DELETE_COURSE_FAILURE",
        payload: error.response?.data?.error || "Error al eliminar el curso",
      });
    }
  };
};

export const getCourseById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_COURSE_BY_ID_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await api.get(`/courses/${id}`, config);

    dispatch({
      type: "GET_COURSE_BY_ID_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "GET_COURSE_BY_ID_FAILURE",
      payload: error.response?.data?.error || "Error al obtener el curso",
    });
  }
};

export const updateCourse = (id, updatedData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "UPDATE_COURSE_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await api.put(`/courses/${id}`, updatedData, config);

    dispatch({
      type: "UPDATE_COURSE_SUCCESS",
      payload: data,
    });

    return data; // 👈 devuelve la respuesta si todo va bien
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Error al actualizar el curso";

    dispatch({
      type: "UPDATE_COURSE_FAILURE",
      payload: errorMessage,
    });

    throw new Error(errorMessage); // 👈 permite que el componente lo capture
  }
};

export const getAllCourses = (filters = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: "GET_ALL_COURSES_REQUEST" });

      const { token } = getState().auth;

      // Convertir objeto de filtros en query string
      const query = new URLSearchParams(filters).toString();

      const response = await api.get(`/courses?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: "GET_ALL_COURSES_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({
        type: "GET_ALL_COURSES_FAILURE",
        payload: error.response?.data?.error || "Error al obtener cursos",
      });
    }
  };
};
