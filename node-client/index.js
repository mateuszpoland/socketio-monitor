// Ten program zbiera lokalne dane o performance - program bedzie działał na maszynach, które będą udostępniały jakieś dane
// program nastepnie bedzie wysyłał te dane do SERWERA socket.io

// Co potrzebujemy wiedzieć ? (np. jakie dane powinny udostępniać sensory)
// 1. CPU load
// 2. zuzycie pamieci (memory usage)
// 3. total memory
// 4. free memory
// 5. operating system
// 6. time online
// 7. info about processor: type, no o f cores, clock speed

const os = require('os');
// ten program bedzie działał jako klient socket-io i udostępniał dane workerowi

const performanceData = async () => {
    return new Promise(async (resolve, reject) => {
        const osType = (os.type() == 'Darwin') ? 'MacOS' : os.type();
        const cpus = os.cpus();

        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();
        const upTime = os.uptime();

        const usedMemory = totalMemory - freeMemory;
        const memUsage = Math.floor(usedMemory / totalMemory * 100) / 100

        // CPU info
        const CPUModel = cpus[0].model;
        const cpuSpeed = cpus[0].speed;
        const numCores = cpus.length;
        const cpuLoad = await getCPULoad(numCores);

        resolve({
            osType,
            freeMemory,
            totalMemory,
            upTime,
            usedMemory,
            memUsage,
            CPUModel,
            cpuSpeed,
            numCores,
            cpuLoad
        });
    });
}


//compute real-time cpu load
// need avg of all cores
const cpuAverage = (numCores) => {
    const cpus = os.cpus();
    // get ms in each mode - but this number is since reboot
    // so get it now and next in 100ms and compare
    let idleMs = 0;
    let totalMs = 0;
    // loopt throug each core
    cpus.forEach((core) => {
        //loop through each property of current core
        for(type in core.times) {
            totalMs += core.times[type];
        }
        idleMs += core.times.idle;
    });

    return {
        idle: idleMs / numCores,
        total: totalMs / numCores
    }
}

// times is time since boot
const getCPULoad = (numCores) => {
    return new Promise((resolve, reject) => {
        const start = cpuAverage(numCores);
        setTimeout(() => {
            const end = cpuAverage(numCores);
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;

            //calc % of used CPU
            const percentUsed = 100 - Math.floor(100 * idleDifference / totalDifference);
            console.log('% usage : ' + percentUsed);
            resolve(percentUsed);
        }, 100)
    });
}
//let x = cpuAverage();
//console.log(x);

performanceData().then((allPerformanceMeasures) => {
   console.log(allPerformanceMeasures);
});

const io = require('socket.io-client');
// połączenie socketowe do socket serwera
//const socket = io(process.env.NODE_SOCKET_BACKEND);
const socket = io('http://node-server:8181');
socket.on('connect', (socket) => {
});
