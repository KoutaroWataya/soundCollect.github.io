var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
var is_recognition_activated = false;
var is_sampleCheck_activated = false;
var word;



var dObj = new Date();
var hours;
var minutes;
var seconds;
var str;


var wordCount = 0; //文字数カウントのための変数（最初は基準の数に設定）

var preCount = [0, 0];



var bCount = false;
var Time; // 計測時間

// 開始時間値
let startTime;
// 経過時間値
let elapsedTime = 0;
// 秒数をカウント
let count = 0;



let speed;

const originUrl = 'https://script.google.com/macros/s/AKfycbwSb-m-V_cNxnJp_i8a3YTjPvbIS764HUgrcAgVI3REgsHtX9hy3nrtYQER1msZPQms/exec?';


//idのラジオボタン
let session;
let UniqueID;



function setup() {
  // キャンバスは使わない
  noCanvas();

  // スピーチの切れ目があったときに呼び出す関数を登録
  myRec.onEnd = endSpeech;

  // 随時音声入力をテキスト化する際に呼び出される関数を登録
  myRec.onResult = parseResult;

  // 連続した音声認識は行わない．プログラム内で適時音声認識のstopとstartを制御する
  myRec.continuous = false; // no continuous recognition

  // 読み上げている最中の認識途中の文字列も利用する場合
  myRec.interimResults = false; // allow partial recognition (faster, less accurate)

  // プログラム制御用変数（true: 音声認識利用中を示す）
  is_recognition_activated = false;

  // 認識言語は日本語
  myRec.rec.lang = "ja";

  // start/stop のDOMボタンを押したときに音声認識切り替えを行う
  select("#button_start_or_stop").mouseClicked(toggleSpeechRecognition);

  //ラジオボタンの値をとってくるための部分
  const form1 = document.getElementById("form1");
session = form1.session;
    const form2 = document.getElementById("form2");
UniqueID = form2.ID;
}

var check = 0; //スピード切り替えチェック用の変数

function draw() {
  dObj = new Date();
}

// 認識途中随時呼び出される関数（認識途中の文字列を取得できる）
function parseResult() {
  // javascript native な記述
  // document.getElementById("label").innerHTML = "speaking...";
  select("#label").html("speaking...");

  // javascritp native な記述
  // document.getElementById("text").value = myRec.resultString;
  select("#text").value(myRec.resultString);
}

function toggleSpeechRecognition() {
  // 認識ステータスを反転させる（trueならfalse，falseならtrue）
  is_recognition_activated = !is_recognition_activated;

  // 音声認識アクティベート
  if (is_recognition_activated == true) {
    myRec.rec.lang = "ja"; // 日本語認識
    myRec.start(); // 認識スタート
    this.html("stop"); //ボタンの表示をstopにする
  }
  // 音声認識を停止させる
  else {
    // 音声認識をとめる
    myRec.stop();
    // ボタンの表示をstartにする
    this.html("start");
  }
}

function endSpeech() {
  // 音声認識アクティベート中なら
  if (is_recognition_activated == true) {
    // 認識文字列に何も入っていなければ（タイムアウトでendSpeechになった場合）
    if (!myRec.resultValue) {
      myRec.start(); // start engine
      return;
    }

    // 認識文字列になんか入ってれば
    if (myRec.resultString.length > 0) {
      //wordCountとturnWordCountに認識結果を順に入れる（文字数カウントのため）
      wordCount = wordCount + myRec.resultString.length;

      //sampleCheckがtrueだったらsampleCountを発話数ぶん増やす
      if (is_sampleCheck_activated) {
        sampleCount = sampleCount + myRec.resultString.length;
      }

      //console.log("End");
      document.getElementById("label").innerHTML = "quiet";
      str = getTimeStr(dObj);
      document.getElementById("textarea").innerHTML +=
        str + myRec.resultString + "。" + "\n";
      document.getElementById("text").value = "";
      // console.log(myRec.resultString);

      var XHR = new XMLHttpRequest();
      var url =originUrl + "time="+ str + "&session=" + session.value + "&UniqueID=" + UniqueID.value + "&text=" + myRec.resultString;
      XHR.open("GET", url, true);
      XHR.send(null);

      myRec.resultString = "";
    }

    myRec.start(); // start engine
  }
}

function getTimeStr(dObj) {
  hours = dObj.getHours();
  minutes = dObj.getMinutes();
  seconds = dObj.getSeconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  var str = hours + ":" + minutes + ":" + seconds;
  return str;
}

/*
	指定した時間がたったらtrueを返す
	
	time = 秒
*/
function Count(time) {
  // 時間の経過を計るために一度計測する
  if (!bCount) {
    Time = new Date().getTime();
    bCount = true;
  } else {
    // 実行時間が経過した
    if (Time + time * 1000 <= new Date().getTime()) {
      bCount = false; // もう一度時間を計る
      return true;
    }
  }
  return false;
}

function toggleSampleCheck() {
  // 認識ステータスを反転させる（trueならfalse，falseならtrue）
  is_sampleCheck_activated = !is_sampleCheck_activated;
}





//上の枠を空にする
function clearText() {
  document.getElementById("text").innerHTML = "";
}
//下の枠を空にする
function clearTextarea() {
  document.getElementById("textarea").innerHTML = "";
}



function sendTest(){
  
  dObj = new Date();
  str = getTimeStr(dObj);
  
  var XHR = new XMLHttpRequest();
  let text = "充電　されない";
      var url =originUrl + "time="+ str + "&session=" + session.value + "&UniqueID=" + UniqueID.value + "&text=" + text;
      XHR.open("GET", url, true);
      XHR.send(null);
  console.log("ok");

}
