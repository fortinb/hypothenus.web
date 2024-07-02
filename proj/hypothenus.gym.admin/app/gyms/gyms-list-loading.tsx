import React from "react";
import GymListDetailLoading from "./gyms-list-details-loading";

export default function GymsListLoading() {
 
  return (
      <div className="overflow-hidden h-100">
          <div className="row h-100 w-100 mt-2">
             {[1, 2, 3, 4, 5].map((id) => (
                 <GymListDetailLoading key={id} />
          ))}
        </div>
      </div>
  );
}