
import GymsListPaging from "./gyms-list-paging";


export default function Gyms() {

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-50 h-100 ">
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <GymsListPaging />
      </div>
    </div>
  );
}

