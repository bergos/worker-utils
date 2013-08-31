
var primeFactor = function(n) {
	if((n&1) == 0)
		return 2;

	for(var i=3; i<Math.floor(Math.sqrt(n)); i++) {
		if((n%i) == 0)
			return i;
	}

	return n;
};


var primeFactors = function(n) {
	var primes = [];

	while(n != 1) {
		var prime = primeFactor(n);

		primes.push(prime);
		n /= prime;
	}

	return primes;
};


self.addEventListener('message', function(event) {
	self.postMessage({
		'n': event.data.n,
		'p': primeFactors(event.data.n)
	});
});
