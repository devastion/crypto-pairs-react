import React from "react";
import axios from "axios";
import { Card, Title, LineChart } from "@tremor/react";
import { Button } from "@tremor/react";

const chartdata = [
  {
    year: 1970,
    "Export Growth Rate": 2.04,
    "Import Growth Rate": 1.53,
  },
  {
    year: 1971,
    "Export Growth Rate": 1.96,
    "Import Growth Rate": 1.58,
  },
  {
    year: 1972,
    "Export Growth Rate": 1.96,
    "Import Growth Rate": 1.61,
  },
  {
    year: 1973,
    "Export Growth Rate": 1.93,
    "Import Growth Rate": 1.61,
  },
  {
    year: 1974,
    "Export Growth Rate": 1.88,
    "Import Growth Rate": 1.67,
  },
  //...
];

const dataFormatter = (number: number) => `${number / 1000}k`;

export function Chart() {
  const [data, setData]: any[] = React.useState<any[]>();
  const [title, setTitle] = React.useState("BTC/USD");
  const [req, setReq] = React.useState("btcusd");
  const [oneYear, setOneYear] = React.useState(true);
  const [halfYear, setHalfYear] = React.useState(false);
  const [lastWeek, setLastWeek] = React.useState(false);

  React.useEffect(() => {
    axios
      .get(`http://localhost:3000/${req}`)
      .then((response) => response.data)
      .then((data) => {
        if (oneYear) {
          for (const el of data) {
            const d = new Date(el["time"]);
            const a = new Date();
            console.log(a > d);
            el["time"] = el["time"].slice(0, 10);
            el["prediction"] = el["price"].replace(el["price"][0], 3);
          }
          setData(data);
        }
        if (halfYear) {
          const sixMonthsAgo = new Date();
          for (const el of data) {
            el["prediction"] = el["price"].replace(el["price"][0], 3);
          }
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          const filter = data.filter((el: any) => new Date(el["time"]) > sixMonthsAgo);

          setData(filter);
        }

        if (lastWeek) {
          const sevenDaysAgo = new Date();
          for (const el of data) {
            el["prediction"] = el["price"].replace(el["price"][0], 3);
          }
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const filter = data.filter((el: any) => new Date(el["time"]) > sevenDaysAgo);

          setData(filter);
        }
      });
  }, [lastWeek, oneYear, req]);

  function handleClick(t: string, r: string) {
    setTitle(t);
    setReq(r);
  }

  return (
    <>
      <Card>
        <Title>{title}</Title>
        <LineChart className="mt-6" data={data} index="time" categories={["price", "prediction"]} colors={["emerald", "fuchsia"]} yAxisWidth={40} />
      </Card>
      <div className="flex gap-10">
        <Button size="md" className="mt-10" onClick={() => handleClick("BTC/USD", "btcusd")}>
          BTC/USD
        </Button>
        <Button size="md" className="mt-10" onClick={() => handleClick("ETH/USD", "ethusd")}>
          ETH/USD
        </Button>
        <Button
          size="md"
          className="mt-10"
          onClick={() => {
            setOneYear(true);
            setHalfYear(false);
            setLastWeek(false);
          }}>
          1 YEAR
        </Button>
        <Button
          size="md"
          className="mt-10"
          onClick={() => {
            setHalfYear(true);
            setLastWeek(false);
            setOneYear(false);
          }}>
          Half Year
        </Button>
        <Button
          size="md"
          className="mt-10"
          onClick={() => {
            setLastWeek(true);
            setOneYear(false);
            setHalfYear(false);
          }}>
          Last Week
        </Button>
      </div>
    </>
  );
}
