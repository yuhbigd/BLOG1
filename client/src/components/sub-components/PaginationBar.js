import React, { useEffect, useRef } from "react";
import Pagination from "rc-pagination";
import "./PaginationBar.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function PaginationBar(props) {
  const inputRef = useRef();
  useEffect(() => {
    const pagination_next = document.querySelector(".rc-pagination-next");
    const pagination_prev = document.querySelector(".rc-pagination-prev");
    const threeNextPages = document.querySelector(".rc-pagination-jump-next");
    const threePreviousPages = document.querySelector(
      ".rc-pagination-jump-prev",
    );
    if (pagination_next) {
      pagination_next.title = "next";
    }
    if (pagination_prev) {
      pagination_prev.title = "previous";
    }
    if (threeNextPages) {
      threeNextPages.removeAttribute("title");
    }
    if (threePreviousPages) {
      threePreviousPages.removeAttribute("title");
    }
  }, [props.page]);
  return (
    <div className={"pagination-container"}>
      {props.total > props.pageSize && (
        <Pagination
          defaultPageSize={props.pageSize}
          defaultCurrent={1}
          current={props.page}
          onChange={props.change}
          total={props.total}
          nextIcon={
            <FaAngleRight className={`custom-icon-next`}></FaAngleRight>
          }
          showLessItems
          prevIcon={<FaAngleLeft className={`custom-icon-prev`}></FaAngleLeft>}
          jumpPrevIcon="..."
          jumpNextIcon="..."
          hideOnSinglePage
          className={"pagination"}
        />
      )}
      {props.total > props.pageSize && (
        <div className="input-container">
          <input
            type="number"
            min="1"
            max={props.total}
            name="Page"
            id="pagination-page"
            placeholder=" "
            ref={inputRef}
          />
          <label htmlFor="pagination-page">Go to page</label>
          <button
            onClick={() => {
              let page = inputRef.current.value;
              if (page) {
                page = parseInt(page);
              }
              props.change(parseInt(page));
            }}
          >
            <FaAngleRight></FaAngleRight>
          </button>
        </div>
      )}
    </div>
  );
}
