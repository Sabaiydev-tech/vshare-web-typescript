import { useMutation } from "@apollo/client";
import {
  CREATE_LOG,
  USER_LOGIN,
  USER_SIGNUP,
} from "api/graphql/secure.graphql";
import React, { createContext, ReactNode, useReducer, useState } from "react";

import useManageGraphqlError from "hooks/useManageGraphqlError";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage, warningMessage } from "utils/alert.util";
import axios from "axios";
import { ENV_KEYS } from "constants/env.constant";
import { checkAccessToken, decryptToken, encryptId } from "utils/secure.util";
import { UAParser } from "ua-parser-js";
import DialogWarning from "components/dialog/DialogWarning";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";
const FORGET_PASSWORD = "FORGET_PASSWORD";
const RESET_FORGET_PASSWORD = "RESET_FORGET_PASSWORD";
const ENABLE_2FACTOR = "ENABLE_2FACTOR";
const ENABLE_TOKEN = "ENABLE_TOKEN";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  dateForgetPassword: "",
};

const JWTReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case LOG_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case FORGET_PASSWORD:
      return { ...state, dateForgetPassword: action.payload };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case RESET_FORGET_PASSWORD:
      return {
        ...state,
        dateForgetPassword: "",
      };
    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthVoteContext = createContext(null);

interface ClientVoteProviderProps {
  children: ReactNode;
}
function ClientVoteProvider({ children }: ClientVoteProviderProps) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const [userLogin] = useMutation(USER_LOGIN);
  const [register] = useMutation(USER_SIGNUP);
  const [authLoading, setAuthLoading] = useState(false);
  const [createLog] = useMutation(CREATE_LOG);
  const manageGraphqlError = useManageGraphqlError();
  const [openWarning, setOpenWarning] = React.useState(false);

  const authentication2FA = async (user: any, token: string) => {
    localStorage.setItem(ENV_KEYS.VITE_APP_USER_DATA, JSON.stringify(user));
    checkAccessToken(token);
    dispatch({
      type: SIGN_IN,
      payload: {
        user,
      },
    });
    dispatch({
      type: ENABLE_2FACTOR,
      payload: {
        open: false,
      },
    });

    successMessage("Login Success!!", 3000);
    navigate("/dashboard");
  };
  const handleOpen2Factor = (val: boolean) => {
    dispatch({
      type: ENABLE_2FACTOR,
      payload: {
        open: val,
      },
    });
  };

  const UA = new UAParser();
  const result: any = UA.getResult();
  const formattedResult = `{
  "browser": "${result.browser.name}",
  "cpu": "${result.cpu.architecture}",
  "os": "${result.os.name} ${result.os.version}",
  "from": "Location: ${result.ua}",
  "brand": "${result.device.brand || null}",
  "build": "${result.device.build || null}",
  "model": "${result.device.model || null}",
  "systemName": "${result.os.name}"
}`;

  const handleCreateLog = async (id, name, refreshId, formattedResult) => {
    try {
      await createLog({
        variables: {
          input: {
            createdBy: parseInt(id),
            name: name,
            refreshID: refreshId,
            description: formattedResult,
          },
        },
      });
    } catch (error) {
      errorMessage("refresh token failed", 2000);
    }
  };

  const oauthLogin = async (data: any, token: string) => {
    const role = "customer";
    if (token && role === "customer") {
      const checkRole = token;
      const user = data;
      const enable2FA = data?.twoFactorIsEnabled;

      const authen = true;
      const decoded = checkRole;
      const tokenData = decryptToken(
        decoded,
        ENV_KEYS.VITE_APP_TOKEN_SECRET_KEY,
      );
      if (enable2FA === 0) {
        const userDataEncrypt = encryptId(
          JSON.stringify(data),
          ENV_KEYS.VITE_APP_LOCAL_STORAGE_SECRET_KEY,
        );
        checkAccessToken(decoded);
        localStorage.setItem(ENV_KEYS.VITE_APP_USER_DATA_KEY, userDataEncrypt);

        dispatch({
          type: SIGN_IN,
          payload: {
            user,
          },
        });
        successMessage("Login Success!!", 3000);
        navigate("/dashboard");
      } else if (enable2FA === 1) {
        dispatch({
          type: ENABLE_TOKEN,
          payload: {
            token: decoded,
          },
        });
        dispatch({
          type: SIGN_IN,
          payload: {
            user,
          },
        });
        handleOpen2Factor(true);
      } else {
        return { authen, user, checkRole, refreshId: tokenData.refreshID };
      }
    }
  };

  const signIn = async (
    username: string,
    password: string,
    voteParams: string,
  ) => {
    setAuthLoading(!authLoading);
    try {
      const responseIp = await axios.get(ENV_KEYS.VITE_APP_LOAD_GETIP_URL, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const signInUser = await userLogin({
        variables: {
          where: {
            username: username || "",
            password: password || "",
            ip: responseIp.data || "",
            captcha: window.__reCaptcha! || "",
          },
        },
      });

      const checkRole = signInUser?.data?.userLogin?.token;
      const user = signInUser?.data?.userLogin?.data[0];
      const enable2FA = user?.twoFactorIsEnabled;
      const authen = true;
      
      const tokenData = decryptToken(
        checkRole,
        ENV_KEYS.VITE_APP_TOKEN_SECRET_KEY,
      );

      await handleCreateLog(
        user?._id,
        "login",
        tokenData.refreshID,
        formattedResult,
      );

      if (enable2FA === 0) {
        const userDataEncrypt = encryptId(
          JSON.stringify(signInUser?.data?.userLogin?.data[0]),
          ENV_KEYS.VITE_APP_LOCAL_STORAGE_SECRET_KEY,
        );
        checkAccessToken(checkRole);
        localStorage.setItem(ENV_KEYS.VITE_APP_USER_DATA_KEY, userDataEncrypt);
        dispatch({
          type: SIGN_IN,
          payload: {
            user,
          },
        });
        successMessage("Login Success!!", 3000);
        dispatch({
          type: SIGN_IN,
          payload: {
            user,
          },
        });

        setAuthLoading(false);
        navigate(`/vote/upload?lc=${voteParams}`);
      } else {
        return { authen, user, checkRole, refreshId: tokenData.refreshID };
      }
    } catch (error: any) {
      setAuthLoading(false);
      const cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      if (cutErr === "Username or password is incorrect") {
        errorMessage("Username or password incorrect!!", 3000);
      } else if (cutErr === "YOUR_STATUS_IS_DISABLED") {
        setOpenWarning(true);
      } else if (cutErr === "USER_NOT_FOUND") {
        errorMessage("Username doesn't exist!", 3000);
      } else if (cutErr === "ACCOUNT_LOCKED_UNTIL:ວັນທີເດືອນປີ") {
        warningMessage("You account was locked until tomorrow!", 3000);
      } else {
        errorMessage(error.message, 3000);
      }
    }
  };
  const signUp = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    voteParams: string,
  ) => {
    const captcha = window.__reCaptcha || "";
    const responseIp = await axios.get(ENV_KEYS.VITE_APP_LOAD_GETIP_URL, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    try {
      const signUpUser = await register({
        variables: {
          input: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            email: email,
            ip: responseIp.data,
            captcha,
          },
        },
      });
      if (signUpUser?.data?.signup?._id) {
        successMessage("Register successful!", 3000);
        navigate(`/auth/sign-in/${voteParams}`);
      }
    } catch (error: any) {
      const cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(manageGraphqlError.handleErrorMessage(cutErr) || "", 3000);
    }
  };

  return (
    <AuthVoteContext.Provider
      value={{
        ...state,
        oauthLogin,
        signUp,
        signIn,
        authentication2FA,
      }}
    >
      {children}
      {openWarning && (
        <DialogWarning
          title="Your account is inactive now!"
          description="If you want to continue using this account please contact our admin to active it. Thank you!"
          isOpen={openWarning}
          onClose={() => setOpenWarning(false)}
        />
      )}
    </AuthVoteContext.Provider>
  );
}

export { AuthVoteContext, ClientVoteProvider };
