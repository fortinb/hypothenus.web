"use client"

import { useSelector } from "react-redux";
import { GymsPagingState } from "../../store/slices/gymsPagingSlice";
import Button from "react-bootstrap/esm/Button";

export default function PagingNavigation() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging?.value);
    
  return (
    <div >
      <div className="d-flex flex-row justify-content-between text-secondary fw-bold pe-3">
      <div>
          <Button className="ms-0" type="button" variant="primary"><i className="bi bi-skip-start me-2" />First page</Button>
        </div>
        <div className="me-4">
          <Button className="ms-2" type="button" variant="primary"><i className="bi bi-rewind-btn me-2" />Previous page</Button>
          <Button className="ms-2" type="button" variant="primary">Next page<i className="bi bi-fast-forward-btn ms-2" /></Button>
        </div>
        
      </div>
    </div>
  );
}
