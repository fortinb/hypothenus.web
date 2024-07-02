"use client"

export default function Loader() {
    
  return (
      <div className="d-flex flex-row justify-content-center text-secondary fw-bold pe-3">
        <div>
          <span className="text-secondary"><i className="spinner-border bi bi-triangle m-3"></i>Loading....</span>
        </div>
      </div>
  );
}
