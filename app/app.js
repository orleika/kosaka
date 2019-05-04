(async (window, speak) => {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
  window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
  const recognition = new window.SpeechRecognition();
  recognition.lang = 'ja-JP';
  recognition.interimResults = false;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;
  recognition.onerror = function (err) {
    console.error(err);
  };
  recognition.onaudioend = function () {
    recognition.stop();
    setTimeout(function () {
      recognition.start();
    }, 1000);
  };
  recognition.onresult = function (event) {
    console.log(event);
    const result = document.getElementById('result');
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }
    const transcript = event.results[event.resultIndex][0].transcript;
    try {
      speak(transcript);
    } catch (err) {
      console.error(err);
    }
    const container = document.createElement('h2');
    container.style['animation-duration'] = `${0.05 * transcript.length}s, .5s`;
    container.appendChild(document.createTextNode(transcript));
    document.getElementById('result').appendChild(container);
    document.getElementById('result').setAttribute('class', 'typewriter');
  };
  recognition.start();
})(window, window.speak || {});
