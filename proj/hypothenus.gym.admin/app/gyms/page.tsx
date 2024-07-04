
import GymsListPaging from "./gyms-list-paging";
import GymsMenu from "./gyms-menu";


export default function Gyms() {

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 me-3">
        <GymsMenu />
      </div>
      <div className="d-flex flex-column justify-content-between w-75 h-100">
        <GymsListPaging />
      </div>
    </div>
  );
}

