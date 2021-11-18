import React, { useEffect, useState, useReducer, useRef } from "react";
import PostCard from "../../components/post-component/PostCard";
import PaginationBar from "../../components/sub-components/PaginationBar";
import classes from "./HomePage.module.css";
import { FaSearch } from "react-icons/fa";
import SelectList from "../../components/post-component/SelectList";
import { getNumberOfPosts, getPosts } from "../../api/postArticleApi";
import { useMountedState } from "react-use";
import { useUpdateEffect } from "react-use";
import { useHistory, useLocation } from "react-router-dom";
import useHttp from "../../custom-hooks/use-http";

const postsReducerCase = {
  changePage: "changePage",
  setData: "setData",
  removePost: "removePost",
  setNumPerPage: "setNumPerPage",
  setNumberOfPosts: "setNumberOfPosts",
  setSortBy: "setSortBy",
  setSortOrder: "setSortOrder",
};
function postsReducer(state, action) {
  switch (action.type) {
    case postsReducerCase.changePage:
      return {
        ...state,
        pageNumber: action.pageNumber,
      };
    case postsReducerCase.setData:
      return {
        ...state,
        data: action.data,
      };
    case postsReducerCase.setNumPerPage:
      return {
        ...state,
        numPerPage: action.numPerPage,
      };
    case postsReducerCase.setNumberOfPosts:
      return {
        ...state,
        numberOfPosts: action.numberOfPosts,
      };
    case postsReducerCase.setSortBy:
      return {
        ...state,
        sortBy: action.sortBy,
      };
    case postsReducerCase.setSortOrder:
      return {
        ...state,
        sortOrder: action.sortOrder,
      };
  }
  return state;
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function HomePage() {
  let query = useQuery();
  const searchInput = useRef();
  const history = useHistory();
  // const isChangeQuery = useRef(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const isMount = useMountedState();
  // post api
  const {
    sendRequest: getPostsFromServer,
    status: getPostsStatus,
    data: allPostsFromServer,
    error: postsError,
  } = useHttp(getPosts);
  //post reducer
  const [postsData, dispatchPosts] = useReducer(postsReducer, {
    data: [],
    pageNumber: 1,
    numPerPage: 12,
    numberOfPosts: -1,
    sortBy: "_id",
    sortOrder: "desc",
  });
  // if component is mounted
  useEffect(() => {
    searchInput.current.value = query.get("search");
    (async () => {
      //get and set number of post
      let number;
      try {
        number = await getNumberOfPosts(query.get("search"));
      } catch (err) {
        number = { count: 0 };
      }
      if (isMount()) {
        dispatchPosts({
          type: postsReducerCase.setNumberOfPosts,
          numberOfPosts: number.count,
        });
      }
    })();
  }, []);
  // get post data if page is changed
  useUpdateEffect(() => {
    if (postsData.numberOfPosts > 0) {
      getPostsFromServer({
        pageNum: postsData.pageNumber,
        numPerPage: postsData.numPerPage,
        searchString: query.get("search"),
        order: postsData.sortBy,
        direction: postsData.sortOrder,
      });
    }
  }, [postsData.pageNumber]);

  // get data on component mount
  useUpdateEffect(() => {
    if (isFirstTime && isMount()) {
      setIsFirstTime(false);
      if (postsData.numberOfPosts > 0) {
        getPostsFromServer({
          pageNum: postsData.pageNumber,
          numPerPage: postsData.numPerPage,
          searchString: query.get("search"),
          order: postsData.sortBy,
          direction: postsData.sortOrder,
        });
      }
    }
  }, [postsData.numberOfPosts]);

  useUpdateEffect(() => {
    // update data on search
    (async () => {
      //get and set number of post
      let number;
      try {
        number = await getNumberOfPosts(query.get("search"));
      } catch (err) {
        number = { count: 0 };
      }
      if (isMount()) {
        // isChangeQuery.current = true;
        dispatchPosts({
          type: postsReducerCase.setNumberOfPosts,
          numberOfPosts: number.count,
        });
        if (number.count > 0) {
          //delete data if page !=1
          if (postsData.pageNumber !== 1) {
            changePage(1);
          } else {
            dispatchPosts({ type: postsReducerCase.setData, data: [] });
            getPostsFromServer({
              pageNum: 1,
              numPerPage: postsData.numPerPage,
              searchString: query.get("search"),
              order: postsData.sortBy,
              direction: postsData.sortOrder,
            });
          }
        } else {
          changePage(1);
        }
      }
    })();
  }, [query.get("search")]);

  useUpdateEffect(() => {
    // update data on search
    (async () => {
      if (isMount()) {
        if (postsData.pageNumber !== 1) {
          changePage(1);
        } else {
          dispatchPosts({ type: postsReducerCase.setData, data: [] });
          getPostsFromServer({
            pageNum: 1,
            numPerPage: postsData.numPerPage,
            searchString: query.get("search"),
            order: postsData.sortBy,
            direction: postsData.sortOrder,
          });
        }
      } else {
        changePage(1);
      }
    })();
  }, [postsData.sortBy, postsData.sortOrder, postsData.numPerPage]);
  //change page and delete all the data to create new data
  function changePage(page) {
    dispatchPosts({ type: postsReducerCase.setData, data: [] });
    dispatchPosts({ type: postsReducerCase.changePage, pageNumber: page });
  }
  //set data when server response
  useUpdateEffect(() => {
    if (getPostsStatus === "completed" && !postsError) {
      if (isMount()) {
        dispatchPosts({
          type: postsReducerCase.setData,
          data: allPostsFromServer.articles,
        });
      }
    } else if (postsError) {
    }
  }, [allPostsFromServer, getPostsStatus, postsError]);

  function changePostConfig(postCase, prop, value) {
    let actionObj = { type: postCase };
    actionObj[prop] = value;
    dispatchPosts(actionObj);
  }
  return (
    <div className={classes["container"]}>
      <div className={classes["homePage-config"]}>
        <div className={classes["search-div"]}>
          <input
            type="text"
            name="text"
            placeholder="search"
            ref={searchInput}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                if (searchInput.current.value !== "") {
                  history.replace(`/?search=${searchInput.current.value}`);
                } else {
                  history.replace(`/`);
                }
              }
            }}
          />
          <button
            onClick={() => {
              if (searchInput.current.value !== "") {
                history.replace(`/?search=${searchInput.current.value}`);
              } else {
                history.replace(`/`);
              }
            }}
          >
            <FaSearch />
          </button>
        </div>
        <div className={classes["order-div"]}>
          <SelectList
            label={["Newest", "Day views", "Month views", "Total views"]}
            value={["_id", "dayViews", "monthViews", "totalViews"]}
            title={"sort by"}
            onChange={changePostConfig.bind(
              null,
              postsReducerCase.setSortBy,
              "sortBy",
            )}
          ></SelectList>
          <SelectList
            label={["Desc", "Asc"]}
            value={["desc", "asc"]}
            icon={true}
            title={"sort order"}
            onChange={changePostConfig.bind(
              null,
              postsReducerCase.setSortOrder,
              "sortOrder",
            )}
          ></SelectList>
          <SelectList
            label={["12", "24"]}
            value={[12, 24]}
            title={"number of article per page"}
            onChange={changePostConfig.bind(
              null,
              postsReducerCase.setNumPerPage,
              "numPerPage",
            )}
          ></SelectList>
        </div>
      </div>
      <div className={classes["card-container"]}>
        {postsData.data.map((item) => {
          return <PostCard item={item} key={item._id} id={item._id}></PostCard>;
        })}
      </div>
      {postsData.numberOfPosts === 0 && isFirstTime === false && (
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
          {"No article found!"}
        </p>
      )}
      <PaginationBar
        page={postsData.pageNumber}
        change={changePage}
        total={postsData.numberOfPosts}
        pageSize={postsData.numPerPage}
      ></PaginationBar>
    </div>
  );
}

export default HomePage;
