const initialState = {
  loading: false,
  enrollments: [],
  error: null,
  courseEnrollments: [],
};

const enrollmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ENROLL_COURSE_REQUEST":
    case "GET_MY_ENROLLMENTS_REQUEST":
      return { ...state, loading: true, error: null };

    case "ENROLL_COURSE_SUCCESS":
      return {
        ...state,
        loading: false,
        enrollments: [...state.enrollments, action.payload],
      };

    case "GET_MY_ENROLLMENTS_SUCCESS":
      return {
        ...state,
        loading: false,
        enrollments: action.payload,
      };

    case "ENROLL_COURSE_FAILURE":
    case "GET_MY_ENROLLMENTS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "CANCEL_ENROLLMENT_REQUEST":
      return { ...state, loading: true };

    case "CANCEL_ENROLLMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        enrollments: {
          ...state.enrollments,
          data: state.enrollments.data.filter((e) => e._id !== action.payload),
        },
        error: null,
      };

    case "CANCEL_ENROLLMENT_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "GET_COURSE_ENROLLMENTS_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_COURSE_ENROLLMENTS_SUCCESS":
      return { ...state, loading: false, courseEnrollments: action.payload };

    case "GET_COURSE_ENROLLMENTS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_ENROLLMENT_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

export default enrollmentReducer;
