import React from "react";
import { BsFillSkipBackwardFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function GoBack() {
  const navigate = useNavigate();

  return (
    <div className="go__back">
      <p onClick={() => navigate(-1)}>
        <BsFillSkipBackwardFill />
      </p>
    </div>
  );
}
