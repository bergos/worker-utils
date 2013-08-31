# WorkerUtils

WorkerUtils contains useful functions and classes for [Web Workers](http://www.whatwg.org/specs/web-workers/current-work/).  

## ParallelWorker

A ParallelWorker has a transparent interface to handle multiple Web Workers. Messages will be forwarded to free workers or queued until free workers are available. The worker is not allowed to send intermediate message and must send only a single message for every incoming message at the end of the computation. This is a requirement to detect running/free workers.

### [Constructor(DOMString scriptURL, numberOfWorkers)]

Beside the URL of the worker script the number of worker instances is a required parameter for the constructor.

### void postBroadcastMessage(any message);

The `postBroadcastMessage` method sends a message to all workers. This may be useful for initialization purposes. A response to this message is not required.

### attribute EventHandler emptyqueue;

The `emptyqueue` event is fired when all workers are ready and there are no queued messages.