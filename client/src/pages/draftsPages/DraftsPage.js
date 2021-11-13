import React, { useEffect, useState, useReducer, useRef } from "react";
import DraftCard from "../../components/draft-components/DraftCard";
import classes from "./DraftPage.module.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PaginationBar from "../../components/sub-components/PaginationBar";
import useHttp from "../../custom-hooks/use-http";
import { deleteDraft, getDrafts, getNumberOfDrafts } from "../../api/draftsApi";
import { useMountedState } from "react-use";
import { useUpdateEffect } from "react-use";
const draftsReducerCase = {
  changePage: "changePage",
  setData: "setData",
  removeDraft: "removeDraft",
  setNumPerPage: "setNumPerPage",
  setNumberOfDrafts: "setNumberOfDrafts",
};
function draftsReducer(state, action) {
  switch (action.type) {
    case draftsReducerCase.changePage:
      return {
        ...state,
        pageNumber: action.pageNumber,
      };
    case draftsReducerCase.setData:
      return {
        ...state,
        data: action.data,
      };
    case draftsReducerCase.removeDraft:
      let data = [...state.data];
      data = data.filter((draft) => {
        return draft._id !== action._id;
      });
      return {
        ...state,
        data: data,
        numberOfDrafts: state.numberOfDrafts - 1,
      };
    case draftsReducerCase.setNumPerPage:
      return {
        ...state,
        numPerPage: action.numPerPage,
      };
    case draftsReducerCase.setNumberOfDrafts:
      return {
        ...state,
        numberOfDrafts: action.numberOfDrafts,
      };
  }
  return state;
}

function DraftsPage() {
  // If onDelete = true -> delete draft function will be ignored -> wait until no draft is being deleted
  const [onDelete, setOnDelete] = useState(false);
  // run only the first time after component mount
  const isFirstTime = useRef(true);
  const isComponentMount = useMountedState();
  const {
    sendRequest: getDraftsFromServer,
    status: getDraftsStatus,
    data: allDraftsFromServer,
    error: DraftsError,
  } = useHttp(getDrafts);
  const { sendRequest: deleteDraftFromServer } = useHttp(deleteDraft);
  const [draftsData, dispatchDrafts] = useReducer(draftsReducer, {
    data: [],
    pageNumber: 1,
    numPerPage: 10,
    numberOfDrafts: 0,
  });
  // if component is mounted
  useEffect(() => {
    (async () => {
      //get and set number of draft
      const number = await getNumberOfDrafts();
      if (isComponentMount()) {
        dispatchDrafts({
          type: draftsReducerCase.setNumberOfDrafts,
          numberOfDrafts: number.count,
        });
      }
    })();
  }, []);
  // get draft data if page or num per page is changed
  useUpdateEffect(() => {
    getDraftsFromServer({
      pageNum: draftsData.pageNumber,
      numPerPage: draftsData.numPerPage,
    });
  }, [draftsData.pageNumber, draftsData.numPerPage]);
  // get data on component mount and when user deleted draft
  useUpdateEffect(() => {
    if (isFirstTime.current) {
      getDraftsFromServer({
        pageNum: draftsData.pageNumber,
        numPerPage: draftsData.numPerPage,
      });
      isFirstTime.current = false;
    } else {
      setOnDelete(true);
      window.setTimeout(() => {
        updateDataOnDelete();
      }, 500);
    }
  }, [draftsData.numberOfDrafts]);
  //change page and delete all the data to create new data
  function changePage(page) {
    dispatchDrafts({ type: draftsReducerCase.changePage, pageNumber: page });
    dispatchDrafts({ type: draftsReducerCase.setData, data: [] });
  }

  function updateDataOnDelete() {
    if (isComponentMount()) {
      if (draftsData.data.length > 0) {
        //change page but not delete all the data -> not create blank page
        getDraftsFromServer({
          pageNum: draftsData.pageNumber,
          numPerPage: draftsData.numPerPage,
        });
      } else {
        if (draftsData.pageNumber > 1 && isComponentMount()) {
          dispatchDrafts({
            type: draftsReducerCase.changePage,
            pageNumber: draftsData.pageNumber - 1,
          });
        }
      }
    }
  }
  //set data when server response
  useEffect(() => {
    if (getDraftsStatus === "completed" && !DraftsError) {
      if (isComponentMount()) {
        dispatchDrafts({
          type: draftsReducerCase.setData,
          data: allDraftsFromServer.drafts,
        });
        setOnDelete(false);
      }
    }
  }, [allDraftsFromServer, getDraftsStatus, DraftsError]);

  return (
    <div className={classes["draft-page"]}>
      <TransitionGroup className={classes.container}>
        {draftsData.data.map((item) => {
          return (
            <CSSTransition
              key={item._id}
              timeout={500}
              classNames={{
                enter: classes["item-enter"],
                enterActive: classes["item-enter-active"],
                exit: classes["item-exit"],
                exitActive: classes["item-exit-active"],
              }}
            >
              <DraftCard
                name={item.name}
                key={item._id}
                close={async () => {
                  if (!onDelete) {
                    await deleteDraftFromServer(item._id);
                    if (isComponentMount()) {
                      dispatchDrafts({
                        type: draftsReducerCase.removeDraft,
                        _id: item._id,
                      });
                    }
                  }
                }}
              ></DraftCard>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <PaginationBar
        page={draftsData.pageNumber}
        change={changePage}
        total={draftsData.numberOfDrafts}
        pageSize={draftsData.numPerPage}
      ></PaginationBar>
    </div>
  );
}

export default DraftsPage;
