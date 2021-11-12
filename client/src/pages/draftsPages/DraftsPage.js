import React, { useEffect, useState, useReducer } from "react";
import DraftCard from "../../components/draft-components/DraftCard";
import classes from "./DraftPage.module.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PaginationBar from "../../components/sub-components/PaginationBar";
function DraftsPage() {
  const [items, setItems] = useState([
    { id: 1, text: "Buy eggs" },
    { id: 2, text: "Pay bills" },
    { id: 3, text: "Invite friends over" },
    { id: 4, text: "Fix the TV" },
  ]);
  const [page, setPage] = useState(1);
  console.log(page);
  function change(pages) {
    setPage(pages);
  }
  return (
    <>
      <TransitionGroup className={classes.container}>
        {items.map(({ id, text }) => (
          <CSSTransition
            key={id}
            timeout={500}
            classNames={{
              enter: classes["item-enter"],
              enterActive: classes["item-enter-active"],
              exit: classes["item-exit"],
              exitActive: classes["item-exit-active"],
            }}
          >
            <DraftCard
              name={text}
              key={id}
              close={() =>
                setItems((items) => {
                  return items.filter((item) => {
                    return item.id !== id;
                  });
                })
              }
            ></DraftCard>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <PaginationBar
        page={page}
        change={change}
        total={7000}
        pageSize={10}
      ></PaginationBar>
    </>
  );
}

export default DraftsPage;
