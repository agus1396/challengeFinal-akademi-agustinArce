const initialState = {
  loading: false,
  // Para almacenar cursos paginados (alumnos y superadmin)
  courses: {
    data: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  },
  course: null, // Curso recién creado o visualizado
  // Cursos del profesor logueado
  myCourses: {
    data: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  },
  error: null,
};

const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    // Operaciones en curso: activamos loading y limpiamos errores
    case "CREATE_COURSE_REQUEST":
    case "GET_MY_COURSES_REQUEST":
    case "GET_COURSE_BY_ID_REQUEST":
    case "UPDATE_COURSE_REQUEST":
    case "DELETE_COURSE_REQUEST":
    case "GET_ALL_COURSES_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Curso creado exitosamente: lo guardamos en course, courses, y myCourses
    case "CREATE_COURSE_SUCCESS":
      return {
        ...state,
        loading: false,
        course: action.payload,
        courses: {
          ...state.courses,
          data: [...state.courses.data, action.payload], // ← solo lo agregamos a la lista actual
        },
        myCourses: [...state.myCourses, action.payload],
      };

    // Cursos del profesor obtenidos exitosamente
    case "GET_MY_COURSES_SUCCESS":
      return {
        ...state,
        loading: false,
        myCourses: action.payload,
      };

    // Curso individual obtenido o actualizado
    case "GET_COURSE_BY_ID_SUCCESS":
    case "UPDATE_COURSE_SUCCESS":
      if (!action.payload) return state;
      return {
        ...state,
        loading: false,
        course: action.payload,
        myCourses: {
          ...state.myCourses,
          data: state.myCourses.data.map((c) =>
            c._id === action.payload._id ? action.payload : c
          ),
        },
      };

    // Curso eliminado del listado del profesor
    case "DELETE_COURSE_SUCCESS":
      return {
        ...state,
        loading: false,
        myCourses: {
          ...state.myCourses,
          data: state.myCourses.data.filter((c) => c._id !== action.payload),
          totalItems: state.myCourses.totalItems - 1,
        },
      };

    // Manejo de errores generales
    case "CREATE_COURSE_FAILURE":
    case "GET_MY_COURSES_FAILURE":
    case "GET_COURSE_BY_ID_FAILURE":
    case "UPDATE_COURSE_FAILURE":
    case "DELETE_COURSE_FAILURE":
    case "GET_ALL_COURSES_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Cursos generales paginados (alumnos y superadmin)
    case "GET_ALL_COURSES_SUCCESS":
      return {
        ...state,
        loading: false,
        courses: action.payload, // ← guardamos el objeto completo: { data, totalPages, ... }
      };

    default:
      return state;
  }
};

export default courseReducer;
