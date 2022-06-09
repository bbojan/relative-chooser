import { useMemo, useState } from "react";
import "./App.css";

function initials() {
  const count = 6;
  const toCount = 5;

  const kinds = ["day", "week", "month", "quarter", "year"];
  const kind = "month";
  const toKind = "month";

  const mainOptions = [
    "All",
    `The $[kind] $[count] $[kind]s ago`,
    `From $[count] $[kind]s ago till today`,
    `From $[count] $[kind]s ago to $[toCount] $[kind]s ago`,
  ];
  const main = 0;

  const secondaryOptions = ["All", "The", "From"];
  const secondary = secondaryOptions[0];

  const thirdOptions = ["till today", "to"];
  const third = thirdOptions[0];

  const mx = 10;

  const maxes = {
    day: mx * 365,
    week: mx * 52,
    month: mx * 12,
    quarter: mx * 4,
    year: mx,
  };

  return {
    kinds,
    kind,
    toKind,
    count,
    toCount,
    mainOptions,
    main,
    secondaryOptions,
    secondary,
    thirdOptions,
    third,
    maxes,
  };
}

export default function Chooser() {
  const initialized = useMemo(initials, []);
  const { mainOptions, secondaryOptions, thirdOptions, kinds, maxes } =
    initialized;

  const [kind, setKind] = useState(initialized.kind);
  const [toKind, setToKind] = useState(initialized.toKind);

  const [main, setMain] = useState(initialized.main);
  const [secondary, setSecondary] = useState(initialized.secondary);
  const [third, setThird] = useState(initialized.third);

  const [count, setCount] = useState(initialized.count);
  const [toCount, setToCount] = useState(initialized.toCount);

  const cMax = useMemo(() => {
    return (maxes as any)[kind] as number;
  }, [kind, maxes]);

  const cMin = main === 3 ? 1 : 0;

  return (
    <div>
      <div>Choose Relative Time</div>
      <div>
        {main === 0 && (
          <div>
            <select
              value={main}
              onChange={(e) => {
                const val = +e.target.value;
                setMain(val);

                const sec = secondaryOptions[Math.min(2, val)];
                setSecondary(sec);

                const thr =
                  val === 3
                    ? thirdOptions[1]
                    : val === 2
                    ? thirdOptions[0]
                    : third;
                setThird(thr);
              }}
              style={{ margin: 6 }}
            >
              {mainOptions.map((o, i) => {
                const opt = o
                  .replaceAll("$[kind]", kind)
                  .replaceAll("$[count]", count.toFixed())
                  .replaceAll("$[toCount]", toCount.toFixed());

                return (
                  <option key={i} value={i}>
                    {opt}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        {/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/}
        {main >= 1 && (
          <div>
            <select
              value={secondary}
              onChange={(e) => {
                const val = e.target.value;
                setSecondary(val);
                if (val === mainOptions[initialized.main]) {
                  setMain(initialized.main);
                }
                if (val === secondaryOptions[1]) {
                  setMain(1);
                }
                if (val === secondaryOptions[2]) {
                  const m = third === initialized.third ? 2 : 3;
                  setMain(m);
                }
              }}
              style={{ margin: 6 }}
            >
              {secondaryOptions.map((o, i) => (
                <option key={i} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {main === 1 && <span style={{ margin: 6 }}>{kind}</span>}
            <input
              value={count}
              onChange={(e) => {
                const val = +e.target.value;
                const v = Math.max(cMin, Math.min(val, cMax));
                setCount(v);
                //
                const to = Math.max(0, Math.min(toCount, v - 1));
                setToCount(to);
              }}
              type="number"
              min={cMin}
              max={cMax}
              style={{ margin: 6 }}
            />
            <select
              value={kind}
              onChange={(e) => {
                const val = e.target.value;
                setKind(val);
              }}
              style={{ margin: 6 }}
            >
              {kinds.map((o, i) => (
                <option key={i} value={o}>
                  {`${o}s`}
                </option>
              ))}
            </select>
            <span style={{ margin: 6 }}>ago</span>
            {(main === 2 || main === 3) && (
              <select
                value={third}
                onChange={(e) => {
                  const val = e.target.value;
                  setThird(val);

                  const m = val === initialized.third ? 2 : 3;

                  setMain(m);
                }}
                style={{ margin: 6 }}
              >
                {thirdOptions.map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}
            {main === 3 && (
              <>
                <input
                  value={toCount}
                  onChange={(e) => {
                    const val = +e.target.value;
                    const v = Math.max(0, Math.min(val, cMax - 1));
                    setToCount(v);
                    //
                    const from = Math.min(cMax, Math.max(v + 1, count));
                    setCount(from);
                  }}
                  type="number"
                  min={0}
                  max={cMax}
                  style={{ margin: 6 }}
                />
                <select
                  value={toKind}
                  onChange={(e) => {
                    const val = e.target.value;
                    setToKind(val);
                  }}
                  style={{ margin: 6 }}
                >
                  {kinds.map((o, i) => (
                    <option key={i} value={o}>
                      {`${o}s`}
                    </option>
                  ))}
                </select>
                <span style={{ margin: 6 }}>ago</span>
              </>
            )}
          </div>
        )}
        {/*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/}
      </div>
    </div>
  );
}
