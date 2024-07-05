"use client"

import { ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import { GymsPagingState, includeInactive } from '../lib/store/slices/gymsPagingSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../lib/hooks/useStore';

export default function GymsMenu() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging);
  const dispatch = useAppDispatch();
  
  function onIncludeDeactivated(e: ChangeEvent<HTMLInputElement> ) {
    dispatch(includeInactive(e.currentTarget.checked));
  }

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-part">
      <div>
        <h2 className="text-secondary">Gyms</h2>
      </div>
      <div>
        <hr />
      </div>
      <div className="d-flex flex-row justify-content-end pb-2">
        <div className="form-check form-switch">
          <Form.Control className="form-check-input form-check-input-lg" type="checkbox" role="switch" name="includeDeactivate"
            id="flexSwitchCheckChecked" onChange={onIncludeDeactivated} defaultChecked={false} />
          <label className="text-primary ps-2" htmlFor="flexSwitchCheckChecked">Include inactive</label>
        </div>
      </div>
      <div className="row flex-fill">
        <div className="col-6 border">
        </div>
        <div className="col-6 border">
        </div>
      </div>
    </div>
  );
}
