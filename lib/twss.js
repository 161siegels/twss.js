exports.numWordsInNgram = 1;
exports.numNeighbours = 3;
exports.threshold = 0.5;
var fs = require("fs");
var pos = fs.readFileSync(__dirname + '/positive.txt').toString('utf-8');
var txt = pos.split("\n");
var neg = fs.readFileSync(__dirname + '/negative.txt').toString('utf-8');;
var txt2 = neg.split("\n");
exports.trainingData = {
  pos: txt,
  neg: txt2
};

var trainingSize = 4426;
console.log(exports.trainingData.neg.length)
console.log(exports.trainingData.pos.length)
// Limit the training data to the training size specified
// exports.trainingData.pos.splice(trainingSize);
exports.trainingData.neg.splice(trainingSize);

var classify = {
  nbc: require('./classifier/nbc'),
  knn: require('./classifier/knn')
};

exports.algo = 'nbc';

// This is currently only available for the naive bayes algorithm
exports.probability = exports.prob = function( prompt ) {
  if (exports.algo != 'nbc') throw 'Algorithm not available. Use the nbc algorithm';

  return classify['nbc'].getTwssProbability({
    prompt: prompt,
    trainingData: exports.trainingData,
    numWordsInNgram: exports.numWordsInNgram,
    threshold: exports.threshold
  });
};

exports.is = function( prompt ) {
  var params = {
    prompt: prompt,
    trainingData: exports.trainingData,
    numWordsInNgram: exports.numWordsInNgram
  };

  if (exports.algo == 'nbc') {
    params['threshold'] = exports.threshold;
  }
  else if (exports.algo == 'knn') {
    params['numNeighbours'] = exports.numNeighbours;
  }

  return classify[exports.algo].isTwss( params );
};
