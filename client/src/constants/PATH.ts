const createPath = () => {
  const DASHBOARD = "/dashboard";
  return {
    HOME: "/",
    SIGN_IN: "/sign-in",
    DASHBOARD,
    TEACHERS: `${DASHBOARD}/teachers`,
    STUDENTS: `${DASHBOARD}/students`,
    CLASSES: `${DASHBOARD}/classes`,
    SUBJECTS: `${DASHBOARD}/subjects`,
    CLASS_TECHER: `${DASHBOARD}/class-teacher`,
    CALL: `/call`,
  };
};

const PATH = createPath();

export default PATH;
