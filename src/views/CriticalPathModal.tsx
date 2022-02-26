import { ReactChild, ReactFragment, ReactPortal } from "react";
import { Button, Modal } from "react-bootstrap";
interface CriticalPathProps {
    children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
    show: boolean;
    handleClose(): void;
    activeNode: string;
}
function CriticalPathModal(props: CriticalPathProps) {
    return (
      <>
        <Modal size="xl" show={props.show} onHide={props.handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Critical Path for {props.activeNode}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div style={{ height: '700px', width: '1000px' }}>
                {props.children}
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

export default CriticalPathModal;

