import React, { useState } from "react";
import ChangeAvatar from "../components/account-components/ChangeAvatar";

function Account() {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const hideAvatarModalHandler = () => {
    setShowAvatarModal(false);
  };
  const showAvatarModalHandler = () => {
    setShowAvatarModal(true);
  };

  
  return (
    <div>
      <button onClick={showAvatarModalHandler} >open</button>
      {showAvatarModal && (
        <ChangeAvatar clickHandle={hideAvatarModalHandler}></ChangeAvatar>
      )}
    </div>
  );
}

export default Account;
