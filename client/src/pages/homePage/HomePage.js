import React from "react";
import PostCard from "../../components/post-component/PostCard";
import PaginationBar from "../../components/sub-components/PaginationBar";
import classes from "./HomePage.module.css";
import { FaSearch } from "react-icons/fa";
function HomePage() {
  return (
    <div className={classes["container"]}>
      <div className={classes["homePage-config"]}>
        <div className={classes["search-div"]}>
          <input type="text" name="text" placeholder="search" />
          <button>
            <FaSearch />
          </button>
        </div>
        <div className={classes["order-div"]}>
          <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <select name="cars" id="cars">
            <option value="volvo">desc</option>
            <option value="saab">asc</option>
          </select>
        </div>
        <div>
        <select name="cars" id="cars">
            <option value="volvo">12</option>
            <option value="saab">24</option>
          </select>
        </div>
      </div>
      <div className={classes["card-container"]}>
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
      <PaginationBar
        page={1}
        change={() => {}}
        total={20}
        pageSize={10}
      ></PaginationBar>
    </div>
  );
}

export default HomePage;
