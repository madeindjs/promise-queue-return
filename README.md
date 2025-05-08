# promise-queue-return

[![npm version](https://badge.fury.io/js/promise-queue-return.svg)](https://badge.fury.io/js/promise-queue-return)

A simple plain-JavaScript promise queue that helps you to avoid rate-limiting. This one uses a handy API that returns the result of your function.

```js
import { PromiseQueue } from "promise-queue-return";

const queue = new PromiseQueue();
queue.onJobExecuted = async (job) => {
  console.log(`Executed job id=${job.id}, waiting 1s`);
  await new Promise((res) => setTimeout(res, 1_000));
};

async function fetchWeather() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m",
  );
  if (!res.ok) throw Error("API error");
  return res.json();
}

while (true) {
  const weather = await queue.add(fetchWeather);
  console.log(weather);
}
```
