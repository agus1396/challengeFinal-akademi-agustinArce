import { combineReducers } from "redux";
import authReducer from "./authReducer";
import courseReducer from "./courseReducer";
import enrollmentReducer from "./enrollmentReducer";
import gradeReducer from "./gradeReducer";
import statsReducer from "./statsReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  enrollment: enrollmentReducer,
  grade: gradeReducer,
  stats: statsReducer,
  user: userReducer,
});

export default rootReducer;
