"use client"
import { ChangeEvent, ToggleEvent} from 'react';
import Form from 'react-bootstrap/Form';

export default function GymsMenu() {

  function onActivated(e: ChangeEvent<HTMLInputElement> ) {
   // e.preventDefault();

    if (e?.currentTarget?.checked == true) {
      
    }
  }
  return (

    <div className="d-flex flex-column justify-content-start w-100 h-50 page-part">
      <div>
        <h2 className="text-secondary">Gyms management</h2>
      </div>
      <div>
        <hr />
      </div>
      <div>
        <div className="form-check form-switch">
          <Form.Control className="form-check-input" type="checkbox" role="switch" name="includeDeactivate"
            id="flexSwitchCheckChecked" onChange={onActivated}/>
          <label className="text-primary">Include deactivated</label>
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
/* <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>*/ 