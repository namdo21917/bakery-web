import {Container} from "react-bootstrap";

import gray from "../assets/grayLogo.svg";
import {Facebook, Instagram, Mailbox, MapPinned, Phone} from "lucide-react";

function Footer() {
    return (
        <>
            <div
                className="mt-5 footer"
                style={{
                    backgroundColor: "#e4bda3",
                }}
            >
                <Container className="pt-3 pb-3">
                    <img src={gray} alt="Logo" width="60"/>
                    <div className="d-flex text-secondary justify-content-between">
                        <div className="col-md-4">
                            <h6 className="text-secondary mt-2">
                                Thông tin liên hệ
                            </h6>
                            <p className="text-secondary mt-2 mb-1 flex align-items-center">
                                <MapPinned/>
                                &nbsp;
                                <span>
                                    {" "}
                                    Nghiêm Xuân Yêm - Đại Kim - Hoàng Mai - Hà
                                    Nội
                                </span>
                            </p>
                            <div className="mb-1 flex align-items-center" style={{color: "gray"}}>
                                <Mailbox/>
                                &nbsp;
                                <span className="text-secondary">tlufood@gmail.com</span>
                            </div>

                            <div className="mb-1 flex align-items-center" style={{color: "gray"}}>
                                <Phone/>
                                &nbsp;
                                <span> 123456789</span>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex flex-column">
                            <h6>Kết nối với chúng tôi</h6>
                            <div className="mb-auto flex align-items-center">
                                <Facebook/>
                                &nbsp;
                                <Instagram/>
                            </div>
                            <p>Copyright © Thang Long Student and Friends</p>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Footer;
