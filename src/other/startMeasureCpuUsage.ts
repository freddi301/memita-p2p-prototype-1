import { cpus } from "os";

export function startMeasureCpuUsage() {
  const startTimeNanoSeconds = process.hrtime.bigint();
  const startCpuUsage = process.cpuUsage();
  function endMeasureCpuUsage() {
    const endTimeNanoSeconds = process.hrtime.bigint();
    const deltaTimeNanoSeconds = endTimeNanoSeconds - startTimeNanoSeconds;
    const deltaTimeMicroSeconds = Number(deltaTimeNanoSeconds / BigInt(1000));
    const deltaCpuUsage = process.cpuUsage(startCpuUsage);
    const deltaCpuTimeMicroSeconds = deltaCpuUsage.user + deltaCpuUsage.system;
    const percentage = deltaCpuTimeMicroSeconds / deltaTimeMicroSeconds / cores;
    return percentage;
  }
  return endMeasureCpuUsage;
}
const cores = cpus().length;
