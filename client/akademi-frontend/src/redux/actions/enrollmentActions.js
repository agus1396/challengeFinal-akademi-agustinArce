import api from "../../api/axios";

// Acción para inscribirse en un curso
export const enrollInCourse = (courseId) => async (dispatch, getState) => {
  try {
    dispatch({ type: "ENROLL_COURSE_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await api.post(
      "/enrollments",
      { course: courseId },
      config
    );

    dispatch({ type: "ENROLL_COURSE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "ENROLL_COURSE_FAILURE",
      payload: error.response?.data?.error || "Error al inscribirse al curso",
    });
  }
};

// Acción para obtener las inscripciones del alumno
export const getMyEnrollments =
  (params = {}) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "GET_MY_ENROLLMENTS_REQUEST" });

      const {
        auth: { token },
      } = getState();

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params,
      };

      const { data } = await api.get("/enrollments/me", config);

      dispatch({ type: "GET_MY_ENROLLMENTS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "GET_MY_ENROLLMENTS_FAILURE",
        payload:
          error.response?.data?.error || "Error al obtener inscripciones",
      });
    }
  };

// Acción para cancelar inscripción
export const cancelEnrollment =
  (enrollmentId) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CANCEL_ENROLLMENT_REQUEST" });

      const {
        auth: { token },
      } = getState();

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await api.delete(`/enrollments/${enrollmentId}`, config);

      dispatch({ type: "CANCEL_ENROLLMENT_SUCCESS", payload: enrollmentId });
    } catch (error) {
      dispatch({
        type: "CANCEL_ENROLLMENT_FAILURE",
        payload: error.response?.data?.error || "Error al cancelar inscripción",
      });
    }
  };

//Acción para ver inscripciones al curso
export const getEnrollmentsByCourse =
  (courseId, page = 1, limit = 5) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "GET_COURSE_ENROLLMENTS_REQUEST" });

      const {
        auth: { token },
      } = getState();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await api.get(
        `/enrollments/course/${courseId}?page=${page}&limit=${limit}`,
        config
      );

      dispatch({ type: "GET_COURSE_ENROLLMENTS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "GET_COURSE_ENROLLMENTS_FAILURE",
        payload:
          error.response?.data?.error ||
          "Error al obtener inscripciones del curso",
      });
    }
  };

export const clearEnrollmentError = () => ({
  type: "CLEAR_ENROLLMENT_ERROR",
});
