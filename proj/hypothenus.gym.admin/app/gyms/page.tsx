import { Suspense } from "react";
import GymsListContainer from "./gyms-list-container";
import GymsListPending from "./gyms-list-pending";

export default function Gyms() {
  return (
    <div className="container">
      <div className="full-page-border app-content-background">
           <Suspense fallback={<GymsListPending />}>
                <GymsListContainer />
              </Suspense>
      </div>
    </div>
  );
}
