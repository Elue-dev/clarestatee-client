import { RiWifiOffLine } from "react-icons/ri";
import styles from "./offlinePage.module.scss";

export default function OfflinePage() {
  return (
    <div className={styles.offline}>
      <RiWifiOffLine className={styles.icon} />
      <h1>Seems your network is lost.</h1>
      <p>
        <b>
          You would be able to access Clarestate once your network connection is
          restored.
        </b>
      </p>
    </div>
  );
}
