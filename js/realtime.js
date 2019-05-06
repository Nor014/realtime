const ctx = document.getElementById('chart').getContext('2d');
const realtime = new Chart(ctx).Bar({
  labels: [],
  datasets: [{
    fillColor: 'rgba(0,60,100,1)',
    strokeColor: 'black',
    data: []
  }]
}, {
    responsive: true,
    barValueSpacing: 2
  });

let isFirst = true;
const ws = new WebSocket('wss://neto-api.herokuapp.com/realtime');
ws.addEventListener('message', event => {

  if (isFirst) {
    let dataParse = JSON.parse(event.data);

    let dataTime = [];
    let dataOnline = [];
    
    dataParse.forEach(el => {
      dataOnline.push(el.online)
      dataTime.push(el.time)
    })

    for (let i = dataTime.length - 1; i >= 0; i--) {
      realtime.addData([dataOnline[i]], dataTime[i])
    }
    // event.data
    //   .split('\n')
    //   .map(line => line.split('|'))
    //   .forEach(data => {
    //     realtime.addData([Number(data[1])], data[0])
    //     console.log([Number(data[1])], data[0])
    //   });

    isFirst = false;
  } else {
    // const [label, data] = event.data.split('|');
    // console.log([label, data])

    const currentData = JSON.parse(event.data);
    realtime.removeData();
    realtime.addData([currentData.online], currentData.time);
  }
});
