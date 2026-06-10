import { useEffect, useState } from "react";

export function useContent(name, fallback = null) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    let alive = true;
    fetch(`/content/${name}.json`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setData(d);
      })
      .catch(() => {
        if (alive) setData(fallback);
      });
    return () => {
      alive = false;
    };
  }, [name]);

  return data;
}
