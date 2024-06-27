

const storedUser = localStorage.getItem("user");
const storedrole = localStorage.getItem("role");

// set the initial state to the stored value, or to null if no value is found
//consolelog(storedUser);
// const jwtoken = document.cookie.split(";").find(cookie => cookie.trim().startsWith("jwtoken="));


// const jwtoken = Cookies.get("jwtoken");
const jwtoken = localStorage.getItem("jwtoken");

//consolelog(jwtoken);
export const initialState = jwtoken  ? { user: JSON.parse(storedUser), role: storedrole } : { user: null, role: null };


// export const initialState = storedUser ? { user: JSON.parse(storedUser), role:storedrole} : { user: null, role: null };

export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      // store the user information in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload } ;
    case "USER_TYPE":
      // store the user type in localStorage
      localStorage.setItem("role", action.payload);
      return { ...state, role: action.payload };
    default:
      return state;
  }
};



