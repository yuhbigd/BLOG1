import "./App.css";
import useHttp from "./custom-hooks/use-http";
import { getUserFromToken } from "./api/authApi";
import { addUser } from "./state/actionCreator/userActions";
import { Suspense, useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import Spinner from "./components/sub-components/Spinner";
import MainNavigator from "./components/layout/MainNavigator";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import Login from "./pages/authPages/Login";
import _ from "lodash";
import Signup from "./pages/authPages/Signup";
import Account from "./pages/accountSettingPages/Account";
import MainContainter from "./components/layout/MainContainter";
import CreatePost from "./pages/createPostPages/CreatePost";
import DraftsPage from "./pages/draftsPages/DraftsPage";

global._ = _;

function App() {
  const [reload, forceReload] = useState();
  const [isBusy, setIsBusy] = useState(true);
  const reduxContext = useSelector((state) => {
    return state.user;
  });
  const { sendRequest, status, data } = useHttp(getUserFromToken);
  const dispatch = useDispatch();
  const addUserHandler = bindActionCreators(addUser, dispatch);

  //get User if browser has token and has not logged in and reload manually
  useEffect(() => {
    if (_.isEmpty(reduxContext)) {
      (async () => {
        await sendRequest();
      })();
    } else {
      forceReload([]); //??:)) quen mat day lam cai j r :))??
    }
  }, [reduxContext]);
  useEffect(() => {
    if (data != null && status == "completed") {
      addUserHandler(data.user);
    }
    if (status == "completed") {
      setIsBusy(false);
    }
  }, [data, status]);

  return (
    <div className="App">
      {!isBusy && (
        <>
          <MainNavigator></MainNavigator>
          <MainContainter>
            <Suspense fallback={<Spinner></Spinner>}>
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/"></Redirect>
                </Route>
                <Route path="/login" exact>
                  {_.isEmpty(reduxContext) ? (
                    <Login></Login>
                  ) : (
                    <Redirect to="/"></Redirect>
                  )}
                </Route>
                <Route path="/signup" exact>
                  {_.isEmpty(reduxContext) ? (
                    <Signup></Signup>
                  ) : (
                    <Redirect to="/"></Redirect>
                  )}
                </Route>
                {!_.isEmpty(reduxContext) ? (
                  <Switch>
                    <Route path="/account">
                      <Account
                        reduxContext={reduxContext}
                        changeUser={addUserHandler}
                      ></Account>
                    </Route>
                    <Route path="/create">
                      <CreatePost reduxContext={reduxContext} />
                    </Route>
                    <Route path="/drafts">
                      <DraftsPage reduxContext={reduxContext} exact />
                    </Route>
                    <Redirect to="/"></Redirect>
                  </Switch>
                ) : (
                  <Redirect to="/"></Redirect>
                )}
                <Redirect to="/"></Redirect>
              </Switch>
            </Suspense>
          </MainContainter>
        </>
      )}
    </div>
  );
}

export default App;
