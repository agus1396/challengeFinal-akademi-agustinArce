const initialState = {
  users: {
    superadmin: { data: [], totalItems: 0, totalPages: 1, currentPage: 1 },
    profesor: { data: [], totalItems: 0, totalPages: 1, currentPage: 1 },
    alumno: { data: [], totalItems: 0, totalPages: 1, currentPage: 1 },
  },
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USERS_REQUEST":
    case "CREATE_USER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "GET_USERS_SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "GET_USERS_FAILURE":
    case "CREATE_USER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "DELETE_USER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        users: {
          superadmin: {
            ...state.users.superadmin,
            data: state.users.superadmin.data.filter(
              (user) => user._id !== action.payload
            ),
          },
          profesor: {
            ...state.users.profesor,
            data: state.users.profesor.data.filter(
              (user) => user._id !== action.payload
            ),
          },
          alumno: {
            ...state.users.alumno,
            data: state.users.alumno.data.filter(
              (user) => user._id !== action.payload
            ),
          },
        },
      };

    case "DELETE_USER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
