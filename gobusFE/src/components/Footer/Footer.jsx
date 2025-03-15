import {
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled,
  XOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import "./style.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="upper-footer">
        <div className="footer-links">
          <a href="#" className="footer-link">
            T & C
          </a>
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <a href="#" className="footer-link">
            Contact Us
          </a>
        </div>
        <div className="footer-social-icons">
          <FacebookFilled className="footer-social-icon" />
          <XOutlined className="footer-social-icon" />
          <InstagramOutlined className="footer-social-icon" />
          <LinkedinFilled className="footer-social-icon" />
          <YoutubeFilled className="footer-social-icon" />
        </div>
      </div>
      <div className="hrline-footer"></div>
      <div className="lower-footer">
        <p>
          © 2025 - GoBus Digital Mobility Solutions Limited. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
