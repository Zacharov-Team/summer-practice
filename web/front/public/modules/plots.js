import NoneInnerTextComponent from '../components/DummyComponents/NoneInnerTextComponent.js';
import DivComponent from '../components/DummyComponents/DivComponent.js';
import { MARKERS_OCHL, TOOLS_COUNT } from './consts.js';

export function makeLinearPlot(plotData, traces) {
    let flag = true;

    if (!document.getElementById('initial-plot-div')) {
        const plotDiv = document.createElement('div');
    
        plotDiv.setAttribute('id', 'initial-plot-div');
        plotDiv.classList.add('initial-plot-div');

        document.body.appendChild(plotDiv);

        flag = false;
    }

    document.getElementById('yaxis-types')?.remove();

    const yaxis = document.createElement('div');

    yaxis.innerHTML = '';
    yaxis.setAttribute('id', 'yaxis-types');
    yaxis.classList.add('yaxis-types');

    document.body.appendChild(yaxis);

    yaxis.innerHTML = 
        new DivComponent({}, ['linear-plot-marker'], 'Open', [
            new NoneInnerTextComponent('input', {type: 'radio', name: 'type-marker', value: 'first', id: 'first-marker-button'}, ['linear-plot-marker__types-button']),
        ]).render() + 
        new DivComponent({}, ['linear-plot-marker'], 'Close', [
            new NoneInnerTextComponent('input', {type: 'radio', name: 'type-marker', value: 'last'}, ['linear-plot-marker__types-button']),
        ]).render() +
        new DivComponent({}, ['linear-plot-marker'], 'High', [
            new NoneInnerTextComponent('input', {type: 'radio', name: 'type-marker', value: 'maxes'}, ['linear-plot-marker__types-button']),
        ]).render() + 
        new DivComponent({}, ['linear-plot-marker'], 'Low', [
            new NoneInnerTextComponent('input', {type: 'radio', name: 'type-marker', value: 'mins'}, ['linear-plot-marker__types-button']),
        ]).render();

    const yMarker = {
        hours: [],
        first: [],
        last: [],
        maxes: [],
        mins: [],
    }

    for (let i = 0; i < TOOLS_COUNT; i++) {
        yMarker.first.push([]);
        yMarker.last.push([]);
        yMarker.maxes.push([]);
        yMarker.mins.push([]);
    }

    plotData.forEach((hourData) => {
        yMarker.hours.push(new Date(hourData.date));

        for (let i = 0; i < TOOLS_COUNT; i++) {
            yMarker.first[i].push(hourData.data[i * 4]);
            yMarker.last[i].push(hourData.data[i * 4 + 1]);
            yMarker.maxes[i].push(hourData.data[i * 4 + 2]);
            yMarker.mins[i].push(hourData.data[i * 4 + 3]);
        }
    });

    document.querySelectorAll('.linear-plot-marker__types-button').forEach((button) => {
        button.addEventListener('click', () => {
            renderLinearPlot(yMarker.hours, yMarker[button.value], flag, traces);
            flag = true;
        });
    });

    document.getElementById('first-marker-button').click();
}

function renderLinearPlot(xaxis, yaxis, flag, traces) {

    let data = [];

    yaxis.forEach((y, index) => {
        if (traces.includes(index)) {
            data.push({
                x: xaxis,
                y: y,
                type: 'scatter',
                name: `Tool ${index + 1}`,
                marker: {
                    size: 5,
                },
                transforms: [{
                    type: 'filter',
                    target: 'y',
                    operation: '>',
                    value: -1000
                }],
            })
        }        
    });

    let layout = {
        yaxis: {title: 'Value'},
        xaxis: {title: 'Date'},
        autosize: false,
        width: 1200,
        height: 600,
        margin: {
            pad: 4
        },
        title: 'Initial data',
    };

    if (flag) {
        Plotly.react('initial-plot-div', data, layout);
    } else {
        Plotly.newPlot('initial-plot-div', data, layout);
    }
}

export function makeCandlePlot(plotData, traces) {
    if (!document.getElementById('initial-plot-div')) {
        const plotDiv = document.createElement('div');
    
        plotDiv.setAttribute('id', 'initial-plot-div');
        plotDiv.classList.add('initial-plot-div');

        document.body.appendChild(plotDiv);
    }

    document.getElementById('yaxis-types')?.remove();

    const hours = [];
    const opened = [];
    const closed = [];
    const maxes = [];
    const mins = [];

    for (let i = 0; i < TOOLS_COUNT; i++) {
        opened.push([]);
        closed.push([]);
        maxes.push([]);
        mins.push([]);
    }

    plotData.forEach((hourData) => {
        hours.push(new Date(hourData.date));

        for (let i = 0; i < TOOLS_COUNT; i++) {
            opened[i].push(hourData.data[i * 4]);
            closed[i].push(hourData.data[i * 4 + 1]);
            maxes[i].push(hourData.data[i * 4 + 2]);
            mins[i].push(hourData.data[i * 4 + 3]);
        }
        
    });

    let data = [];

    for (let i = 0; i < TOOLS_COUNT; i++) {
        if (!traces.includes(i)) {
            continue;
        }

        data.push(
            {
                x: hours, 
                close: closed[i], 
                decreasing: {line: {color: '#7F7F7F'}}, 
                high: maxes[i], 
                increasing: {line: {color: '#17BECF'}}, 
                line: {color: 'rgba(31,119,180,1)'}, 
                low: mins[i], 
                open: opened[i],
                type: 'candlestick', 
                name: `Tool ${i + 1}`,
                xaxis: 'x', 
                yaxis: 'y',
              }
        );
    }
      
      let layout = {
        autosize: false,
        width: 1200,
        height: 600,
        margin: {
            pad: 4
        },
        title: 'Initial data',
        xaxis: {
          title: 'Date', 
          type: 'date'
        }, 
        yaxis: { 
          title: 'Value',
          type: 'linear'
        }
      };
      
      Plotly.newPlot('initial-plot-div', data, layout);
}

export function makeHeatPlot(plotData, perTool = 4, markersTypes = MARKERS_OCHL, dataName = 'data_values', plotId = 'heatmap-plot-div') {

    if (!document.getElementById(plotId)) {
        const plotDiv = document.createElement('div');
    
        plotDiv.setAttribute('id', plotId);
        plotDiv.classList.add(plotId);

        document.body.appendChild(plotDiv);
    }

    let hours = [];
    let tools = [];
    let strings = [];

    plotData.forEach((hourData) => {
        hours.push(hourData.date);
    });

    for (let i = 0; i < TOOLS_COUNT * perTool; i++) {
        let zArray = [];
        tools.push(`T. ${Math.floor(i / perTool) + 1}: ${markersTypes[i % perTool]}`);

        plotData.forEach((hourData) => {
            let value = hourData[dataName][i];

            if (value < -1) {
                value = null;
            }
            zArray.push(value);
        });

        strings.push(zArray);
    }

    let data = [
        {
          z: strings,
          x: hours,
          y: tools,
          type: 'heatmap',
          hoverongaps: false,
          colorscale: [
            ['0.0', 'rgb(255, 0, 0)'],
            ['0.5', 'rgb(255, 255, 255)'],
            ['1.0', 'rgb(0, 255, 0)']
          ],
        }
    ];

    let layout = {
        title: 'Heatmap',
        showlegend: true,
        width: 1200,
        height: 700,
        autosize: false
    };
      
    Plotly.newPlot(plotId, data, layout);
}