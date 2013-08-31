
var WorkerUtils = {};

WorkerUtils.isWorker = (self.constructor.toString().indexOf('Worker')>0);

WorkerUtils.Worker = this.Worker;

WorkerUtils.ParallelWorker = function() {
	if(arguments.length == 2) {
		this.workers = new Array();

		for(var i=0; i<arguments[1]; i++)
			this.workers.push(new WorkerUtils.Worker(arguments[0]));
	} else {
		this.workers = arguments[0];
	}

	this.availableWorkers = this.workers.slice(0);
	this.taskQueue = [];
	this.messageListeners = {};
	this.emptyQueueListeners = {};

	var messageHandler = function(workerId, event) {
		var worker = this.workers[workerId];

		this.availableWorkers.push(worker);

		for(var i in this.messageListeners)
			this.messageListeners[i](event);

		if(this.taskQueue.length == 0 && this.availableWorkers.length == this.workers.length) {
			for(var i in this.emptyQueueListeners)
				this.emptyQueueListeners[i](event);
		}

		this.schedule();
	};

	for(var i=0; i<this.workers.length; i++)
		this.workers[i].addEventListener('message', messageHandler.bind(this, i));
};

WorkerUtils.ParallelWorker.prototype.postMessage = function(message, transfer) {
	this.taskQueue.push({message: message, transfer: transfer});
	this.schedule();
};

WorkerUtils.ParallelWorker.prototype.postBroadcastMessage = function(message) {
	for(var i=0; i<this.workers.length; i++)
		this.workers[i].postMessage(message);
};

WorkerUtils.ParallelWorker.prototype.schedule = function() {
	while(this.availableWorkers.length > 0 && this.taskQueue.length > 0) {
		var worker = this.availableWorkers.shift();
		var task = this.taskQueue.shift();

		worker.postMessage(task.message, task.transfer);
	}
};

WorkerUtils.ParallelWorker.prototype.addEventListener = function(type, listener) {
	var length = function(object) {
		return Object.keys(object).length;
	};

	switch(type) {
		case 'message':
			this.messageListeners[length(this.messageListeners)+1] = listener;
			break;
		case 'emptyqueue':
			this.emptyQueueListeners[length(this.emptyQueueListeners)+1] = listener;
			break;
	}
};

WorkerUtils.ParallelWorker.prototype.removeEventListener = function(type, listener) {
	var remove = function(object, value) {
		var keys = Object.keys(object).filter(function(key) {return object[key] === value;});

		for(var i=0; i<keys; i++)
			delete object[keys[i]];
	};

	switch(type) {
		case 'message':
			remove(this.messageListeners, listener);
			break;
		case 'emptyqueue':
			remove(this.emptyQueueListeners, listener);
			break;
	}
};

if(typeof define === 'function')
	define([], function() { return WorkerUtils; });
