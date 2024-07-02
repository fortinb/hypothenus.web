"use client";

export default function GymListDetailLoading({ key }: { key: number }) {

  return (
    <div className="col-6 mb-2">
      <div className="card border-2">
        <div className="col-12 d-flex flex-column flex-nowrap">
        <div className="animate-opacity-for-pending">
          <div className="card card-body m-2">
            <h5 className="card-title bg-gradient-pending-text">
              Gym
            </h5>
            <p className="invisible-text">
              <span className="text-primary">city</span>
            </p>
          </div>
          <div className="card-footer invisible-text">
            <span>gym@email.com</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}