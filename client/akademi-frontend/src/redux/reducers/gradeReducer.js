const initialState = {
  grades: [], // ← será un objeto con data, totalPages, currentPage
  loading: false,
  error: null,
  createdGrade: null,
  courseStudentGrades: [],
  totalPages: 1,
  currentPage: 1,
};

const gradeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STUDENT_GRADES_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_STUDENT_GRADES_SUCCESS":
      return {
        ...state,
        loading: false,
        grades: action.payload, // ← payload completo: { data, totalPages, currentPage }
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
      };

    case "GET_STUDENT_GRADES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_GRADE_REQUEST":
    case "UPDATE_GRADE_REQUEST":
      return { ...state, loading: true, error: null };

    case "CREATE_GRADE_SUCCESS":
      return {
        ...state,
        loading: false,
        createdGrade: action.payload,
        grades: {
          ...state.grades,
          data: [...(state.grades?.data || []), action.payload], // agregar al array existente
        },
      };

    case "UPDATE_GRADE_SUCCESS":
      return {
        ...state,
        loading: false,
        grades: {
          ...state.grades,
          data: state.grades.data.map((grade) =>
            grade._id === action.payload._id ? action.payload : grade
          ),
        },
      };

    case "CREATE_GRADE_FAILURE":
    case "UPDATE_GRADE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "GET_GRADES_BY_COURSE_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_GRADES_BY_COURSE_SUCCESS":
      return { ...state, loading: false, grades: action.payload };

    case "GET_GRADES_BY_COURSE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_GRADE_SUCCESS":
      return {
        ...state,
        grades: {
          ...state.grades,
          data: state.grades.data.filter(
            (grade) => grade._id !== action.payload
          ),
        },
      };

    case "DELETE_GRADE_FAILURE":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default gradeReducer;
