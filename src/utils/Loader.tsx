import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

export default function Loader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="loader">
      {loading && <PulseLoader color={"#000"} loading={loading} size={15} />}
    </div>
  );
}
