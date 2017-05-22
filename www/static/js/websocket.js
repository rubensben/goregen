var wsError;
var wsButton = '<button onclick="subscribeSocket();">Reconnect</button>';
var listenAddr = 'localhost:3636';

function setListenAddr(v) {
	listenAddr = v;
}

function initSocket(ws) {
	d3.selectAll('.ws').html('Ok');
	ws.onerror = function (e) {
		console.log('websocket error', e);
	};
	ws.onmessage = function (e) {
		var v = JSON.parse(e.data);
		var state = v['State'];

		d3.selectAll('.vState').html(state);
		if (state === 'Connected') {
			d3.selectAll('.vVoltage').html(v['Voltage'] + 'mV');
			d3.selectAll('.vChargeState').html(v['ChargeState'])
		} else {
			d3.selectAll('.vVoltage').html('-');
			d3.selectAll('.vChargeState').html('-')
		}
	};
	ws.onclose = function (e) {
		d3.selectAll('.vState').html('no connection to goregen');
		d3.selectAll('.vChargeState').html('-');
		d3.selectAll('.vVoltage').html('-');
		d3.selectAll('.ws').html(wsButton);
		ws.onclose = null;
		ws.onerror = null;
		ws.onmessage = null;
	}
}

function subscribeSocket() {
	d3.selectAll('.ws').html('connecting...');
	var ws = new WebSocket('ws://' + listenAddr  + '/subscribe/snapshot?poll=1s');
	wsError = setTimeout(function () {
		d3.selectAll('.vState').html('no connection to goregen');
		var err = 'couldn\'t connect to goregen server, is it running?';
		console.warn(err);
		d3.selectAll('.ws').html(err);
		setTimeout(function () {
			d3.selectAll('.ws').html(wsButton);
		}, 5000);
	}, 1500);
	ws.onopen = function () {
		clearInterval(wsError);
		initSocket(ws);
	};
}