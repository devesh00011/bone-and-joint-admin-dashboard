import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const tokenFromCookie = Cookies.get("adminToken123456789important-jpgkdienddjkdnfh") || null;

const initialState = {
    token: tokenFromCookie,
    isLoggedIn: tokenFromCookie ? true : false
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {

        setAdminLogin: (state, action) => {

            state.token = action.payload
            state.isLoggedIn = true

            // cookie set
            Cookies.set("adminToken123456789important-jpgkdienddjkdnfh", action.payload, { expires: 1 })
        },

        adminLogout: (state) => {

            state.token = null
            state.isLoggedIn = false

            // cookie remove
            Cookies.remove("adminToken123456789important-jpgkdienddjkdnfh")
        }

    }
});

export const { setAdminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;