import React, { useEffect, useState, useReducer, useRef } from "react";
import DraftCard from "../../components/draft-components/DraftCard";
import classes from "./DraftPage.module.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PaginationBar from "../../components/sub-components/PaginationBar";
import useHttp from "../../custom-hooks/use-http";
import { deleteDraft, getDrafts, getNumberOfDrafts } from "../../api/draftsApi";
import { useMountedState } from "react-use";
import { useUpdateEffect } from "react-use";
import { useHistory, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { removeImagesRedundancy } from "../../api/editorApi";
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
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function redundantImage(content, thumbnailImg) {
  let imageArray = content
    .filter((item) => {
      if (item.type === "image") {
        return true;
      }
    })
    .map((item) => {
      return item.attrs.src;
    })
    .filter((item) => {
      return item.includes(process.env.REACT_APP_STORAGE_URL, 0);
    });
  if (thumbnailImg !== "") {
    if (thumbnailImg.includes(process.env.REACT_APP_STORAGE_URL, 0)) {
      imageArray.push(thumbnailImg);
    }
  }
  imageArray = imageArray.map((item) => {
    return item.split(process.env.REACT_APP_STORAGE_URL)[1];
  });
  return imageArray;
}
function DraftsPage() {
  let query = useQuery();
  const searchInput = useRef();
  const history = useHistory();
  const isChangeQuery = useRef(false);
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
  const { sendRequest: deleteDraftFromServer, data: deletedDraftFromServer } =
    useHttp(deleteDraft);

  const {
    sendRequest: deleteRedundantImage,
    status: deleteRedundantImageStatus,
    data: deleteRedundantImageData,
    error: deleteRedundantImageError,
  } = useHttp(removeImagesRedundancy);
  useUpdateEffect(() => {
    if (isComponentMount()) {
      let images = redundantImage(
        deletedDraftFromServer.draft.contentJson.content,
        deletedDraftFromServer.draft.thumbnailImage,
      );
      deleteRedundantImage({ images: images });
    }
  }, [deletedDraftFromServer]);
  const [draftsData, dispatchDrafts] = useReducer(draftsReducer, {
    data: [],
    pageNumber: 1,
    numPerPage: 10,
    numberOfDrafts: 0,
  });
  // if component is mounted
  useEffect(() => {
    searchInput.current.value = query.get("search");
    (async () => {
      //get and set number of draft
      const number = await getNumberOfDrafts(query.get("search"));
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
    if (draftsData.numberOfDrafts > 0) {
      getDraftsFromServer({
        pageNum: draftsData.pageNumber,
        numPerPage: draftsData.numPerPage,
        searchString: query.get("search"),
      });
    }
  }, [draftsData.pageNumber, draftsData.numPerPage]);
  // get data on component mount and when user deleted draft
  useUpdateEffect(() => {
    if (isFirstTime.current && draftsData.numberOfDrafts > 0) {
      getDraftsFromServer({
        pageNum: draftsData.pageNumber,
        numPerPage: draftsData.numPerPage,
        searchString: query.get("search"),
      });
      isFirstTime.current = false;
    } else {
      if (!isChangeQuery.current) {
        setOnDelete(true);
        window.setTimeout(() => {
          updateDataOnDelete();
        }, 500);
      }
    }
  }, [draftsData.numberOfDrafts]);

  useUpdateEffect(() => {
    // update data on search
    (async () => {
      //get and set number of draft
      const number = await getNumberOfDrafts(query.get("search"));
      if (isComponentMount()) {
        isChangeQuery.current = true;
        dispatchDrafts({
          type: draftsReducerCase.setNumberOfDrafts,
          numberOfDrafts: number.count,
        });
        if (number.count > 0) {
          if (draftsData.pageNumber !== 1) {
            changePage(1);
          } else {
            dispatchDrafts({ type: draftsReducerCase.setData, data: [] });
            getDraftsFromServer({
              pageNum: 1,
              numPerPage: draftsData.numPerPage,
              searchString: query.get("search"),
            });
          }
        } else {
          changePage(1);
        }
      }
    })();
  }, [query.get("search")]);
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
          searchString: query.get("search"),
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
        isChangeQuery.current = false;
      }
    }
  }, [allDraftsFromServer, getDraftsStatus, DraftsError]);

  return (
    <div className={classes["draft-page"]}>
      <TransitionGroup className={classes.container}>
        <div>
          <input
            type="text"
            name="text"
            ref={searchInput}
            placeholder="search"
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                if (searchInput.current.value !== "") {
                  history.replace(
                    `/drafts?search=${searchInput.current.value}`,
                  );
                } else {
                  history.replace(`/drafts`);
                }
              }
            }}
          />
          <button
            onClick={() => {
              if (searchInput.current.value !== "") {
                history.replace(`/drafts?search=${searchInput.current.value}`);
              } else {
                history.replace(`/drafts`);
              }
            }}
          >
            <FaSearch />
          </button>
        </div>
        {draftsData.data.map((item) => {
          return (
            <CSSTransition
              key={item._id}
              timeout={300}
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
                id={item._id}
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
      {draftsData.numberOfDrafts === 0 && (
        <p
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {"Can not find any drafts!"}
        </p>
      )}
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
