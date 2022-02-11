import React, {useState} from 'react';
import { Modal, Button } from 'antd';

const BuySellModal = (props) => {
    
    const [visible, setVisible] = useState(false);

    return (
      <>
        <Button type={props.buttonType} onClick={() => setVisible(true)}>
          {props.title}
        </Button>
        <Modal
          title={`${props.title} ${props.name}`}
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          width={1000}
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>
      </>
    )

}

export default BuySellModal
