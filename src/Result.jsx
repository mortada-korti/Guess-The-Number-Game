import React from "react";

const Result = ({ result }) => {
  return (
    <div className="result">
      {result.map((e) => (
        <div className={e.status} key={e.value}>
          {e.value}
        </div>
      ))}
    </div>
  );
};

export default Result;
