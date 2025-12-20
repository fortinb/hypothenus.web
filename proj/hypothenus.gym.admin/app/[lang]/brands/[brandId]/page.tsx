import BrandForm from "./brand-form";
import BrandMenu from "./brand-menu";
import BrandResume from "./brand-resume";

export default async function Brand() {

  return (
    <div className="d-flex justify-content-between w-100 h-100">
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandMenu />
      </div>
      <div className="d-flex flex-column justify-content-between w-50 h-100">
        <BrandForm />
      </div>
      <div className="d-flex flex-column justify-content-between w-25 h-100 ms-4 me-4">
        <BrandResume />
      </div>
    </div>
  );
}
