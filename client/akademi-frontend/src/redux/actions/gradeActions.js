import api from "../../api/axios";

export const getStudentGrades =
  (studentId, page = 1, limit = 2) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "GET_STUDENT_GRADES_REQUEST" });

      const {
        auth: { token },
      } = getState();

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await api.get(
        `/grades/student/${studentId}?page=${page}&limit=${limit}`,
        config
      );

      dispatch({ type: "GET_STUDENT_GRADES_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "GET_STUDENT_GRADES_FAILURE",
        payload:
          error.response?.data?.error || "Error al obtener calificaciones",
      });
    }
  };

export const createGrade = (gradeData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "CREATE_GRADE_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await api.post("/grades", gradeData, config);

    dispatch({ type: "CREATE_GRADE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "CREATE_GRADE_FAILURE",
      payload: error.response?.data?.error || "Error al cargar calificación",
    });
  }
};

export const updateGrade =
  (gradeId, updatedData) => async (dispatch, getState) => {
    try {
      dispatch({ type: "UPDATE_GRADE_REQUEST" });

      const {
        auth: { token },
      } = getState();

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await api.put(`/grades/${gradeId}`, updatedData, config);

      dispatch({ type: "UPDATE_GRADE_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "UPDATE_GRADE_FAILURE",
        payload: error.response?.data?.error || "Error al editar calificación",
      });
    }
  };

/* export const getGradesByCourseAndStudent = (courseId, studentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_COURSE_STUDENT_GRADES_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const { data } = await api.get(`/grades/course/${courseId}/student/${studentId}`, config);

    dispatch({ type: "GET_COURSE_STUDENT_GRADES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "GET_COURSE_STUDENT_GRADES_FAILURE",
      payload: error.response?.data?.error || "Error al obtener calificaciones del alumno",
    });
  }
}; */

export const getGradesByCourse = (courseId) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_GRADES_BY_COURSE_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await api.get(`/grades/course/${courseId}`, config);

    dispatch({ type: "GET_GRADES_BY_COURSE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "GET_GRADES_BY_COURSE_FAILURE",
      payload:
        error.response?.data?.error ||
        "Error al obtener calificaciones del curso",
    });
  }
};

export const deleteGrade = (gradeId) => async (dispatch, getState) => {
  try {
    dispatch({ type: "DELETE_GRADE_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = { headers: { Authorization: `Bearer ${token}` } };
    await api.delete(`/grades/${gradeId}`, config);

    dispatch({ type: "DELETE_GRADE_SUCCESS", payload: gradeId });
  } catch (error) {
    dispatch({
      type: "DELETE_GRADE_FAILURE",
      payload: error.response?.data?.error || "Error al eliminar calificación",
    });
  }
};
