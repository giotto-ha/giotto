import { utcToZonedTime, format } from "date-fns-tz";

interface TimeReportMessage {
    type: "TimeReport",
    thingId: string,
}
interface OutboundMessage extends TimeReportMessage {
  epoch: number;
  datetime: string;
  timezone: string;
}

const outboundStream = process.stdout;
const inboundStream = process.stdin;

const TZ = {
    _tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    get tz() {
        return this._tz;
    },
    set tz(tz) {
        this._tz = tz;
    }
}

setImmediate(() => {
inboundStream.on("data", (data) => {
  try {
    const message = JSON.parse(data.toString());
    switch (message.type) {
      case "ConfigReport":
        console.info(`Got config report: ${JSON.stringify(message)}`);
        TZ.tz = message.timezone;
        break;
      default:
        console.warn(`Got bad message: ${data.toString()}`);
    }
  } catch (error) {
    console.warn(`Got bad message: ${data.toString()}`);
  }
});
});

setInterval(() => {
  const epoch = Date.now();
  const timeZone = TZ.tz;
  const datetime = format(utcToZonedTime(epoch, timeZone), "yyyyMMddHHmmss", {
    timeZone,
  });

  const message: OutboundMessage = {
    type: "TimeReport",
    thingId: "timekeeper",
    epoch,
    datetime,
    timezone: timeZone,
  };

  outboundStream.write(JSON.stringify(message));
}, 1000);

console.log(`Timekeeper running as PID ${process.pid} in ${TZ.tz} timezone`);
